---
title: "Component Lifecycle"
type: docs
weight: 8
# bookFlatSection: false
# bookShowToC: true
---

# Component Lifecycle

Every `.dom` component undergoes through a three phases during it's life-cycle : **Mounted**, **Updated** and **Unmounted**

As a developer, you can react to these life-cycle events in order to implement your logic. 

---

## Component Hooks

You can register callback handlers to either of the three life-cycle events through the `hooks` object, that is given as a 4th argument to the Component function:

```js
function Component(props, state, setState, hooks) {
    // ...    
}
```

You can read more on the [Component Functions]({{< relref "component-functions" >}}) API reference.

## Mounting

When a component is created (using the `H`) function, the newly created instance does not yet have a DOM reflection.

When rendered, and the VDom element obtains a DOM reflection, the VNode is considered to be **Mounted**.

At this point, the `.m` (didMount) callback is fired. To subscribe for such events, push your handler in the `.m` array in the hooks object:

```js
function Component(props, state, setState, hooks) {
    hooks.m.push(function(domElement) {
        // Do something with the DOM element
    });
}
```

{{< hint info >}}
In this handler you can initialize other libraries that are bound to this element. For instance ACE editor, or other WYSIWYG visual editors.
{{< /hint >}}

## Unmounting

When a component is about to be removed from DOM, the node is considered to be **Unmounted**. At this point, the `.u` (willUnmount) callback is fired. To subscribe for such events, push your handler in the `.u` array in the hooks object:

```js
function Component(props, state, setState, hooks) {
    hooks.u.push(function(domElement) {
        // Do something with the DOM element
    });
}
```

## Updating

When a component has finished updating it's properties, it fires the `d` (didUpdate) callbacks. To subscribe for such events, push your handler in the `.d` array in the hooks object:

```js
function Component(props, state, setState, hooks) {
    hooks.d.push(function(domElement) {
        // Do something with the DOM element
    });
}
```

---

{{< topicnav "raw" "stateful-components" >}}

