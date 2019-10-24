---
title: "Component Functions"
type: docs
weight: 2
# bookFlatSection: false
# bookShowToC: true
---

# Component Functions

This page explains in detail the component functions.

Every component function is called during the rendering phase of the DOM and it **must** return a valid VDom element to render. Any code logic that should be called during a particular lifecycle event of the node should be registered via the `hooks` object.

---

```js
function Component(props, state, setState, hooks) {
    return ...
}
```

- `props` : The properties object, as given by the user in the `H` function
- `state` : An object that contains the state values of the object
- `setState` : A function that can be used to update the state and re-render the element
- `hooks` : An object where you can register the lifecycle method hooks

{{< hint "info" >}}
Note that the `state` object instance remains untouched throughout the life-cycle of the component. This means that you can use it for keeping local properties without triggering a re-render.
{{< /hint >}}

---

## setState()

```js
setState( Object )
```

The `setState` function updates the local component state and re-renders it.

{{< hint "danger" >}}
**Important!**
When in the same handler you call `setState` and **also** call a handler function that you received as property, make sure to call `setState` **first** and **then** call-out to the handler.

```js
    // First call setState
    setState({ value: newValue });
    // And **then** call-out to handlers
    if (props.onChange) props.onChange();
```

That's due to a limitation in the internals of the `.dom` engine, that could lead into invalid state updates if the parent element updates **before** the child element!
{{< /hint >}}

The properties given in the object will be **shallow-merged** with the properties in the state. 

For example, when given a state:

```js
{
    foo: "foo",
    bar: "bar",
    deep: { a: 1 }
};
```

Calling:

```js
setState({
    foo: "bar",
    deep: { b: 2 }
});
```

Will produce the following (note the value of `deep` property):

```js
{
    foo: "bar",
    bar: "bar",
    deep: { b: 2 }
};
```

---

## hooks{ }

```js
{
    m : [],     // Array of didMount() callbacks
    u : [],     // Array of willUnmount() callbacks
    d : [],     // Array of didUpdate() callbacks
    r : false   // Raw Component Indicator
}
```

The hooks object can be used for registering lifecycle callbacks for your component.

### `.m` - didMount()

```js
hooks.m.push(
    function( domInstance ) {
        ...
    }
)
```

The **m**ount callbacks are called when the component has finished mounting itself in the DOM. 

The first argument given is the instance of the root DOM element.

### `.u` - didUnmount()

```js
hooks.u.push(
    function( domInstance ) {
        ...
    }
)
```

The **u**nmount callbacks are called when the component has finished removing itself from the DOM. 

The first argument given is the instance of the root DOM element.

### `.d` - didUpdate()

```js
hooks.u.push(
    function( domInstance ) {
        ...
    }
)
```

The up**d**ate callbacks are called when the component has finished updating it's properties. 

The first argument given is the instance of the root DOM element.

### `.r` - Raw Flag

```js
hooks.r = <truthy> | <falsy>
```

The **r**aw flag indicates that this component is "raw" (eg. manipulates it's own DOM children) and should be opted-out from `.dom` reconciliation logic.

You can set any truthy value to enable this flag (`true`, `1`, `""`, `{}`, `[]`, etc.)
