# .dom

> A tiny (450 byte) virtual DOM template engine for embedded projects

**.dom** borrows some principles from React.js, such as the *Virtual DOM* and
the *Functional Components*, while trying to achieve minimal size footprint.

Of course, it's not a fully-fledged React alternative, rather a stripped-down
version for use on tight space requirements.

## Installation

Just include `dotdom.min.js` to your project.

```html
<script src="dotdom.min.js" />
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

### `R( VNode, DOMElement )`

```js
R( div('Hello'), document.body )
```

Renders the given VNode tree to the given DOM element.

### `H( tagName | function, [properties], [children ...])`

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

### `div( [properties], [children ...] )

```js
div( 'hello' )
```

A shorthand function for creating most of the commonly-used HTML tags. This
behaves exactly like `H`, but with the tag name already populated.
