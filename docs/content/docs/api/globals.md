---
title: "Globals"
type: docs
weight: 1
# bookFlatSection: false
# bookShowToC: true
---

# Globals

When sourced, `.dom` library exposes a few entry point functions for defining and rendering elements.

---

## `.H` - Create Element

```js
H( 'tag' )
H( 'tag', {prop: "value"})
H( 'tag', H( 'child' ))
H( 'tag', {prop: "value"}, H( 'child' ))
H( Component, {prop: "value"} )
```

Create and return a new [VDom element]({{< relref "vdom-element" >}}) of the given type. The type argument can be either a tag name string (such as 'div' or 'span') or a Component function.

If you are using JSX, your code will be converted to use the `H()` function. You will not typically invoke `H()` directly. Refer to the [JSX Integration]({{< ref "create-webapp" >}}) for more details.

{{< hint "danger" >}}
**Important!**
You should never use the following property names, since it will lead to unexpected behaviour or run-time errors:

* `$` - Used to differentiate VNode instances from regular objects
* `c` - Reserved internally for keeping the children of a VDom element
{{</ hint >}}

### Tag Shorthands

The exposed `.H` variable is not a simple function, but rather a multi-functional object.

Accessing _any_ property under the `.H` object, will return the same `.H` function, but with the first argument bound to a tag name same as the property being accessed.

```js
H.div("Hello")
// equals
H('div', "Hello")
```

This feature is the foundation of the [Declarative DOM Composition]({{< ref "docs/topics/declarative.md" >}}). Refer to the guide for more details.

## `.R` - Render

```js
R( VNode, HTMLDomElement  )
R( [VNode, ...], HTMLDomElement  )
R( "String", HTMLDomElement )
```

Renders the given VDom tree as children of the given HTML DOM element. The first argument can either be a single [VDom element]({{< relref "vdom-element" >}}) or an array of VDom elements.

Note that [string is a valid VNode element]({{< relref "vdom-element#vdom-types" >}}) representing a `#text` node.


