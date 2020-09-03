# .dom [![npm](https://badgen.net/npm/v/dot-dom)](https://www.npmjs.com/package/dot-dom) [![size](https://badgen.net/badgesize/normal/https://cdn.jsdelivr.net/npm/dot-dom@0.3.1/dist/dotdom.min.js.gz)](https://cdn.jsdelivr.net/npm/dot-dom@0.3.1/dist/dotdom.min.js.gz) [![install size](https://badgen.net/packagephobia/install/dot-dom)](https://packagephobia.now.sh/result?p=dot-dom) [![Build Status](https://badgen.net/travis/wavesoft/dot-dom)](https://travis-ci.org/wavesoft/dot-dom) [![Try it in codepen.io](https://img.shields.io/badge/Try%20it-codepen.io-blue.svg)](https://codepen.io/wavesoft/pen/wvwgOpz?editors=0010) [![Gitter](https://badges.gitter.im/wavesoft/dot-dom.svg)](https://gitter.im/wavesoft/dot-dom?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

> A tiny (512 byte) virtual DOM template engine for embedded projects

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /> IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" /> Opera | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" /> iOS Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" /> Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge 14+ | 45+ | 49+ | 10+ | 37+ | 10.2+ | 55+

**.dom** borrows some concepts from React.js (such as the re-usable Components and the Virtual DOM) and tries to replicate them with the smallest possible footprint, exploiting the ES6 javascript features.

Why? Because with such library you can create powerful GUIs in tight space environments, such as IoT devices, where saving even an extra byte actually matters!

### Features

* _Tiny by design_ : The library should never exceed the 512 bytes in size. The goal is not to have yet another template engine, but to have as many features as possible in 512 bytes. If a new feature is needed, an other must be sacraficed or the scope must be reduced.

* _Built for the future_ : The library is heavily exploiting the ES6 specifications, meaning that it's **not** supported by older browsers. Currently it's supported by the 90% of the browsers in the market, but expect this to be close to 100% within the next year.

* _Declarative_ : Describe your HTML DOM in a structured, natural manner, helping you create powerful yet readable user interfaces.

* _Component-Oriented_ : Just like React.js, **.dom** promotes the use of functional components.

* _"Write less" accelerators_ : The library API is designed specifically to have short function names and accelerators, allowing you to describe your views with less code.

### Projects Using `.dom`

* [Open Graph Image as a Service](https://github.com/styfle/og-image) - [demo](https://og-image.now.sh/)

Are you using `.dom` in your project? Fork this repository and add yours on the list!


## Installation

For minimum footprint, include `dotdom.min.js.gz` (512b) to your project.

```html
<script src="dotdom.min.js.gz" />
```

Alternatively you can just include the minified version of the library directly before your script. Just copy-paste the [minified code](https://raw.githubusercontent.com/wavesoft/dot-dom/master/dotdom.min.js).

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

#### 2. Stateless Component

Creating a component on which you can pass properties.

<table width="100%">
  <tr>
    <th>React</th>
    <th>.dom</th>
  </tr>
  <tr>
    <td valign="top">
<pre lang="javascript">
function Hello(props) {
    return React.createElement(
      'div', null, `Hello ${props.toWhat}`
    );
  }
<br />
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
<br />
R(
  H(Hello, {toWhat: 'World'}),
  document.body
)
</pre>
    </td>
  </tr>
</table>

#### 3. Stateful Component

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
<br />
  render() {
    const {clicks} = this.state;
<br />
    return React.createElement(
      'button', {
        onClick() {
          this.setState({clicks: clicks+1})
        }
      }, `Clicked ${clicks} times`
    );
  }
}
<br />
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
<br />
  return H('button',
    {
      onclick() {
        setState({clicks: clicks+1})
      }
    },
    `Clicked ${clicks} times`
  );
}
<br />
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

#### 4. Life-Cycle Component Events

The component can also subscribe to life-cycle events:

<table width="100%">
  <tr>
    <th>React</th>
    <th>.dom</th>
  </tr>
  <tr>
    <td valign="top">
<pre lang="javascript">
class WithLifeCycle extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      mounted: "no"
    };
  }
<br />
  componentDidMount() {
    this.setState({ mounted: "yes" })
  }
<br />
  render() {
    const {mounted} = this.state;
<br />
    return React.createElement(
      'div', null, `mounted = ${mounted}`
    );
  }
}
<br />
ReactDOM.render(
  React.createElement('div', null,
    React.createElement(WithLifeCycle, null, null),
  ),
  document.body
);
</pre>
    </td>
    <td valign="top">
<pre lang="javascript">
function WithLifeCycle(props, state, setState, hooks) {
  const {mounted = "no"} = state;
  hooks.m.push(() => {
    setState({ mounted: "yes" })
  });
<br />
  return H('div',
    `mounted = ${mounted}`
  );
}
<br />
R(
  H('div', H(WithLifeCycle)),
  document.body
)
</pre>
    </td>
  </tr>
</table>

#### 5. Keyed Updates

