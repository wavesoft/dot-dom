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

var window = typeof window !== "undefined" && window || {};
module.exports = window;

/* END NPM-GLUE */


  /**
   * Create a VNode element
   *
   * @param {String|Function} element - The tag name or the component to render
   * @param {Object} [props] - The object properties
   * @param {Array} [children] - The child VNode elements
   * @returns {VNode} Returns a virtual DOM instance
   */
  let c = (element, props={}, ...children) => (
    element = ({                                                      // The reference of `element` will be kept
                                                                      // in the object so we are safe to replace it

      $: element,                                                     // 'E' holds the name or function passed as
                                                                      // first argument

      a: (props.$ || props.trim || props.map)                         // If the props argument is a renderable VNode,
                                                                      // a string or an array, then

          ? {c: [].concat(props, ...children)}                        // ... prepend it to the children
          : (props.c = [].concat(...children)) && props               // ... otherwise append 'C' to the property
                                                                      // the .concat ensures that arrays of children
                                                                      // will be flattened into a single array.

      }
    ),

    // element.a.className = element.a.className || '',               // Ensure `className` always exist, since this
                                                                      // way we can cleanly replace className when
                                                                      // removed.
    element
  )

  , z = (a = [], b, c) => a.map(e => e(b, c))                         // z is a helper method that calls all methods in
                                                                      // an array of functions (used for life cycle hooks)

  , o = Object.assign                                                 // o is just an Object.assign short-hand helper
                                                                      // which helps save some bytes in the end

  /**
   * Render a VNode in the DOM
   *
   * @param {VNode|Array<VNode>} vnodes - The node on an array of nodes to render
   * @param {HTLDomElement}
   */
  let r = window.R = (
    vnodes,                                                           // 1. The vnode tree to render
    dom,                                                              // 2. The DOMElement where to render into

    _npath,                                                           // a. The current state path
    _children=dom.childNodes,                                         // b. Shorthand for accessing the children
    _c=0                                                              // c. Counter for processed children
  ) => {

    (vnodes.map ? vnodes : [vnodes]).map(                             // Cast `vnodes` to array if nor already

                                                                      // In this `map` loop we ensure that the DOM
                                                                      // elements correspond to the correct virtual
                                                                      // node elements.
      (
        vnode,                                                        // 1. We handle the vnode from the array
        index,                                                        // 2. And the index

        _unused1,                                                     // We don't handle the array, but we need the
                                                                      // placeholder for the local variables after

        _path=_npath+' '+index,                                       // a. The state path of this vnode
        _path_state=w[_path] || [{}, vnode.$],                        // b. Get the state record for this path
        _state=(                                                      // c. Update and get the state record
          w[_path] =                                                  //    The record is an the following format:
            _path_state[1] != vnode.$                                 //  [ {state object},
            ? [{}, vnode.$]                                           //    'vnode element' ]
            : _path_state                                             //    The second component is needed in order to
        ),                                                            //    reset the state if the component has changed
        _child=_children[_c++],                                       // d. Get the next DOM child + increment counter
        _hooks={a:vnode.$,m:[],u:[],d:[]},
        _new_dom                                                      // e. The new DOM element placeholder

      ) => {

        /* Expand functional Components */

        (vnode.$ || _unused1).call &&                                 // (This expands to : vnode.$ && vnode.$.call &&)
                                                                      // If the vnode is a functional component, expand
          (vnode = vnode.$(                                           // it and replace the current vnode variable.

            vnode.a,                                                  // 1. The component properties
            _state[0],                                                // 2. The stateful component state

            (newState) =>                                             // 3. The setState function

              o(                                                      // First we update the state part of the record
                _state[0],                                            // Note: When we defined the variable we kept the
                newState                                              //       reference to the record array
              ) &&

              r(                                                      // We then trigger the same render cycle that will
                vnodes,                                               // update the DOM
                dom,
                _npath
              ),

              _hooks

          ));

        /* Create new DOM element */

        _new_dom =                                                    // We prepare the new DOM element in advance in
          vnode.trim                                                  // order to spare a few comparison bytes
            ? document.createTextNode(vnode)
            : document.createElement(vnode.$);

        /* Keep or replace the previous DOM element */

        _new_dom =
          _child                                                      // If we have a previous child we first check if
            ? (_child.$ != vnode.$ && _child.data != vnode)           // the VNode element or the text are the same

              ? (
                  dom.replaceChild(                                   // - If not, we replace the old element with the
                    _new_dom,                                         //   new one.
                    _child
                  ),
                  _new_dom                                            //   ... and we make sure we return the new DOM
                )
              : _child                                                // - If it's the same, we keep the old child

            : dom.appendChild(                                        // mount lifecycle method and append
                _new_dom
              );

        /* Call lifecycle methods */

        z(
          _child
            ? _child.a != _hooks.a
              ? (z(_child.u), _hooks.m)
              : _hooks.d
            : _hooks.m
        ,_new_dom, _child);

        /* Update Element */

        o(_new_dom, vnode, _hooks);                                   // Keep the following information in the DOM:
                                                                      // - $ : The tag name from the vnode. We use this
                                                                      //       instead of the .tagName because some
                                                                      //       browsers convert it to capital-case
                                                                      // - u : The `didUnmount` hook that is called when
                                                                      //       the DOM element is removed
                                                                      //
                                                                      // By assigning the entire _hooks and vnode
                                                                      // objects we expose some unneeded properties, but
                                                                      // it occupies less space than assigning $ and u
                                                                      // individually.

        vnode.trim
          ? _new_dom.data = vnode                                     // - String nodes update only the text
          : o(
              _new_dom,
              vnode.a
            )
            &&
            o(
              _new_dom.style,
              vnode.a.style
            )
            &&
            r(                                                        // Only if we have an element (and not  text node)
              vnode.a.c,                                              // we recursively continue rendering into it's
              _new_dom,                                               // child nodes.
              _path
            )
      }
    );

    /* Remove extraneous nodes */

    while (_children[_c]) {                                           // The _c property keeps track of the number of
                                                                      // elements in the VDom. If there are more child
                                                                      // nodes in the DOM, we remove them.

      z(_children[_c].u)                                              // We then call the unmount lifecycle method for the
                                                                      // elements that will be removed

      r(                                                              // Remove child an trigger a recursive child removal
        [],                                                           // in order to call the correct lifecycle methods in our
        dom.removeChild(_children[_c])                                // deep children too.
      )
    }

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
  let w = (factoryFn) =>
    new Proxy(                                                        // We are creating a proxy object for every tag in
                                                                      // order to be able to customize the class name
                                                                      // via a shorthand call.
      factoryFn,
      {
        get: (targetFn, className, _instance) =>
          w(
            (...args) => (
              (_instance=targetFn(...args))                           // We first create the Virtual DOM instance by
                                                                      // calling the wrapped factory function

                .a.className = (_instance.a.className || '')          // And then we assign the class name,
                               + ' ' + className,                     // concatenating to the previous value

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
  window.H = new Proxy(
    c,
    {
      get: (targetFn, tagName) =>
        targetFn[tagName] ||                                          // Make sure we don't override any native
                                                                      // property or method from the base function

        w(                                                            // Otherwise, for every tag we extract a
          c.bind(global, tagName)                                     // class-wrapped crateElement method, bound to the
        )                                                             // tag named as the property requested.
    }
  )
