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

((window) => {

  /**
   * Helper for creating new Virtual DOM element
   *
   * @param {String|Function}  element - The element or the component function
   * @param {Object|String|VDom|Array} props - The properties of the new element, a child array, or the first child
   * @param {Array} children - The virtual DOM children
   * @return {VDom} Returns the VDom element
   */
  let createElement = (element, props={}, ...children) => (
      {

        $: element,                                                   // '$' holds the name or function passed as
                                                                      // first argument

        a: (!props || props.$ || props.concat)                        // If the props argument is false/null, a renderable
                                                                      // VNode, a string, an array (.concat exists on both
                                                                      // strings and arrays), or a DOM element, then ...

            ? {c: [].concat(props || [], ...children)}                // ... create props just with children
            : ((props.c = [].concat(...children)), props)             // ... otherwise append 'c' to the property set
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
  let callLifecycleMethods = (methods = [], arg1) =>
      methods.map(e => e(arg1))                                       // Fan-out to the lifecycle methods

  /**
   * Recursively expand stateful components
   *
   * @param {VDom} vnode - The virtual node that might or might not be a component
   * @param {Object} hooks - The hooks and node meta-data
   * @return {VDom} Returns the VDom element
   */
  let expandStateful = (vnode, hooks, rerender) =>
    (vnode.$ || hooks).bind                                           // Avoid 'undefined' case when resolving bind
      ? expandStateful(
          vnode.$(
            vnode.a,                                                  // 1. The component properties
            hooks.s,                                                  // 2. The stateful component state

            (newState) =>                                             // 3. The setState function

              Object.assign(                                          // First we update the state record, that also
                hooks.s,                                              // updates the contents of the DOM element, since
                newState                                              // the reference is perserved.
              ) &&
              rerender(),                                             // And then we call-out to the re-render function
                                                                      // that holds the correct variable scopes.

            hooks                                                     // 4. The lifecycle method hooks
          ),
          hooks,
          rerender
        )
      : vnode;                                                        // If this is not a functional component, return


  /**
   * Perform propery-level reconciliation on the given DOM node
   *
   * @param {HTMLElement} node - The DOM element to reconcile
   * @param {VDom} vnode - The Virtual DOM element to reconcile to
   * @param {Object} hooks - The hooks and node meta-data
   * @return {VDom} Tries hard to return the same VDonde as the first argument
   */
  let updateDom = (node, vnode, hooks) => (
    vnode.$
      ? Object.keys(vnode.a).map(                                     // - Element nodes have properties
          (
            key                                                       // 1. The property name
          ) =>

            key == 'style' ?                                          // The 'style' property is an object and must be
                                                                      // applied recursively.
              Object.assign(
                node[key],                                            // '[key]' is shorter than '.style'
                vnode.a[key]
              )

            : (node[key] != vnode.a[key] &&                           // All properties are applied directly to DOM, as
              (node[key] = vnode.a[key]))                             // long as they are different than ther value in the
                                                                      // instance. This includes `onXXX` event handlers.

        ) &&
        (vnode.a.k = hooks.k) &&                                      // Explicitly update the key property of the virtual node
                                                                      // in order to enable dynamic re-ordering when re-ordering
                                                                      // the VDom instance

        (hooks.r ||                                                   // If the user has marked this element as 'raw', do not
                                                                      // continue to it's children. Failing to do so, will damage
                                                                      // the element contents

        render(                                                       // Only if we have an element (and not text node)
          vnode.a.c,                                                  // we recursively continue rendering into it's
          node                                                        // child nodes.
        )) || callLifecycleMethods(hooks.d)
      : (node.data != vnode) &&                                       // - String nodes update only the text content is changed
        (node.data = vnode),
    Object.assign(node, hooks),
    node
  )

  /**
   * Helper function that wraps an element shorthand function with a proxy
   * that can be used to append class names to the instance.
   *
   * The result is wrapped with the same function, creating a chainable mechanism
   * for appending classes.
   *
   * @param {function} factoryFn - The factory function to call for creating vnode
   */
  let wrapClassProxy = factoryFn =>
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
    );

  /**
   * Main render function
   *
   * @param {[]VNode|VNode} vnodes - The VDom nodes to reconcile
   * @param {HTMLElement} - The DOM node whose children to reconcile
   */
  let render = window.R = (
    vnodes,
    dom,
    _index = {},
    _children = [].concat(...dom.childNodes),
    _lastNode = _children[0],
    _reorder_flag
  ) =>

    [].concat(vnodes).map(
      (
        vnode,
        idx,
        _reserved,

        _key = (                                                      // Calculate the node reconciliation key
          (vnode.a || vnode).k ||                                     // a. Either use the user-given value
          ('' + vnode.$                                               // b. Or compose an ID using the node type
              + (_index[vnode.$] |= _index[vnode.$] + 1)              //    and a monotonically incrementing number
          )                                                           // (Note that text nodes intentionally get the
        ),                                                            // implicit key 'undefined')

        _prev_idx,
        _prevnode = [].concat(...                                     // Find the previous DOM node instance that
          _children.map(                                              // has the same key as the one given.
            (child, idx) => child.k == _key
                      ? _children.splice(_prev_idx = idx, 1)          // We must also remove successful finds from
                      : []                                            // the array of children in order to identify
         )                                                            // removed entities.
        )[0],

        _hooks = {                                                    // Prepare the hooks array that is going to be passed
                                                                      // as an argument to the stateful components as argument.
                                                                      //
                                                                      // We are also exploiting this object to perserve imporarnt
                                                                      // meta-data in the instance of the VNode itself
                                                                      //
          k: _key,                                                    //    - The 'k' property keeps the reconciliation key
          s: (_prevnode || _reserved).s || {},                        //    - The 's' property keeps the state of the object
          m: [],                                                      //    - The 'm' property contains the `mount` cb
          u: [],                                                      //    - The 'u' property contains the `unmount` cb
          d: []                                                       //    - The 'd' property contains the `update` cb
        },

        _xvnode = expandStateful(                                     // Recursively expand the stateful component functions until
          vnode,                                                      // we have reached the
          _hooks,
          () => render(vnodes, dom)
        ),
        _new_node =                                                   // The new DOM element that we might have to create
          _xvnode.$                                                   // in order to save a few comparison bytes later.
            ? document.createElement(_xvnode.$)
            : document.createTextNode(_xvnode)

      ) =>
        callLifecycleMethods(
          updateDom(
            _lastNode =                                               // Keep track of the node we just added because we will need
                                                                      // it for the next iteration and for the last part of the
                                                                      // current function call.

              (_reorder_flag =                                        // If the node is correctly ordered, it should always appear
                _reorder_flag ||                                      // on index 0. Otherwise, that node and all the consecutive
                (_prev_idx != 0)                                      // children should be re-ordered.
              )
                ? dom.insertBefore(                                   // a. If the node should be re-ordered, place it right after
                    _prevnode || _new_node,                           //    the last known item.
                    _lastNode && _lastNode.nextSibling
                  )
                : _prevnode,                                          // b. Otherwise keep the reference
            _xvnode,
            _hooks
          ) == _new_node
            ? _hooks.m                                                // .m - If this is a new node call mount
            : _hooks.d,                                               // .d - Otherwise call update
          _lastNode
        )

    ) &&
    _children.map(
      (node) => (
        callLifecycleMethods(node.u, node) &&
        render(
          [],
          dom.removeChild(node)
        )
      )
    );

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

})(window)
