---
title: "Stateful Components"
type: docs
weight: 6
# bookFlatSection: false
# bookShowToC: true
---

# Stateful Components

Components can only carry properties given, but can also maintain their own state.

For example, consider the case of a spinner widget, where the user has two buttons : one to increment the value and one to decrement, like so:

{{< dotdom-example >}}
const { div, button } = H;

function Spinner(props) {
  return div.rowflex(
    button("-"),
    div(`${props.value}`),
    button("+")
  );
}

R(H(Spinner, {value: 0}), document.body);
{{</ dotdom-example >}}

But what should happen when the user clicks the "+" or the "-" button? To answer this question we will introduce you to the _Component State_

---

## Component State

Every component is created with an empty _state_ object, initialized to `{ }`. This object persists throughout the life-cycle of the component and is disposed when unmounted.

The component can update it's state by calling the `setState` method, giving the new values for the state properties. This will cause the element to re-render in order to apply the new values.

The `state` and `setState` variables are passed as arguments to the component function, right after the `props` object:

```js
function Welcome(props, state, setState) {
    // ...    
}
```

This means that we can now re-write our spinner widget using the state object like so:

{{< dotdom-example >}}
const { div, button } = H;

function Spinner(
  props, 
  {value=props.value}, 
  setState
) {
  return div.rowflex(
    // Decrement button
    button({
      onclick() {
        setState({ value: value - 1 })
      }
    }, "-"),
    // Value label
    div(`${value}`),
    // Increment button
    button({
      onclick() {
        setState({ value: value + 1 })
      }
    }, "+")
  );
}

R(H(Spinner, {value: 0}), document.body);
{{</ dotdom-example >}}

---

## State Propagation

When designing stateful components, it's important to find out where the state of your application will be. It is a good practice to keep the state to the **top-most component** and pass down portions of it, to stateless components.

As an exception of this rule, it is also acceptable to use stateful components that maintain a temporary state of a user-interfacing component. 

### Example

Consider the more complicated example of a _ToDo List_ App. In this example, we are using three kinds of components:

* The `TodoList` component that renders the items and the input field
* The `TodoItem` component that renders a single item and allows the user to mark it as completed.
* The `InputField` where the user enters the new item text

In such cases it's important to find out where the state is going to be maintained. It is typically a good practice to keep the state to the root component and pass down portions of it to stateless components.

Let's start designing our leaf components. First the **TodoItem** component:

```js
function TodoItem({ text, completed, oncomplete }) {
  return div.rowflex(
    button(
      { onclick: oncomplete}, 
      "Ok"
    ),
    div[completed ? "strike" : ""](text)
  );
}
```

This stateless component accepts the following properties:

* `text` : The text of the eleemtn
* `completed` : A boolean flag that indicates if the item is completed
* `oncomplete` : A callback function to call when the user completes the item

Then let's design the **InputField** component:

```js
function InputField({ oncreate }, {text=""}, setState) {
  return div.rowflex(
    input({
      type: 'text',
      value: text,
      onchange(e) {
        setState({ text: e.target.value })
      }
    }),
    button({
      onclick() {
        setState({ text: "" });
        oncreate(text);
      }
    }, "Create")
  )
}
```

{{< hint "danger" >}}
**Important!**
When in the same handler you call `setState` and **also** call a handler function that you received as property, make sure to call `setState` **first** and **then** call-out to the handler.
{{</ hint >}}

This is a stateful component, that uses it's local state *only* for keeping track of the user input. It still forwards the important events to the parent.

It accepts the following properties:

* `oncreate` : A callback function that will be called when the user clicks the "Create" button, passing down the value the user has entered.

And finally, let's design the **TodoList** component:

```js
function TodoList(props, {items=[]}, setState) {
  const addItem = text => {
    setState({
      items: [].concat({
        text,
        completed: false
      }, (state.items || []))
    })
  };
  const checkItem = index => {
    items[index].completed = 
      !items[index].completed;
    setState({ items });
  };

  return div(
    items.map((item, index) => H(TodoItem, {
      text: item.text,
      completed: item.completed,
      oncomplete: checkItem.bind(index)
    })),
    H(InputField, {
      oncreate: addItem
    })
  );
}
```

And here is what the full example looks like:

{{< dotdom-example >}}
const { div, button, input } = H;

function TodoItem({ text, completed, oncomplete }) {
  return div.rowflex(
    button(
      { onclick: oncomplete}, 
      "Ok"
    ),
    div[completed ? "strike" : ""](text)
  );
}

function InputField({ oncreate }, {text=""}, setState) {
  return div.rowflex(
    input({
      type: 'text',
      value: text,
      onchange(e) {
        setState({ text: e.target.value })
      }
    }),
    button({
      onclick() {
        setState({ text: "" });
        oncreate(text);
      }
    }, "Create")
  )
}

function TodoList(props, state, setState) {
  const addItem = text => {
    setState({
      items: [].concat({
        text,
        completed: false
      }, (state.items || []))
    })
  };
  const checkItem = index => {
    state.items[index].completed = 
      !state.items[index].completed;
    setState({ });
  };

  return div(
    H(InputField, { oncreate: addItem }),
    (state.items || []).map((item, index) => H(TodoItem, {
      k: item.text,
      text: item.text,
      completed: item.completed,
      oncomplete: checkItem.bind(this, index)
    })),
  );
}

R(H(TodoList), document.body);
{{</ dotdom-example >}}


---

{{< topicnav "component-lifecycle" "components" >}}

