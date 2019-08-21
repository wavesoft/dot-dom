/**
 * .dom - A Tiny VDom Template Engine
 *
 * Copyright 2017-2019 Ioannis Charalampidis (wavesoft)
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

(() => {
  let

  /**
   * Create a VNode element
   *
   * @param {String|Function} element - The tag name or the component to render
   * @param {Object} [props] - The object properties
   * @param {Array} [children] - The child VNode elements
   * @returns {VNode} Returns a virtual DOM instance
   */
  createElement = (element, props={}, ...children) => (
    {

      $: element,                                                     // '$' holds the name or function passed as
                                                                      // first argument

      a: (!props || props.$ || props.concat)                          // If the props argument is false/null, a renderable
                                                                      // VNode, a string, an array (.concat exists on both
                                                                      // strings and arrays), or a DOM element, then ...

          ? {c: [].concat(props || [], ...children)}                  // ... create props just with children
          : ((props.c = [].concat(...children)), props)               // ... otherwise append 'c' to the property set
                                                                      // (the .concat ensures that arrays of children
                                                                      // will be flattened into a single array).
    }
  )

  /**
   * Helper method that calls all methods in an array of functions
   *
   * @param {Array} methods - The array of methods to call
   * @param {Object} arg1 - An arbitrary first argument
   * @param {Object} arg2 - An arbitrary second argument
   */
  , callLifecycleMethods = (methods = [], arg1, arg2) =>
      methods.map(e => e(arg1, arg2))                                 // Fan-out to the lifecycle methods, passing the
                                                                      // maximum of 2 arguments (spread operator takes
                                                                      // more space when compressed)

  /**
   * Helper function that wraps an element shorthand function with a proxy
   * that can be used to append class names to the instance.
   *
   * The result is wrapped with the same function, creating a chainable mechanism
   * for appending classes.
   *
   * @param {function} factoryFn - The factory function to call for creating vnode
   */
  , wrapClassProxy = factoryFn =>
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

                .a.className = (_instance.a.className || ' ')         // And then we assign the class name,
                               + ' ' + className,                     // concatenating to the previous value

              _instance                                               // And finally we return the instance
            )
          )
      }
    )

  /**
   * Render a VNode in the DOM
   *
   * @param {VNode|Array<VNode>} vnodes - The node on an array of nodes to render
   * @param {HTMLDomElement}
   */
  , render = window.R = (
    vnodes,                                                           // 1. The vnode tree to render
    dom,                                                              // 2. The DOMElement where to render into

    _children=dom.childNodes,                                         // a. Shorthand for accessing the children
    _c=0                                                              // b. Counter for processed children
  ) => {

    [].concat(vnodes).map(                                            // Cast `vnodes` to array if nor already

                                                                      // In this `map` loop we ensure that the DOM
                                                                      // elements correspond to the correct virtual
                                                                      // node elements.
      (
        vnode,                                                        // 1. We handle the vnode from the array
        _new_dom,                                                     // 2. We ignore the index, and instead we are using
                                                                      //    it as the new DOM element placeholder
        _callMethod,                                                  // 3. We ignore the array, and instead we are using
                                                                      //    it as a variable where we are keeping the
                                                                      //    lifecycle method to call at the end.
        _child=_children[_c++],                                       // a. Get the next DOM child + increment counter
        _state=vnode.s=(                                              // b. Get the current state from the DOM child and keep
                                                                      //    a copy in the vnode object.
          _child                                                      //    Separate comparison logic if there is a child or not
            ? ((_child.a == vnode.$)                                  //    - If the element has changed, bail
                && (vnode.s                                           //    - If there is a state in the VNode, prefer it
                || _child.s))                                         //    - If there is a state in the DOM node, fall back to it
            : vnode.s                                                 //    - If there is no element, use VNode state, if present
        ) || {},                                                      //    - Default state value
        _hooks={                                                      // c. Prepare the hooks object that will be passed
                                                                      //    down to the functional component
          a: vnode.$,                                                 //    - The 'a' property is keeping a reference
                                                                      //      to the element (property '$') and is used
                                                                      //      for space-optimal assignment of the tag to
                                                                      //      the DOM element through Object.assign in the
                                                                      //      Update Element phase later.
          s: _state,                                                  //    - The 's' property is keeping a reference to
                                                                      //      the current element state. (Used above)
          m: [],                                                      //    - The 'm' property contains the `mount` cb
          u: [],                                                      //    - The 'u' property contains the `unmount` cb
          d: []                                                       //    - The 'd' property contains the `update` cb
        }

      ) => {

        /* Expand functional Components */

        for (;(vnode.$ || vnodes).bind;)                              // Expand recursive functional components until
                                                                      // we encounter a non-callable element. (The `vnodes` is
                                                                      // used as a reference to any kind of an object in order
                                                                      // to be able to resolve `.bind`, even if it's undefined).
          vnode = vnode.$(

            vnode.a,                                                  // 1. The component properties
            _state,                                                   // 2. The stateful component state

            (newState) =>                                             // 3. The setState function

              Object.assign(                                          // First we update the state record, that also
                _state,                                               // updates the contents of the DOM element, since
                newState                                              // the reference is perserved.
              ) &&
              render(                                                 // We then trigger the same render cycle that will
                vnodes,                                               // update the DOM
                dom
              ),

            _hooks                                                    // 4. The lifecycle method hooks

          );

        /* Create new DOM element */
        _new_dom =
          vnode.replace                                               // in order to save a few comparison bytes later.
            ? document.createTextNode(vnode)
            : document.createElement(vnode.$);

        /* Keep or replace the previous DOM element */

        _new_dom =
          _child                                                      // If we have a previous child, do some reconciliation
            ? (_child.$ != vnode.$ && _child.data != vnode)           // Check if the node tag has changed.
              ? (
                  dom.replaceChild(                                   // - If not, we replace the old element with the
                    _new_dom,                                         //   new one.
                    _child
                  ),
                  _new_dom                                            //   ... and we make sure we return the new DOM
                )
              : _child                                                // - If it's the same, we keep the old child

            : dom.appendChild(                                        // If we did not have a previous child, just
                _new_dom                                              // append the new node
              )

        /* Prepare lifecycle methods */

        _callMethod =                                                 // We are not calling the method until we are done with
                                                                      // the rendering cycle. Otherwise this could cause an
                                                                      // infinite loop if `setState` is used.

          _child                                                      // If there is a DOM reflection
            ? _child.a == _hooks.a                                    // .. and the element has not changed
              ? _hooks.d                                              // - [D] Just update
              : (
                  callLifecycleMethods(_child.u),                     // - [U] Otherwise unmount the previous one
                  render(                                             //   And call the render function with empty
                    [],                                               //   children in order to recursively unmount
                    _child                                            //   the children tree.
                  ),
                  _hooks.m                                            // - [M] Mount the new
                )

                                                                      // If there is no DOM reflection
            : _hooks.m;                                               // - [M] Mount the new

        /* Update Element State */

        Object.assign(_new_dom, vnode, _hooks);                       // Keep the following information in the DOM:
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

        /* Apply properties to the DOM element */
        vnode.replace
          ? _new_dom.data = vnode                                   // - String nodes update only the text
          : Object.keys(vnode.a).map(                               // - Element nodes have properties
              (
                key                                                 // 1. The property name
              ) =>

                key == 'style' ?                                    // The 'style' property is an object and must be
                                                                    // applied recursively.
                  Object.assign(
                    _new_dom[key],                                  // '[key]' is shorter than '.style'
                    vnode.a[key]
                  )

                : (_new_dom[key] !== vnode.a[key] &&                // All properties are applied directly to DOM, as
                  (_new_dom[key] = vnode.a[key]))                   // long as they are different than ther value in the
                                                                    // instance. This includes `onXXX` event handlers.

            ) && _hooks.r ||                                        // If the user has marked this element as 'raw', do not
                                                                    // continue to it's children. Failing to do so, will damage
                                                                    // the element contents

            render(                                                 // Only if we have an element (and not text node)
              vnode.a.c,                                            // we recursively continue rendering into it's
              _new_dom                                              // child nodes.
            )

        /* Call life-cycle methods */

        callLifecycleMethods(
          _callMethod,
                                                                      // Pass the following arguments:
          _new_dom,                                                   // 1. The new DOM instance
          _child                                                      // 2. The old DOM instance
        );

      }
    );

    /* Remove extraneous nodes */

    for (;_children[_c];)   {                                         // The _c property keeps track of the number of
                                                                      // elements in the VDom. If there are more child
                                                                      // nodes in the DOM, we remove them.

      callLifecycleMethods(_children[_c].u)                           // We then call the unmount lifecycle method for the
                                                                      // elements that will be removed

      render(                                                         // Remove child an trigger a recursive child removal
        [],                                                           // in order to call the correct lifecycle methods in our
        dom.removeChild(_children[_c])                                // deep children too.
      )

    }
  }

  /**
   * Expose as `H` a proxy around the createElement function that can either be used
   * either as a function (ex. `H('div')`, or as a proxied method `H.div()` for creating
   * virtual DOM elements.
   */
  window.H = new Proxy(
    createElement,
    {
      get: (targetFn, tagName) =>
        targetFn[tagName] ||                                          // Make sure we don't override any native
                                                                      // property or method from the base function

        wrapClassProxy(                                               // Otherwise, for every tag we extract a
          createElement.bind(targetFn, tagName)                       // class-wrapped crateElement method, bound to the
        )                                                             // tag named as the property requested. We are not
                                                                      // using 'this', therefore we are using any reference
    }                                                                 // that could lead on reduced code footprint.
  )
})()
