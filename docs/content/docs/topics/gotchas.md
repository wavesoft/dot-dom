---
title: "Gotchas"
type: docs
weight: 12
# bookFlatSection: false
# bookShowToC: true
---

# Gotchas

Since `.dom` is optimized for _size_ and not for performance nor developer friendliness, you should be aware that there are few rough edges.

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

---

{{< topicnav "" "reconciliation" >}}
