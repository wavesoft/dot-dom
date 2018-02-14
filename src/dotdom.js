/**
 * .dom - A Tiny VDom Template Engine
 *
 * Copyright 2017 Ioannis Charalampidis (wavesoft)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* BEGIN NPM-GLUE */

// This code block will be striped when building the stand-alone version.
// When using `npm` this exports the correct functions in order to be easily
// imported in the correct scope, without leaking to the global scope.

const window = {};
module.exports = window;

/* END NPM-GLUE */

((global, document, Object, vnodeFlag, createElement, render, wrapClassProxy, anonIndex = 0) => {

  /**
   * Put the `vnodeFlag` to all strings in order to be considered as virtual
   * dom nodes.
   */
  String.prototype[vnodeFlag] = 1;

  /**
   * Create a VNode element
   *
   * @param {String|Function} element - The tag name or the component to render
   * @param {Object} [props] - The object properties
   * @param {Array} [children] - The child VNode elements
   * @returns {VNode} Returns a virtual DOM instance
   */
  createElement = (element, props={}, ...children) => ({
    [vnodeFlag]: 1,                                                   // The vnodeFlag symbol is used by the code
                                                                      // in the 'P' property to check if the `props`
                                                                      // argument is not an object, but a renderable
                                                                      // VNode child

    E: element,                                                       // 'E' holds the name or function passed as
                                                                      // first argument

    P: props[vnodeFlag]                                               // If the props argument is a renderable VNode,
        ? {C: [].concat(props, ...children)}                          // ... prepend it to the children
        : (props.C = [].concat(...children)) && props                 // ... otherwise append 'C' to the property
                                                                      // the .concat ensures that arrays of children
                                                                      // will be flattened into a single array.
  })

  /**
   * Render a VNode in the DOM
   *
   * @param {VNode|Array<VNode>} vnodes - The node on an array of nodes to render
   * @param {HTLDomElement}
   */
  global.R = render = (
    vnodes,                                                           // 1. The vnode tree to render
    dom,                                                              // 2. The DOMElement where to render into

    _baseState={},                                                    // a. The base path state object
    _children=dom.childNodes,                                         // b. Shorthand for accessing the children
    _c=0,                                                             // c. Counter for processed children
    _t=0,                                                             // d. Timeout container for rerendering nodes
    _r=1                                                              // e. Rendering bit to prevent infinite loops
  ) => {
    function nrender(

                                                                      // In this `map` loop we ensure that the DOM
                                                                      // elements correspond to the correct virtual
                                                                      // node elements.
        vnode,                                                        // 1. We handle the vnode from the array
        index,                                                        // 2. And the index

        _unused1,                                                     // We don't handle the array, but we need the
                                                                      // placeholder for the local variables after
        _pathState,
        _path,
        __c = _c,                                                     // a. Store the current _c index
        _child=_children[_c++],                                       // b. Get the next DOM child + increment counter
        _new_dom,                                                     // c. The new DOM element placeholder
        nnode = vnode                                                 // d. The new node

      ) {
      
        if(!_pathState) {                                             // If path state is not set
          if(vnode.E && vnode.E.call && !vnode.E.name && !vnode.E._id)// Adds unique identifier for anonymous functions
            vnode.E._id = ++anonIndex
          _path = index + (vnode.E ? ('.' + (vnode.E.trim ? vnode.E : // a. Get the address to the path state based
              vnode.E.call ?                                          // on index and tag / component name
                (vnode.E.name || vnode.E._id || '*') : '')) : '')
          _pathState = _baseState[_path] =                            // b. Retrieve path state for this vnode
            _baseState[_path] || [0, new Proxy({}, {                  // c. Update base [cache, nodeState(proxy), childrenState]
          
              deleteProperty(target, name) {                          // i. deleteProperty (i.e. delete object[name])
                timer()                                               //   Each of the proxy handlers calls the timer
                delete target[name]                                   //   function that sets up component re-rendering
              },
              set(target, name, value) {                              // ii. set (i.e. object[name] = value
                timer()
                target[name] = value
              },
              get: function(target, name) {                           // iii. get (i.e. console.log(object[name])
                timer()
                return target[name]
              }
            }),{}]
        }
        
        function timer(newState = {}) {
          if(_r) return                                               // Don't run if rendering
          if(_t) clearTimeout(_t)
          _t = setTimeout(() => update(newState))                     // Setup a timer to call the state updater
        }
        
        function update(newState = {}) {                              // 3. The setState function
          _r = 1                                                      // First set the rendering bit to 1
          _c = __c                                                    // Then set the iterator to the stored index
          nrender(                                                    // We then trigger the same render cycle that will
            vnode,                                                    // update the DOM
            index,                                                    // vnode index
            0,                                                        // 0 for _unused1
            _pathState                                                // Current path state to be re-used
          )
          _r = 0                                                      // Set rendering bit to 0
        }

        /* Expand functional Components */

        while(nnode.E && nnode.E.call) {                              
          nnode.E.data = _pathState[1]
            
          nnode = nnode.E(                                            // If the vnode is a functional component, expand
                                                                      // it and replace the current vnode variable.

            nnode.P,                                                  // 1. The component properties
            _pathState[1]                                             // 2. The proxied state
          )
        }
        
        if(nnode.constructor === Array) {
          nnode = H('div', {}, nnode)                                 // Creates a wrapper div for lists of vnodes
        }


        /* Create new DOM element */

        _new_dom = _pathState[0] && (_pathState[0].E == nnode.E) ? 
          _pathState[0] :                                             // We prepare the new DOM element in advance in
          nnode.trim                                                  // order to spare a few comparison bytes
            ? document.createTextNode(nnode)
            : document.createElement(nnode.E);


        /* Keep or replace the previous DOM element */

        (_new_dom = 
          _child                                                      // If we have a previous child we first check if
            ? ((_child.E != nnode.E || _child !== _new_dom) &&        // the VNode element or the text are the same
            _child.data != nnode)

              ? dom.replaceChild(                                     // - If not, we replace the old element with the
                  _new_dom,                                           //   new one.
                  _child
                ) && _new_dom                                         //   ... and we make sure we return the new DOM

              : _child                                                // - If it's the same, we keep the old child

            : dom.appendChild(                                        // If we don't have a previous child, just append
                _new_dom
              )
        ).E = nnode.E;                                                // We keep the vnode element to the .E property in
                                                                      // order for the above comparison to work.
        /* Set Cache */

        _pathState[0] = _new_dom                                      // Cache element in path state

        /* Update Element */

        nnode.trim
          ? (_new_dom.data !== nnode ? _new_dom.data = nnode : null)  // - String nodes update only the text
          : Object.keys(nnode.P).map(                                 // - Element nodes have properties
              (
                key                                                   // 1. The property name
              ) =>

                key == 'style' ?                                      // The 'style' property is an object and must be
                                                                      // applied recursively.
                  Object.assign(
                    _new_dom[key],                                    // '[key]' is shorter than '.style'
                    nnode.P[key]
                  )

                : (_new_dom[key] !== nnode.P[key] &&                  // All properties are applied directly to DOM, as
                  (_new_dom[key] = nnode.P[key]))                     // long as they are different than ther value in the
                                                                      // instance. This includes `onXXX` event handlers.

            ) &&
            render(                                                   // Only if we have an element (and not  text node)
              nnode.P.C,                                              // we recursively continue rendering into it's
              _new_dom,                                               // child nodes.
              _pathState[2]
            )
      }
    (vnodes.map ? vnodes : [vnodes]).map(nrender);                    // Cast `vnodes` to array if nor already

    /* Remove extraneous nodes */

    while (_children[_c])                                             // The _c property keeps track of the number of
      dom.removeChild(_children[_c])                                  // elements in the VDom. If there are more child
                                                                      // nodes in the DOM, we remove them.
    
    _r = 0                                                            // Reset rendering bit
  }

  /**
   * Helper function that wraps an element shorthand function with a proxy
   * that can be used to append class names to the instance.
   *
   * The result is wrapped with the same function, creating a chainable mechanism
   * for appending classes.
   *
   * @param {function} factoryFn - The factory function to call for creating vnode
   */
  wrapClassProxy = (factoryFn) =>
    new Proxy(                                                        // We are creating a proxy object for every tag in
                                                                      // order to be able to customize the class name
                                                                      // via a shorthand call.
      factoryFn,
      {
        get: (targetFn, className, _instance) =>
          wrapClassProxy(
            (...args) => (
              (_instance=targetFn(...args))                           // We first create the Virtual DOM instance by
                                                                      // calling the wrapped factory function

                .P.className =                                        // And then we assign the class name,
                  [_instance.P.className] + ' ' + className,          // concatenating to the previous value

              _instance                                               // And finally we return the instance
            )
          )
      }
    )

  /**
   * Expose as `H` a proxy around the createElement function that can either be used
   * either as a function (ex. `H('div')`, or as a proxied method `H.div()` for creating
   * virtual DOM elements.
   */
  global.H = new Proxy(
    createElement,
    {
      get: (targetFn, tagName) =>
        targetFn[tagName] || wrapClassProxy(
          createElement.bind(global, tagName)
        )
    }
  )

})(window, document, Object, Symbol());
