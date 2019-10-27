---
title: "Raw Components"
type: docs
weight: 8
# bookFlatSection: false
# bookShowToC: true
---

# Raw Components

If you are controlling the created HTML DOM instance yourself, you can mark the node as _raw_ to disable deeper reconciliation.

By default, on every update, `.dom` will reconcile the children of each VNode instance. This will destroy any previous modifications to the DOM. To disable this functionality, set `hooks.r` to a truthy value (eg. `1` or `true`):   

---

```js
const RawComponent = (props, state, setState, hooks) => {
  // Mark the component as raw
  hooks.r = 1;
}
```

## HTML Component

One use of the raw components is to render plain HTML strings. For example:

{{< dotdom-example >}}
function RenderHTML({html}, state, setState, hooks) {
  hooks.r = true;
  return H("div", {
    innerHTML: html
  })
}

R(
  H(RenderHTML, {
    html: "<p>Hello <b>World</b></p>" 
  }),
  document.body
)
{{</ dotdom-example >}}

---

{{< topicnav "reconciliation" "component-lifecycle" >}}

