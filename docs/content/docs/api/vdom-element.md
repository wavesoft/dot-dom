---
title: "VDom Element"
type: docs
weight: 3
# bookFlatSection: false
# bookShowToC: true
---

# VDom Element

A Virtual DOM (`VDom`) element is created with the [`H()`]({{< relref "globals#H-create-element" >}}) method and represents the shadow of a real DOM Element.

---

## VDom Types

A VDom instance can be one of the following types:

* `Object` - Represents an HTML element, identified by a tag, attributes and children.
* `String` - Represents a `#text` node, that only carries it's contents

{{< hint "info" >}}
Note that the `H()` function only creates `Object` VDom instances. String instances can be passed down directly to the engine for rendering.

For example, as children:

```js
const textNode = "Hello World";
R(H("div", textNode), document.body);
```

Or as immediate nodes:

```js
const textNode = "Hello World";
R(textNode, document.body);
```

{{< /hint >}}

## Object Properties

### `.$` - Type

The `.$` property carries the element type. This is either a `string` that denotes the tag name, or a `function` of a functional component.

For example:

```js
const vdom = H("div", "Hello World");
console.log(vdom.$);
// prints: 'div'
```

### `.a` - Properties

The `.a` object contains the properties passed down to a component. For example:

```js
const vdom = H("div", {color: "red"}, "Hello World");
console.log(vdom.a);
// prints: 
// {
//   color: "red",
//   c: [ "Hello World" ]
// }
```

{{< hint "info" >}}
Note that the `.c` property is always implicitly created and it contains the list of the node children of this node.
{{< /hint >}}
