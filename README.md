# .dom [![Build Status](https://travis-ci.org/wavesoft/dot-dom.svg?branch=master)](https://travis-ci.org/wavesoft/dot-dom)

> A tiny (510 byte) virtual DOM template engine for embedded projects

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /> IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" /> Opera | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" /> iOS Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" /> Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge 14+ | 45+ | 49+ | 10+ | 37+ | 10.2+ | 55+

**.dom** borrows some concepts from React.js (such as the re-usable Components and the Virtual DOM) and tries to replicate them with the smallest possible footprint, exploiting the ES6 javascript features.

Why? Because with such library you can create powerful GUIs in tight space environments, such as IoT devices, where saving even an extra byte actually matters!

## Installation

For minimum footprint, include `dotdom.min.js.gz` (510b) to your project.

```html
<script src="dotdom.min.js.gz" />
```

Alternatively you can just include the minified version of the library directly before your script. Just copy-paste the following (729b):

```js
((a,b,c,d,e,f,g,h)=>{String.prototype[d]=1,a.H=f=(j,k={},...l)=>({[d]:1,E:j,P:k[d]&&l.unshift(k)&&{C:l}||(k.C=l)&&k}),a.R=g=(j,k,l='',m,n=j.E)=>j.trim?k.appendChild(b.createTextNode(j)):n.call?(m=(o=[{}],p=o[1]==n?o[0]:(e[l]=[{}])[0],q)=>q=g(n(j.P,p,r=>k.replaceChild(m(e[l]=[c.assign(p,r),n]),q)),k,l))(e[l]):c.keys(j.P).reduce((o,p,q,r,s=j.P[p])=>('C'==p?s.map((t,u)=>g(t,o,l+'.'+u)):'style'==p?c.assign(o[p],s):o[p]=s,o),k.appendChild(b.createElement(n))),h=j=>new Proxy(j,{get:(k,l,m)=>h((...n)=>((m=k(...n)).P.className=[m.P.className]+' '+l,m))}),'a.b.button.i.span.div.img.p.h1.h2.h3.h4.table.tr.td.th.ul.ol.li.form.input.label.select.option'.split('.').map(j=>a[j]=h(f.bind(a,j)))})(window,document,Object,Symbol(),{});
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

### Tag + Class Shorthand `tag.class( [properties], [children ...] )`

```js
h1.short( 'short header', span.strong( 'strong text' ) )
button.primary({onclick: handleClick}, 'Primary Action')
p.bold.italic( twitterPost )
```

Instead of providing the `className` as a property, you can use the `.className` shorthand in combination with the shorthand tag methods.

This is the same as calling `div({className: 'className'})` and the function interface is exactly the same as above.

*Note:* You can add more than one class by concatenating more than one `.class` to the tag. For example: `div.foo.bar` is the same as `div({className: 'foo bar'})`.

## Caveats

- **There is currently no proper child reconciliation algorithm.** This means that if you call `R()` on a DOM element for a second time you will end-up appending the new data. Also, this means that most of the DOM is re-created on every `setState`, so use it with caution.

## Contribution

Are you interested in contributing to **.dom**? You are more than welcome! Just be sure to follow the guidelines:

1. *Always explain your code with a comment* : Since you will most probably going to do some extreme javascript corner cases in order to be able to squeeze your logic.
2. *All comments should start on column 70 and wrap after column 100* : In order to perserve code-style consistency.
3. *The GZipped result should __never__ be bigger than 512 bytes* : Since that's the whole purpose of the library. If you are adding a completely new feature, consider sacraficing another one, or try to reduce scope, in order to keep the balance.

