# .dom

> A tiny (450 byte) virtual DOM template engine for embedded projects

**.dom** borrows some principles from React.js, such as the *Virtual DOM* and
the *Functional Components*, while trying to achieve minimal size footprint.

Of course, it's nothing even close to React, rather a tiny alternative with some functional relations to React, for use in super-tight space requirements (like an IoT web server).

## Installation

Just include `dotdom.min.js` to your project.

```html
<script src="dotdom.min.js" />
```

Or include this snippet before your script:

```js
((a,b,c,d,e,f,g)=>{String.prototype[d]=1,a.H=f=(h,i={},...j)=>({[d]:1,E:h,P:i[d]&&j.unshift(i)&&{C:j}||(i.C=j)&&i}),a.R=g=(h,i,j,k=h.E,l=h.P)=>h.trim?i.appendChild(b.createTextNode(h)):k.call?(j=(m,n)=>n=g(k(l,m,o=>i.replaceChild(j(c.assign(m,o)),n)),i))({}):c.keys(l).reduce((m,n,o,p,q=l[n])=>('C'==n?q.map(r=>g(r,m)):'style'==n?c.assign(m[n],q):/^on/.exec(n)?m.addEventListener(n.substr(2),q):m.setAttribute(n,q))&&m||m,i.appendChild(b.createElement(k))),e.split('.').map(h=>a[h]=f.bind(a,h))})(window,document,Object,Symbol(),'a.b.button.i.span.div.img.p.h1.h2.h3.h4.table.tr.td.th.ul.ol.li.form.input.select');
```

## Examples

If you already know React.js, the following examples can help you understand
the .dom primitives relate to React.

#### 1. Plain DOM

Rendering a very simple DOM structure.

<table width="100%">
  <tr>
    <th>React</th>
    <th>.dom</th>
  </tr>
  <tr>
    <td valign="top">
<pre lang="javascript">
ReactDOM.render(
  React.createElement('div', null, 'Hello world'),
  document.body
);
</pre>
    </td>
    <td valign="top">
<pre lang="javascript">
R(
  div('Hello world'),
  document.body
)
</pre>
    </td>
  </tr>
</table>

#### 2. Simple component

How to create a component on which you can pass properties.

<table width="100%">
  <tr>
    <th>React</th>
    <th>.dom</th>
  </tr>
  <tr>
    <td valign="top">
<pre lang="javascript">
class Hello extends React.Component {
  render() {
    return React.createElement(
      'div', null, `Hello ${this.props.toWhat}`
    );
  }
}

ReactDOM.render(
  React.createElement(
    Hello, {toWhat: 'World'}, null
  ),
  document.body
);
</pre>
    </td>
    <td valign="top">
<pre lang="javascript">
function Hello(props) {
  return div(`Hello ${props.toWhat}`);
}

R(
  H(Hello, {toWhat: 'World'}),
  document.body
)
</pre>
    </td>
  </tr>
</table>

#### 3. Stateful component

Components can have their own state.

<table width="100%">
  <tr>
    <th>React</th>
    <th>.dom</th>
  </tr>
  <tr>
    <td valign="top">
<pre lang="javascript">
class Clickable extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      clicks: 0
    };
  }

  render() {
    const {clicks} = this.state;

    return React.createElement(
      'buton', {
        onClick() {
          this.setState({clicks: clicks+1})
        }
      }, `Clicked ${clicks} times`
    );
  }
}

ReactDOM.render(
  React.createElement('div', null,
    React.createElement(Clickable, null, null),
    React.createElement(Clickable, null, null)
  ),
  document.body
);
</pre>
    </td>
    <td valign="top">
<pre lang="javascript">
function Clickable(props, state, setState) {
  const {clicks=0} = state;

  return button(
    {
      onclick() {
        setState({clicks: clicks+1})
      }
    },
    `Clicked ${clicks} times`
  );
}

R(
  div(
    H(Clickable),
    H(Clickable)
  ),
  document.body
)
</pre>
    </td>
  </tr>
</table>

## API Reference

### Render `R( VNode, DOMElement )`

```js
R( div('Hello'), document.body )
```

Renders the given VNode tree to the given DOM element.

### Create Element `H( tagName | function, [properties], [children ...])`

```js
H( 'tag' )
H( 'tag', {prop: "value"})
H( 'tag', H( 'child' ))
H( 'tag', {prop: "value"}, H( 'child' ))
H( Component, {prop: "value"} )
```

Creates a VNode element. If a string is passed as the first argument, it will
create a HTML element. If a function is given, it will create a stateful
component.

Properties and children are optional and they can be ommitted.

### Tag Shorthand `tag( [properties], [children ...] )`

```js
div( 'hello', span( 'world' ) )
div( 'click', a({href: '#'}, 'Here'), 'to continue')
```

A shorthand function for creating most of the commonly-used HTML tags. This
behaves exactly like `H`, but with the tag name already populated.

## Caveats

- **There is currently no proper child reconciliation algorithm.** This means that if you call `R()` on a DOM element for a second time you will end-up appending the new data.
- **Since there is no reconciliation, you cannot perserve state of nested stateful components**. This means that if you nest two stateful components and the parent one changes state, the child will reset to it's default values. To mitigate this, use only one root stateful component and use plain components (passing down properties) for all the children
