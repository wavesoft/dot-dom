---
title: "Reconciliation"
type: docs
weight: 10
# bookFlatSection: false
# bookShowToC: true
---

# Reconciliation

Because of it's declarative nature, `.dom` knows which elements to update on a reconciliation events, so there is no requirement by the developer to explicitly control this process.

In this document we are describing the details of the reconciliation process of the library, since there are some specific cases where the developer should pay attention. Especially when designing performance-critical interfaces.

---

## Reconciliation in `.dom`

{{< hint "warning" >}}
First and foremost is important to clarify that `.dom` is optimized for _size_ and not for _performance_. This means that instead of following particular algorithmic "best practices" we are using quirks and intentional code repetitions that helps compression algorithms produce a smaller result.
{{</ hint >}}

When "diffing" the VDom (in-memory Virtual DOM) with the DOM (the actual page DOM) trees, `.dom` compares the children of a DOM element with an array of VDom elements.

For each element, the operation that takes place depends on the type of the two elements encountered.

### Elements Of Different Types

When the diffing algorithm encounters two elements of different types, it tears down the old tree and creates a new tree from scratch. 

This includes switching from one tag to another (eg. `<span>` to `<div>`), switching form one component to another (eg. `<Head>` to `<Banner>`) or switching from a tag to a component or vice versa (eg. `<div>` to `<Content>`).

Note that the state of a component is bound to it's root element. This means that if it's parent element is removed and re-created, the component state will also be lost. For example:

```js
div(
  H(Counter)
)

span(
  H(Counter)
)
```

### Elements Of Same Types

When the diffing algorithm encounters two elements of the same type, it updates the DOM element properties with the VDom element properties that have changed.

If the DOM element is a root of a component, it's update (`.u`) callback will be triggered.

## Recursing On Children

By default, when recursing on the children of a DOM node, `.dom` just iterates over both lists of children at the same time and generates a mutation whenever there’s a difference.

For example, when adding an element at the end of the children, converting between these two trees works well:

```js
ul(
  li("First"),
  li("Second")
)

ul(
  li("First"),
  li("Second"),
  li("Third")
)
```

The diffing algorithm will match the two `<li>first</li>` trees, match the two `<li>second</li>` trees, and then insert the `<li>third</li>` tree.

If you implement it naively, inserting an element at the beginning has worse performance. For example, converting between these two trees works poorly:

```js
ul(
  li("Foo"),
  li("Bar")
)

ul(
  li("Baz"),
  li("Foo"),
  li("Bar"),
)
```

This will mutate every child instead of realizing it can keep the `<li>Foo</li>` and `<li>Bar</li>` subtrees intact. This inefficiency can be a problem.

### Keys

In order to solve this issue, `.dom` supports a key attribute. When children have keys, `.dom` uses the key to match children in the original tree with children in the subsequent tree. For example, adding a `k` property to our inefficient example above can make the tree conversion efficient:

```js
ul(
  li({k: "2015"}, "Foo"),
  li({k: "2016"}, "Bar")
)

ul(
  li({k: "2014"}, "Baz"),
  li({k: "2015"}, "Foo"),
  li({k: "2016"}, "Bar"),
)
```

Now `.dom` knows that the element with key `'2014'` is the new one, and the elements with the keys `'2015'` and `'2016'` have just moved.

In practice, finding a key is usually not hard. The element you are going to display may already have a unique ID, so the key can just come from your data:

```js
li({k: item.id}, item.name)
```

When that’s not the case, you can add a new ID property to your model or hash some parts of the content to generate a key. The key only has to be unique among its siblings, not globally unique.

As a last resort, you can pass an item’s index in the array as a key. This can work well if the items are never reordered, but reorders will be slow.


---

{{< topicnav "gotchas" "raw" >}}

