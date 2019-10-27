---
title: "Components"
type: docs
weight: 5
# bookFlatSection: false
# bookShowToC: true
---

# Components

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called "props") and return Virtual DOM elements describing what should appear on the screen.

---

## Component Functions

All components in `.dom` are Javascript functions:

```js
const { div } = H;

function Welcome(props) {
  return div(`Hello ${props.name}`);
}
```

This function is a valid `.dom` component because it accepts a "props" object argument and returns a Virtual DOM element.

## Rendering Components

We have previously seen that you can render HTML elements using the `H` function:

```js
const elm = H("div", "Hello world");
```

You can use the same function to render components. 

```js
const elm = H(Welcome, {"name": "World"});
```

{{< hint "warning" >}}
Note that you cannot use the deconstructuring accelerator with Components. You must always call `H(Component)` to render it.
{{< /hint >}}

The library will call-out to your component, passing down the props given and will collect the resulting VDom tree.

You can see this in action:

{{< dotdom-example >}}
const { div } = H;

// Define the component
function Welcome(props) {
  return div(`Hello ${props.name}`);
}

// Render it 
R(
  H(Welcome, {"name": "World"}), 
  document.body
);
{{</ dotdom-example >}}

## Composing Components

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in a `.dom` app, all those are commonly expressed as components.

{{< dotdom-example >}}
const { div } = H;

// Define the component
function Welcome(props) {
  return div(`Hello ${props.name}`);
}

// Define the app
function App(props) {
  return div(
    H(Welcome, {name: "Alice"}),
    H(Welcome, {name: "Bob"}),
    H(Welcome, {name: "Charline"})
  );
}

// Render the app
R(
  H(App),
  document.body
);
{{</ dotdom-example >}}



---

{{< topicnav "stateful-components" "declarative" >}}

