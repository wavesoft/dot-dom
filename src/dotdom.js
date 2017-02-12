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
((global, document, Object, vnodeFlag, globalState, createElement, render, wrapClassProxy) => {

  /**
   * Put the `vnodeFlag` to all strings in order to be considered as virtual
   * dom nodes.
   */
  String.prototype[vnodeFlag] = 1;

  /**
   * Create a VNode element
   *
   * @param {String|Function} eleent - The tag name or the component to render
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
        && children.unshift(props) && {C: children}                   // ... prepend it to the children
        || (props.C = children) && props                              // ... otherwise append 'C' to the property
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

    _npath='',                                                        // a. The current state path
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

        _path=_npath+'.'+index,                                       // a. The state path of this vnode
        _path_state=globalState[_path] || [{}, vnode.E],              // b. Get the state record for this path
        _state=(                                                      // c. Update and get the state record
          globalState[_path] =                                        //    The record is an the following format:
            _path_state[1] != vnode.E                                 //  [ {state object},
            ? [{}, vnode.E]                                           //    'vnode element' ]
            : _path_state                                             //    The second component is needed in order to
        ),                                                            //    reset the state if the component has changed
        _child=_children[_c++],                                       // d. Get the next DOM child + increment counter
        _new_dom                                                      // e. The new DOM element placeholder

      ) => {

        /* Expand functional Components */

        vnode.E && vnode.E.call &&                                    // If the vnode is a functional component, expand
          (vnode = vnode.E(                                           // it and replace the current vnode variable.

            vnode.P,                                                  // 1. The component properties
            _state[0],                                                // 2. The stateful component state
            (newState) =>                                             // 3. The setState function

              Object.assign(                                          // First we update the state part of the record
                _state[0],                                            // Note: When we defined the variable we kept the
                newState                                              //       reference to the record array
              ) &&

              render(                                                 // We then trigger the same render cycle that will
                vnodes,                                               // update the DOM
                dom,
                _npath
              )

          ));

        /* Create new DOM element */

        _new_dom =                                                    // We prepare the new DOM element in advance in
          vnode.trim                                                  // order to spare a few comparison bytes
            ? document.createTextNode(vnode)
            : document.createElement(vnode.E);


        /* Keep or replace the previous DOM element */

        (_new_dom =
          _child                                                      // If we have a previous child we first check if
            ? (_child.E != vnode.E && _child.data != vnode)           // the VNode element or the text are the same

              ? dom.replaceChild(                                     // - If not, we replace the old element with the
                  _new_dom,                                           //   new one.
                  _child
                ) && _new_dom                                         //   ... and we make sure we return the new DOM

              : _child                                                // - If it's the same, we keep the old child

            : dom.appendChild(                                        // If we don't have a previous child, just append
                _new_dom
              )
        ).E = vnode.E;                                                // We keep the vnode element to the .E property in
                                                                      // order for the above comparison to work.

        /* Update Element */

        vnode.trim
          ? _new_dom.data = vnode                                     // - String nodes update only the text
          : Object.keys(vnode.P).map(                                 // - Element nodes have properties
              (
                key,                                                  // 1. The property name

                _unused2,                                             // 2. Index is unused
                _unused3,                                             // 3. Array is unused

                _value=vnode.P[key]                                   // a. We cache the property value

              ) =>

                key == 'style' ?                                      // The 'style' property is an object and must be
                                                                      // applied recursively.
                  Object.assign(
                    _new_dom[key],                                    // '[key]' is shorter than '.style'
                    _value
                  )

                : (key != 'C' &&                                      // 'C' is the children, so we skip it

                  (_new_dom[key] = _value))                           // All properties are applied directly to DOM
                                                                      // instance. This includes `onXXX` event handlers.

            ) &&
            render(                                                   // Only if we have an element (and not  text node)
              vnode.P.C,                                              // we recursively continue rendering into it's
              _new_dom,                                               // child nodes.
              _path
            )
      }
    );

    /* Remove extraneous nodes */

    while (_children[_c])                                             // The _c property keeps track of the number of
      dom.removeChild(_children[_c])                                  // elements in the VDom. If there are more child
  }                                                                   // nodes in the DOM, we remove them.

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
      get: (_unused4, tagName) =>
        wrapClassProxy(
          createElement.bind(global, tagName)
        )
    }
  )

})(window, document, Object, Symbol(), {});
