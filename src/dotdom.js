((global, document, Object, vnodeFlag, globalState, createElement, render, wrapClassProxy) => {

  // Make all strings considered child nodes
  String.prototype[vnodeFlag] = 1;

  /**
   * Create a VNode element
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
   */
  global.R = render = (
    vnodes,                                                           // The vnode tree to render
    dom,

    _npath='',
    _children=dom.childNodes,
    _c=0

  ) => {
    (vnodes.map ? vnodes : [vnodes]).map(
      (
        vnode,
        index,

        _unused1,
        _path=_npath+'.'+index,
        _path_state=globalState[_path] || [{}, vnode.E],
        _state=(
          globalState[_path] =
            _path_state[1] != vnode.E
            ? [{}, vnode.E]
            : _path_state
        ),
        _child=_children[_c++],
        _new_dom

      ) => {

        vnode.E && vnode.E.call &&
          (vnode = vnode.E(
            vnode.P,
            _state[0],
            (newState) =>
              Object.assign(
                _state[0],
                newState
              ) &&
              render(
                vnodes,
                dom
              )
          ));

        _new_dom =
          vnode.trim
            ? document.createTextNode(vnode)
            : document.createElement(vnode.E);

        (_new_dom =
          _child
            ? (_child.E != vnode.E && _child.data != vnode)
              ? dom.replaceChild(
                  _new_dom,
                  _child
                ) && _child
              : _child
            : dom.appendChild(
                _new_dom
              )
        ).E = vnode.E;

        vnode.trim
          ? _new_dom.data = vnode
          : Object.keys(vnode.P).map(
              (
                key,

                _unused2,
                _unused3,
                _value=vnode.P[key]

              ) =>

                key == 'style' ?

                  Object.assign(
                    _new_dom[key],
                    _value
                  )

                : (key != 'C' &&

                  (_new_dom[key] = _value))

            ) &&
            render(
              vnode.P.C,
              _new_dom,
              _path
            )
      }
    )
    while (_children[_c])
      dom.removeChild(_children[_c])
  }

  /**
   * Helper function that wraps an element shorthand function with a proxy
   * that can be used to append class names to the instance.
   */
  wrapClassProxy = (wrapFn) =>
    new Proxy(                                                        // We are creating a proxy object for every
                                                                      // tag in order to be able to customize the
                                                                      // class name via a shorthand
      wrapFn,
      {
        get: (targetFn, className, _instance) =>
          wrapClassProxy(
            (...args) => (
              (_instance=targetFn(...args))                           // We first create the Virtual DOM instance
                                                                      // by calling the constructor (chain)

                .P.className =                                        // And then we assign the class name,
                  [_instance.P.className] + ' ' + className,          // concatenating to the previous value

              _instance                                               // And finally we return the instance
            )
          )
      }
    )

  /**
   * Make a proxy around the createElement function that can either
   * be used as a function, or as a proxied method for creating elements.
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

// const {div, button} = H;

// const Counter = (_, {counter=0}, setState) => {
//   // setTimeout(
//   //   () => {
//   //     setState({counter: counter+1})
//   //   },
//   //   1000
//   // );

//   return button(
//     {
//       onclick() {
//         setState({counter: counter+1})
//       }
//     },
//     `Ticked ${counter} times`
//   );
// }

// const App = () =>
//   div(
//     div('Some data'),
//     H(Counter),
//     H(Counter)
//   )

// R(H(App), document.body)
