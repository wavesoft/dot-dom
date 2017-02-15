# .dom [![Build Status](https://travis-ci.org/wavesoft/dot-dom.svg?branch=master)](https://travis-ci.org/wavesoft/dot-dom)

> A tiny (510 byte) virtual DOM template engine for embedded projects

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /> IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" /> Opera | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" /> iOS Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" /> Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge 14+ | 45+ | 49+ | 10+ | 37+ | 10.2+ | 55+

**.dom** borrows some concepts from React.js (such as the re-usable Components and the Virtual DOM) and tries to replicate them with the smallest possible footprint, exploiting the ES6 javascript features.

Why? Because with such library you can create powerful GUIs in tight space environments, such as IoT devices, where saving even an extra byte actually matters!

[Try it in codepen.io](https://codepen.io/anon/pen/YNdNwv?editors=0010)

## Installation

For minimum footprint, include `dotdom.min.js.gz` (510b) to your project.

```html
<script src="dotdom.min.js.gz" />
```

Alternatively you can just include the minified version of the library directly before your script. Just copy-paste the following (755b):

```js
((a,b,c,d,e,f,g,h)=>{String.prototype[d]=1,f=(i,j={},...k)=>({[d]:1,E:i,P:j[d]&&k.unshift(j)&&{C:k}||(j.C=k)&&j}),a.R=g=(i,j,k='',l=j.childNodes,m=0)=>{for((i.map?i:[i]).map((n,o,p,q=k+'.'+o,r=e[q]||[{},n.E],s=e[q]=r[1]==n.E?r:[{},n.E],t=l[m++],u)=>{n.E&&n.E.call&&(n=n.E(n.P,s[0],v=>c.assign(s[0],v)&&g(i,j,k))),u=n.trim?b.createTextNode(n):b.createElement(n.E),(u=t?t.E!=n.E&&t.data!=n?j.replaceChild(u,t)&&u:t:j.appendChild(u)).E=n.E,n.trim?u.data=n:c.keys(n.P).map((v,w,x,y=n.P[v])=>'style'==v?c.assign(u[v],y):'C'!=v&&(u[v]=y))&&g(n.P.C,u,q)});l[m];)j.removeChild(l[m])},h=i=>new Proxy(i,{get:(j,k,l)=>h((...m)=>((l=j(...m)).P.className=[l.P.className]+' '+k,l))}),a.H=new Proxy(f,{get:(i,j)=>h(f.bind(a,j))})})(window,document,Object,Symbol(),{});
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
  H('div', 'Hello world'),
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
  return H('div', `Hello ${props.toWhat}`);
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
      'button', {
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

  return H('button',
    {
      onclick() {
        setState({clicks: clicks+1})
      }
    },
    `Clicked ${clicks} times`
  );
}

R(
  H('div',
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
R( H('div', 'Hello'), document.body )
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

Properties and children are optional and they can be omitted.

### Tag Shorthand `tag( [properties], [children ...] )`

```js
const {div, span, a} = H;

div( 'hello', span( 'world' ) )
div( 'click', a({href: '#'}, 'Here'), 'to continue')
```

A shorthand function can be extracted as a property from the `H` function. Such
shorthands behave exactly like `H`, but with the tag name already populated.

It's recommended to use a deconstructuring assignment in the beginning of your
script in order to help javascript minifiers further optimize the result:

```
const {div, span, a, button} = H;
```

### Tag + Class Shorthand `tag.class( [properties], [children ...] )`

```js
const {h1, span, p} = H;

h1.short( 'short header', span.strong( 'strong text' ) )
button.primary({onclick: handleClick}, 'Primary Action')
p.bold.italic( twitterPost )
```

Instead of providing the `className` as a property, you can use the `.className` shorthand in combination with the shorthand tag methods.

This is the same as calling `div({className: 'className'})` and the function interface is exactly the same as above.

*Note:* You can add more than one class by concatenating more than one `.class` to the tag. For example: `div.foo.bar` is the same as `div({className: 'foo bar'})`.

## Caveats

* You cannot trigger an update with a property removal. You **must** set the new property to an empty value instead. For example:

  ```js
  // Wrong
  R(div({className: 'foo'}), document.body);
  R(div({}), document.body);

  // Correct
  R(div({className: 'foo'}), document.body);
  R(div({className: ''}), document.body);
  ```

* You **must** never use a property named `$` in your components. Doing so, will make the property object to be considered as a Virtual DOM Node and will lead to unexpected results.

  ```js
  // *NEVER* do this!
  R(H(MyComponent, {$: 'Foo'}), document.body)
  ```

## Contribution

Are you interested in contributing to **.dom**? You are more than welcome! Just be sure to follow the guidelines:

1. *Always explain your code with a comment* : Since you will most probably going to do some extreme javascript corner cases in order to be able to squeeze your logic.
2. *All comments should start on column 70 and wrap after column 120* : In order to perserve code-style consistency.
3. *The GZipped result should __never__ be bigger than 512 bytes* : Since that's the whole purpose of the library. If you are adding a completely new feature, consider sacraficing another one, or try to reduce scope, in order to keep the balance.

