---
title: "Gotchas"
type: docs
weight: 12
# bookFlatSection: false
# bookShowToC: true
---

# Gotchas

Since `.dom` is optimized for _size_ and not for performance nor developer friendliness, you should be aware that there are few rough edges.

This document presents some of the well-known issues of the library that are intentionally remain unsolved because:

1. They are not obstructing the typical application development.
2. If solved, the library footprint will exceed the 512 bytes.

---

## Component roots cannot change

The component state is preserved on it's root DOM element. On it's own turn, this element is indexed by the component's [key]({{< relref "component-functions#k-key" >}}). 

This means, that once mounted, the component won't be able to change the type of the root element, since it will be persisted in the cache.

For example:

{{< dotdom-example >}}
const { div, a } = H;

function Component(props, state, setState, meta) {
  const root = state.toggle ? "em" : "strong";

  return H(root, 
    a({
      href: "javascript:;",
      onclick() {
        setState({
          toggle: !state.toggle
        })
      }
    }, 
    state.toggle
      ? "Switch to <strong>"
      : "Switch to <em>"
    )
  )
}

R(
  div(
    "The component root will always be <strong> (use inspect to verify):",
    div(
      H(Component)
    )
  ),
  document.body
);
{{</ dotdom-example >}}

## First `setState`, then propagate

When in the same handler you call `setState` and **also** call a handler function that you received as property, make sure to call `setState` **first** and **then** call-out to the handler.

```js
    // First call setState
    setState({ value: newValue });
    // And **then** call-out to handlers
    if (props.onChange) props.onChange();
```

That's due to a limitation in the internals of the `.dom` engine, that could lead into invalid state updates if the parent element updates **before** the child element!

---

{{< topicnav "" "reconciliation" >}}
