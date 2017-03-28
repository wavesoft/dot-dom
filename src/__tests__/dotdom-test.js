global.Symbol = () => ({})
const dd = require('../dotdom');

describe('.dom', function () {

  describe('#H', function () {

    describe('Factory', function () {

      it('should create vnode without arguments', function () {
        const vdom = dd.H('div');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({c: []});
      });

      it('should create vnode with props', function () {
        const vdom = dd.H('div', {foo: 'bar'});

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({foo: 'bar', c: []});
      });

      it('should create vnode with props and children', function () {
        const cdom = dd.H('div');
        const vdom = dd.H('div', {foo: 'bar'}, cdom);

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          foo: 'bar',
          c: [ cdom ]
        });
      });

      it('should create vnode with props and children as array', function () {
        const cdom1 = dd.H('div');
        const cdom2 = dd.H('div');
        const cdom3 = dd.H('div');
        const vdom = dd.H('div', {foo: 'bar'}, cdom1, [cdom2, cdom3]);

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          foo: 'bar',
          c: [ cdom1, cdom2, cdom3 ]
        });
      });

      it('should create vnode with props and mixed children', function () {
        const cdom = dd.H('div');
        const vdom = dd.H('div', {foo: 'bar'}, 'foo', cdom);

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          foo: 'bar',
          c: [ 'foo', cdom ]
        });
      });

      it('should create vnode with props and string children', function () {
        const vdom = dd.H('div', {foo: 'bar'}, 'foo');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          foo: 'bar',
          c: [ 'foo' ]
        });
      });

      it('should create vnode with only child', function () {
        const vdom = dd.H('div', 'foo');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ 'foo' ]
        });
      });

      it('should create vnode with children', function () {
        const vdom = dd.H('div', 'foo', 'bar', 'baz');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ 'foo', 'bar', 'baz' ]
        });
      });

      it('should create vnode with children in arrays', function () {
        const vdom = dd.H('div', 'foo', ['bar', 'baz']);

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ 'foo', 'bar', 'baz' ]
        });
      });

      it('should create vnode with only mixed children', function () {
        const cdom = dd.H('div');
        const vdom = dd.H('div', cdom, 'foo');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ cdom, 'foo' ]
        });
      });

    });

    describe('Proxy', function () {

      it('H.apply should be proxied', function () {
        const cdom = dd.H('div');
        const vdom = dd.H.apply({}, ['div', cdom, 'foo']);

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ cdom, 'foo' ]
        });
      });

      it('H.call should be proxied', function () {
        const cdom = dd.H('div');
        const vdom = dd.H.call({}, 'div', cdom, 'foo');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ cdom, 'foo' ]
        });
      });

      it('H.<tag> should be a shorthand', function () {
        const cdom = dd.H('div');
        const vdom = dd.H.div(cdom, 'foo');

        expect(vdom.$).toEqual('div');
        expect(vdom.a).toEqual({
          c: [ cdom, 'foo' ]
        });
      });

    });

  });

  describe('#R', function () {
    describe('DOM Manipulation', function () {

      it('should render simple DOM', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('div');

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div></div>'
        );
      });

      it('should render 1-level nested DOM', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('div', dd.H('a'), dd.H('b'));

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div><a></a><b></b></div>'
        );
      });

      it('should render 2-level nested DOM', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('div',
          dd.H('a', dd.H('ul')),
          dd.H('b', dd.H('ol'))
        );

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div><a><ul></ul></a><b><ol></ol></b></div>'
        );
      });

      it('should render text children', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('div', 'foo');

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div>foo</div>'
        );
      });

      it('should render combined dom and text nodes', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('div', dd.H('a'), 'foo', dd.H('b'));

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div><a></a>foo<b></b></div>'
        );
      });

      it('should apply style properties', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('div', {style: {color: 'red'}});

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div style="color: red;"></div>'
        );
      });

      it('should apply element attributes', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('a', {href: '/'});

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<a href="/"></a>'
        );
      });

      it('should apply event handlers', function () {
        const dom = document.createElement('div');
        const callback = jest.fn();
        const vdom = dd.H('a', {href: '/', onclick:callback});

        dd.R(vdom, dom);

        expect(dom.innerHTML).toEqual(
          '<a href="/"></a>'
        );

        const event = new window.MouseEvent('click');
        dom.firstChild.dispatchEvent(event);

        expect(callback).toBeCalled();
      });

      it('should accept props and children', function () {
        const dom = document.createElement('div');
        const vdom = dd.H('a', {href: '/'}, 'test');

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<a href="/">test</a>'
        );
      });

    });

    describe('Lifecycle Methods', function () {

      it('should correctly call .m when mounted', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.m.push(updateHandler);
          return dd.H(props.tag);
        };

        const vdom1 = dd.H(SampleComponent, {tag: 'div'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [dom1, undefined]
        ])
      });

      it('should correctly call .d when DOM element tag changed', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.d.push(updateHandler);
          return dd.H(props.tag);
        };

        const vdom1 = dd.H(SampleComponent, {tag: 'div'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H(SampleComponent, {tag: 'span'});
        dd.R(vdom2, dom)

        const dom2 = dom.firstChild;

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [dom2, dom1]
        ])
      });

      it('should correctly call .d when props change', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.d.push(updateHandler);
          return dd.H('div', {className: props.className});
        };

        const vdom1 = dd.H(SampleComponent, {className: 'foo'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H(SampleComponent, {className: 'bar'});
        dd.R(vdom2, dom)

        const dom2 = dom.firstChild;

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [dom1, dom1]
        ])
      });

      it('should correctly call .u when replaced with plain tag', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.u.push(updateHandler); //updateHandler
          return dd.H(props.tag);
        };

        const vdom1 = dd.H(SampleComponent, {tag: 'div'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H('span');
        dd.R(vdom2, dom)

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [undefined,undefined]
        ])
      });

      it('should correctly call .u when replaced with component', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const ComponentA = (props, state, setState, hooks) => {
          hooks.u.push(updateHandler);
          return dd.H(props.tag);
        };
        const ComponentB = (props, state, setState, hooks) => {
          return dd.H(props.tag);
        };

        const vdom1 = dd.H(ComponentA, {tag: 'div'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H(ComponentB, {tag: 'div'});
        dd.R(vdom2, dom)

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [undefined,undefined]
        ])
      });

      it('should correctly call .m on the component replaced with', function () {
        const dom = document.createElement('div');
        const mountHandler = jest.fn();
        const ComponentA = (props, state, setState, hooks) => {
          return dd.H(props.tag);
        };
        const ComponentB = (props, state, setState, hooks) => {
          hooks.m.push(mountHandler);
          return dd.H(props.tag);
        };

        const vdom1 = dd.H(ComponentA, {tag: 'div'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H(ComponentB, {tag: 'div'});
        dd.R(vdom2, dom)

        const dom2 = dom.firstChild;

        expect(vdom1).not.toBe(vdom2);
        expect(mountHandler.mock.calls.length).toEqual(1)
        expect(mountHandler.mock.calls).toEqual([
          [dom2, dom1]
        ])
      });

      it('should correctly call .u when removed', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.u.push(updateHandler);
          return dd.H(props.tag);
        };

        const vdom1 = dd.H(SampleComponent, {tag: 'div'});
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        dd.R([], dom)

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [undefined,undefined]
        ])
      });

      it('should correctly call .u when removed as a deep child', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.u.push(updateHandler);
          return dd.H(props.tag);
        };

        const vdom1 = dd.H('div',
          dd.H('div',
            dd.H(SampleComponent, {tag: 'div'})
          )
        );
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        dd.R([], dom)

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [undefined,undefined]
        ])
      });

      it('should correctly call .u when removed as a deep child because of root replacement', function () {
        const dom = document.createElement('div');
        const updateHandler = jest.fn();
        const SampleComponent = (props, state, setState, hooks) => {
          hooks.u.push(updateHandler);
          return dd.H(props.tag);
        };
        const ComponentA = (props, state, setState, hooks) => {
          return dd.H('div', props.c);
        };
        const ComponentB = (props, state, setState, hooks) => {
          return dd.H('div', props.c);
        };

        const vdom1 = dd.H('div',
          dd.H(ComponentA,
            dd.H(SampleComponent, {tag: 'div'})
          )
        );
        dd.R(vdom1, dom)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H('div',
          dd.H(ComponentB)
        );

        dd.R([], dom)

        expect(updateHandler.mock.calls.length).toEqual(1)
        expect(updateHandler.mock.calls).toEqual([
          [undefined,undefined]
        ])
      });

      it('should correctly call .m, .d, .u in a mount, update, unmount cycle', function () {
        const dom = document.createElement('div');
        const mHandler = jest.fn();
        const dHandler = jest.fn();
        const uHandler = jest.fn();

        const SampleComponent = (props, state, setState, hooks) => {
          hooks.m.push(mHandler);
          hooks.d.push(dHandler);
          hooks.u.push(uHandler);
          return dd.H('div', {className: props.className});
        };

        const vdom1 = dd.H(SampleComponent, {className: 'foo'});
        dd.R(vdom1, dom)

        expect(mHandler.mock.calls.length).toEqual(1)
        expect(dHandler.mock.calls.length).toEqual(0)
        expect(uHandler.mock.calls.length).toEqual(0)

        const dom1 = dom.firstChild;

        const vdom2 = dd.H(SampleComponent, {className: 'bar'});
        dd.R(vdom2, dom)

        expect(mHandler.mock.calls.length).toEqual(1)
        expect(dHandler.mock.calls.length).toEqual(1)
        expect(uHandler.mock.calls.length).toEqual(0)

        const dom2 = dom.firstChild;

        dd.R([], dom)

        expect(mHandler.mock.calls.length).toEqual(1)
        expect(dHandler.mock.calls.length).toEqual(1)
        expect(uHandler.mock.calls.length).toEqual(1)

      });
    });

    describe('Reconciliation', function () {
      it('should not replace DOM if tag & props are the same', function () {
        const dom = document.createElement('div');
        const vdom1 = dd.H('div');
        const vdom2 = dd.H('div');

        dd.R(vdom1, dom)
        const c1 = dom.firstChild;

        dd.R(vdom2, dom)
        const c2 = dom.firstChild;

        expect(c1).toBe(c2);
      });

      it('should replace DOM if tag has changed', function () {
        const dom = document.createElement('div');
        const vdom1 = dd.H('div');
        const vdom2 = dd.H('span');

        dd.R(vdom1, dom)
        const c1 = dom.firstChild;

        dd.R(vdom2, dom)
        const c2 = dom.firstChild;

        expect(c1).not.toBe(c2);
      });

      it('should not replace DOM if props have changed', function () {
        const dom = document.createElement('div');
        const vdom1 = dd.H('div', {foo: 1});
        const vdom2 = dd.H('div', {foo: 2});

        dd.R(vdom1, dom)
        const c1 = dom.firstChild;

        dd.R(vdom2, dom)
        const c2 = dom.firstChild;

        expect(c1).toBe(c2);
      });

      it('should not replace DOM if only children have changed', function () {
        const dom = document.createElement('div');
        const vdom1 = dd.H('div', dd.H('span', 'foo'));
        const vdom2 = dd.H('div', dd.H('span', 'bar'));

        dd.R(vdom1, dom)
        const c1 = dom.firstChild;

        dd.R(vdom2, dom)
        const c2 = dom.firstChild;

        expect(c1).toBe(c2);
      });

      it('should add new DOM elements keeping the old ones intact', function () {
        const dom = document.createElement('div');
        const vdom1 = [dd.H('div')];
        const vdom2 = [dd.H('div'), dd.H('span')];

        dd.R(vdom1, dom)
        const c1 = dom.firstChild;
        expect(dom.children.length).toEqual(1);

        dd.R(vdom2, dom)
        const c2 = dom.firstChild;
        expect(dom.children.length).toEqual(2);

        expect(c1).toBe(c2);
      });

      it('should remove excess DOM elements', function () {
        const dom = document.createElement('div');
        const vdom1 = [dd.H('div'), dd.H('span')];
        const vdom2 = [dd.H('div')];

        dd.R(vdom1, dom)
        expect(dom.children.length).toEqual(2);

        dd.R(vdom2, dom)
        expect(dom.children.length).toEqual(1);
      });
    });

    describe('Components', function () {
      it('should render simple component', function () {
        const dom = document.createElement('div');
        const Component = function() {
          return dd.H('div')
        }
        const vdom = dd.H(Component);

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div></div>'
        );
      });

      it('should render nested components', function () {
        const dom = document.createElement('div');
        const Component = function() {
          return dd.H('div')
        }
        const HostComponent = function() {
          return dd.H('div',
            dd.H(Component),
            dd.H(Component)
          )
        }
        const vdom = dd.H(HostComponent);

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div><div></div><div></div></div>'
        );
      });

      it('should render component with props', function () {
        const dom = document.createElement('div');
        const Component = function(props) {
          return dd.H('a', {href: props.href})
        }
        const vdom = dd.H(Component, {href: '/'});

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<a href="/"></a>'
        );
      });

      it('should render stateful components', function () {
        const dom = document.createElement('div');
        const Component = function(props, {href='/'}) {
          return dd.H('a', {
            href: href
          })
        }
        const vdom = dd.H(Component, {href: '/'});

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<a href="/"></a>'
        );
      });

      it('should update stateful components', function () {
        const dom = document.createElement('div');
        const Component = function(props, {clicks=0}, setState) {
          return dd.H('button', {
            onclick() {
              setState({
                clicks: clicks + 1
              })
            }
          }, `${clicks} clicks`)
        }
        const vdom = dd.H(Component);

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<button>0 clicks</button>'
        );

        const event = new window.MouseEvent('click');

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button>1 clicks</button>'
        );

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button>2 clicks</button>'
        );
      });

      it('should update independently parallel stateful components', function () {
        const dom = document.createElement('div');
        const Component = function(props, {clicks=0}, setState) {
          return dd.H('button', {
            onclick() {
              setState({
                clicks: clicks + 1
              })
            }
          }, `${clicks} clicks`)
        }
        const vdom = dd.H('div',
          dd.H(Component),
          dd.H(Component)
        );

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div><button>0 clicks</button><button>0 clicks</button></div>'
        );

        const event = new window.MouseEvent('click');

        dom.firstChild.childNodes[0].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<div><button>1 clicks</button><button>0 clicks</button></div>'
        );

        dom.firstChild.childNodes[0].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<div><button>2 clicks</button><button>0 clicks</button></div>'
        );

        dom.firstChild.childNodes[1].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<div><button>2 clicks</button><button>1 clicks</button></div>'
        );

        dom.firstChild.childNodes[1].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<div><button>2 clicks</button><button>2 clicks</button></div>'
        );

        dom.firstChild.childNodes[0].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<div><button>3 clicks</button><button>2 clicks</button></div>'
        );
      });

      it('should maintain state of child components', function () {
        const dom = document.createElement('div');
        const Component = function(props, {clicks=0}, setState) {
          return dd.H('button', {
            onclick() {
              setState({
                clicks: clicks + 1
              })
            }
          }, `${clicks} clicks`)
        }
        const HostComponent = function(props, {clicks=0}, setState) {
          return dd.H('button',
            {
              onclick() {
                setState({
                  clicks: clicks + 1
                })
              }
            },
            dd.H('div', `${clicks} clicks`),
            dd.H(Component),
            dd.H(Component)
          )
        }
        const vdom = dd.H(HostComponent);

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<button><div>0 clicks</div><button>0 clicks</button><button>0 clicks</button></button>'
        );

        const event = new window.MouseEvent('click');

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button>0 clicks</button><button>0 clicks</button></button>'
        );

        dom.firstChild.childNodes[1].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button>1 clicks</button><button>0 clicks</button></button>'
        );

        dom.firstChild.childNodes[1].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button>2 clicks</button><button>0 clicks</button></button>'
        );

        dom.firstChild.childNodes[2].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button>2 clicks</button><button>1 clicks</button></button>'
        );

        dom.firstChild.childNodes[2].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button>2 clicks</button><button>2 clicks</button></button>'
        );

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>2 clicks</div><button>2 clicks</button><button>2 clicks</button></button>'
        );
      });

      it('should discard child state when it\'s type changes', function () {
        const dom = document.createElement('div');
        const ComponentA = function(props, {clicks=0}, setState) {
          return dd.H('button', {
            title: 'a',
            onclick() {
              setState({
                clicks: clicks + 1
              })
            }
          }, `${clicks} clicks`)
        }
        const ComponentB = function(props, {clicks=0}, setState) {
          return dd.H('button', {
            title: 'b',
            onclick() {
              setState({
                clicks: clicks + 1
              })
            }
          }, `${clicks} clicks`)
        }
        const HostComponent = function(props, {clicks=0}, setState) {
          const children = [];
          if (clicks % 2) {
            children.push(dd.H(ComponentA));
            children.push(dd.H(ComponentB));
          } else {
            children.push(dd.H(ComponentB));
            children.push(dd.H(ComponentA));
          }

          return dd.H('button',
            {
              onclick() {
                setState({
                  clicks: clicks + 1
                })
              }
            },
            dd.H('div', `${clicks} clicks`),
            children[0],
            children[1]
          )
        }
        const vdom = dd.H(HostComponent);

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<button><div>0 clicks</div><button title="b">0 clicks</button><button title="a">0 clicks</button></button>'
        );

        const event = new window.MouseEvent('click');

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button title="a">0 clicks</button><button title="b">0 clicks</button></button>'
        );

        dom.firstChild.childNodes[1].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button title="a">1 clicks</button><button title="b">0 clicks</button></button>'
        );

        dom.firstChild.childNodes[2].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>1 clicks</div><button title="a">1 clicks</button><button title="b">1 clicks</button></button>'
        );

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>2 clicks</div><button title="b">0 clicks</button><button title="a">0 clicks</button></button>'
        );

        dom.firstChild.childNodes[1].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>2 clicks</div><button title="b">1 clicks</button><button title="a">0 clicks</button></button>'
        );

        dom.firstChild.childNodes[2].dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>2 clicks</div><button title="b">1 clicks</button><button title="a">1 clicks</button></button>'
        );

        dom.firstChild.dispatchEvent(event);
        expect(dom.innerHTML).toEqual(
          '<button><div>3 clicks</div><button title="a">0 clicks</button><button title="b">0 clicks</button></button>'
        );
      });

    });

    describe('Tag Shorthands', function () {

      it(`should dynamically create tag shorthands`, function () {
        const dom = document.createElement('div');
        const {div} = dd.H;
        const vdom = div();

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          `<div></div>`
        );
      });

      it('should expand className shorthands', function () {
        const dom = document.createElement('div');
        const {div} = dd.H;
        const vdom = div.class1();

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div class=" class1"></div>'
        );
      })

      it('should expand multiple className shorthands', function () {
        const dom = document.createElement('div');
        const {div} = dd.H;
        const vdom = div.class1.class2.class3();

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div class=" class1 class2 class3"></div>'
        );
      })

      it('should append className shorthands on className props', function () {
        const dom = document.createElement('div');
        const {div} = dd.H;
        const vdom = div.class1.class2.class3({className: 'foo'});

        dd.R(vdom, dom)

        expect(dom.innerHTML).toEqual(
          '<div class="foo class1 class2 class3"></div>'
        );
      })
    });
  });

});
