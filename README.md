# .dom [![Build Status](https://travis-ci.org/wavesoft/dotdom.svg?branch=master)](https://travis-ci.org/wavesoft/dotdom)


> A tiny (455 byte) virtual DOM template engine for embedded projects

**.dom** borrows some concepts from React.js (such as the Virtual DOM) and tries to immitate them with the least possible code. Why would you consider even doing this? Because with such library you can create powerful GUIs in tight space environments, such as IoT devices.

## Installation

For minimum footprint, include `dotdom.min.js.gz` (455b) to your project.

```html
<script src="dotdom.min.js.gz" />
```

Alternatively you can just include the minified version of the library directly before your script. Just copy-paste the following (636b):

```js
((a,b,c,d,e,f,g,h={})=>{String.prototype[d]=1,a.H=f=(j,k={},...l)=>({[d]:1,E:j,P:k[d]&&l.unshift(k)&&{C:l}||(k.C=l)&&k}),a.R=g=(j,k,l='',m,n=j.E,o=j.P)=>j.trim?k.appendChild(b.createTextNode(j)):n.call?(m=(p=[{}],q=p[1]==n?p[0]:(h[l]=[{}])[0],r)=>r=g(n(o,q,s=>k.replaceChild(m(h[l]=[c.assign(q,s),n]),r)),k,l))(h[l]):c.keys(o).reduce((p,q,r,s,t=o[q])=>('C'==q?t.map((u,v)=>g(u,p,l+'.'+v)):'style'==q?c.assign(p[q],t):p[q]=t)&&p||p,k.appendChild(b.createElement(n))),'a.b.button.i.span.div.img.p.h1.h2.h3.h4.table.tr.td.th.ul.ol.li.form.input.label.select.option'.split('.').map(j=>a[j]=f.bind(a,j))})(window,document,Object,Symbol());
```

## Examples

If you already know React.js, the following examples can help you understand how
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

Creating a component on which you can pass properties.

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

Creating components that can maintain their own state.

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

Renders the given VNode tree to the given DOM element. Further updates from
stateful components will only occur on their immediate children.

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

The following tags are available as shorthand methods:

> a, b, button, div, form, h1, h2, h3, h4, i, img, input, label, li, ol,
> option, p, select, span, table, td, th, tr, ul

## Caveats

- **There is currently no proper child reconciliation algorithm.** This means that if you call `R()` on a DOM element for a second time you will end-up appending the new data. Also, this means that most of the DOM is re-created on every `setState`, so use it with caution.
