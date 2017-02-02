((global, document, Object, vnodeFlag, expandTags, createElement, render) => {

  // Make all strings considered child nodes
  String.prototype[vnodeFlag] = 1;

  /**
   * Create a VNode element
   */
  global.H = createElement = (element, props={}, ...children) => ({
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
   * Render the given VNode structure given to the DOM element given
   *
   * @param {VNode} - A VNode instance, created with `createElement`
   * @param {DOMElement} - The HTML DOM element
   * @returns {DOMElement} - The rendered DOM element
   */
  global.R = render = (vnode, dom, _render, _element=vnode.E, _props=vnode.P) =>

    vnode.trim                                                        // Strings have a `.trim` function

    ? dom.appendChild(                                                // ** String Node **
        document.createTextNode(vnode)
      )

    : _element.call                                                   // If element is a functional component, it
                                                                      // will have the 'call' property defined.

                                                                      // ** Stateful Render **

    ? (_render = (state, _instance) =>                                // Create a heper function that will be called
                                                                      // when the component has changed.

        _instance = render(                                           // Keep a reference to the DOM element mounted in
                                                                      // order to be able to remove it on update

          _element(                                                   // Call the component function passing down:
            _props,                                                   // 1) Properties
            state,                                                    // 2) State
            (newState) =>                                             // 3) setState(newState) function
                dom.replaceChild(                                     // We trigger a new render cycle, replacing
                  _render(                                            // the old DOM element with the render result.

                    Object.assign(                                    // We pass down to the render function the updated
                      state,                                          // state.
                      newState
                    )

                  ),
                  _instance
                )
          ),
          dom
        )
      )({})                                                           // Initial call of the render cycle

                                                                      // ** Native Render **

    : Object.keys(_props)                                             // We are going to apply the properties by
                                                                      // iterating on each property individually
      .reduce(
        (
          instance,                                                   // Reference to the new DOM element
          key,                                                        // The property to apply
          index,                                                      // Not used
          array,                                                      // Not used
          _value=_props[key]                                          // Local reference to the property value
        ) =>
          (
            key == 'C' ?                                              // ## Children ##

              _value.map((child) =>                                   // DOM VNodes are iterated through
                  render(
                    child,
                    instance
                  )
                )

            /* OR */

            : key == 'style' ?                                        // ## Style ##

              Object.assign(                                          // Style property is applied recursively to the
                instance[key],                                        // CSS style of the element instance.
                _value
              )

            /* OR */

            : /^on/.exec(key) ?                                       // ## Callbacks ##

              instance.addEventListener(                              // Properties starting with `on` are registered
                key.substr(2),                                        // as event listeners to the DOM instance
                _value
              )

            /* OR */

            : instance.setAttribute(                                  // ## Attributes ##
                key,                                                  // Any other properties are assigned as attributes
                _value
              )

          ) && instance || instance                                   // Make sure to *always* return the instance

      ,                                                               // We are passing to the reduce function a new
                                                                      // child mounted to the DOM element

        dom.appendChild(                                              // We are appending to the `dom` argument a new
          document.createElement(
            _element
          )
        )
      )

  /**
   * Expand some of the default tags
   */
  expandTags
    .split('.')
    .map(
      (dom) =>
        global[dom] = createElement.bind(global, dom)
    )

})(window, document, Object, Symbol(), 'a.b.button.i.span.div.img.p.h1.h2.h3.h4.table.tr.td.th.ul.ol.li.form.input.select');