Keyed updates is a useful [reconciliation](https://reactjs.org/docs/reconciliation.html) feature from React that enables the rendering engine to take smart decisions on which elements to update.

A particularly useful case is when you are rendering a dynamic list of elements. Since the rendering engine does not understand _which_ element has changed, it ends-up with wrong updates.

To solve this issue, the VDOM engines use a `key` property that uniquely identifies an element in the tree. However **.dom** solves it, by keeping a copy of the element state in the VDom element instance itself.

This means that you don't need any `key` property, just make sure you return the same VDom instance as before.

If you are creating dynamic elements (eg. an array of vdom elements), **.dom** might have trouble detecting the correct update order. 

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
<br />
  render() {
    const {clicks} = this.state;
    const {key} = this.props;
<br />
    return React.createElement(
      'button', {
        onClick() {
          this.setState({clicks: clicks+1})
        }
      }, `clicks=${clicks}, key=${key}`
    );
  }
}
<br />
const list = ["first", "second", "third"];
const components = list.map(key => 
  React.createElement(Clickable, {key}, null);
<br />
ReactDOM.render(
  React.createElement('div', null,
    components
  ),
  document.body
);
</pre>
    </td>
    <td valign="top">
<pre lang="javascript">
function Clickable(props, state, setState) {
  const {clicks=0} = state;
  const {key} = props;
<br />
  return H('button',
    {
      onclick() {
        setState({clicks: clicks+1})
      }
    },
    `clicks=${clicks}, key=${key}`
  );
}
<br />
const list = ["first", "second", "third"];
const components = list.map(key => 
  H(Clickable, {key});
<br />
R(
  H('div', components),
  document.body
)
</pre>
    </td>
  </tr>
</table>

Note that the solution above will correctly update the stateful components, even if their order has changed. However, if you want the complete, React-Like functionality that updates individual keys, you can use the `Keyed` plug-in.

```js
function Container(props, state) {
  const {components} = props;
  // The function `K` accepts the component state and an array of components that
  // contain the `key` property, and returns the same array of components, with their
  // state correctly manipulated.
  return H("div", K(state, components));
}
```

#### 6. Raw (Unreconciled) Nodes

You can create raw (unreconciled) VDom nodes (eg. that carry an arbitrary HTML content) by setting the `.r` property of the hooks object to any truthy value.

This will disable further reconciliation to the child nodes, and therefore keep your contents intact.

```js
function Description(props, state, setState, hooks) {
  const { html } = props;
  hooks.r = 1; // Enable raw mode
  return H('div', {
    innerHTML: html
  })
}
```

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

#### Functional Components

Instead of a tag name you can provide a function that returns a Virtual DOM
according to some higher-level logic. Such function have the following signature:

```js
const Component = (props, state, setState, hooks) {

  // Return your Virtual DOM
  return div( ... )
}
```

The `props` property contains the properties object as given when the component
was created.

The `state` is initialized to an empty object `{}` and it's updated by calling
the `setState({ newState })` method. The latter will also trigger an update to
the component and it's children.

You can also assign properties to the `state` object directly if you don't want
to cause an update.

The `hooks` object can be used when you want to register handlers to the component life-cycle methods.

#### Component Life-Cycle

Similar to React, the **.dom** components have a life-cycle:

  * They are **mounted** when their root DOM element is placed on the document.
  * They are **unmounted** when their root DOM element is removed from the document.
  * The yare **updated** when the state, the properties, or the rendered DOM has changed.

To access the life-cycle methods you need to use the fourth argument on your component function. More specifically you have to push your handling function in either of the following fields:

```js
const Component = (props, state, setState, hooks) {
  hooks.m.push((domElement) => {
    // '.m' is called when the component is mounted
  });
  hooks.u.push(() => {
    // `.u` is called when the component is unmounted
  });
  hooks.d.push((domElement, previousDomElement) => {
    // `.d` is called when the component is updated
  });
  ...
}
```

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

Since the project's focus is the small size, it is lacking sanity checks. This makes it susceptible to errors. Be **very careful** with the following caveats:

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

## Plugin Reference

### Keyed Update List `K(state, components)`

> In `plugin-keyed.min.js`

Ensures the state of the components in the list is synchronized, according to their `key` property. This enables you to do react-like keyed updates like so:

```js
function ValueRenderer(...) { 
  ...
}

function MyComponent(props, state) {
  const { values } = props;
  const components = values.map(value => {
    H(ValueRenderer, {
      key: value,
      value: value
    });
  })

  // Synchronize state of components, based on their key
  return H('div', K(state, components))
}
```

## Contribution

Are you interested in contributing to **.dom**? You are more than welcome! Just be sure to follow the guidelines:

1. Install a local development environment (you will need node.js **6.x** or later)

  ```
  npm install
  ```

2. **Always** run the following when you think you are ready for a pull request:

  ```
  npm test && npm run build && ls -l dotdom.min.js.gz
  ```

3. If tests pass and the size of `dotdom.min.js.gz` is smaller than or equal to 512 bytes, create a pull request. Otherwise reduce your scope or think of another implementation in order to bring it back down to 512 bytes.

4. Make sure to properly comments your code, since you will most probably have to do some extreme javascript hacking. The gudeliens are the following:

  ```js
  /**
   * Functions are commented as JSDoc blocks
   *
   * @param {VNode|Array<VNode>} vnodes - The node on an array of nodes to render
   * ...
   */
  global.R = render = (
    vnodes,                                                           // Flat-code comments start on column 70 and
    dom,                                                              // wrap after column 120.

    /* Logical separations can be commented like this */

    ...
  ```
# License

Licensed under the [Apache License, Version 2.0](https://raw.githubusercontent.com/wavesoft/dot-dom/master/LICENSE)
