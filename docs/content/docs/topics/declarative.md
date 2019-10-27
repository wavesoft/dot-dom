---
title: "Declarative DOM"
type: docs
weight: 2
# bookFlatSection: false
# bookShowToC: true
---

# Declarative DOM Composition

The `.dom` library comes with a built-in accelerators that makes it possible to rapidly design human-readable DOM layouts without the need of JSX, or any other Javascript preprocessor.

---

This is achieved through Proxy methods built on top of the `.H` (create element) function, creating a native Javascript syntactic sugar:

{{< dotdom-example >}}
div(
  div.underline(
    "Welcome!"
  ),
  p(
    "In this example we demonstrate ",
    "the ", b(".dom"), " accelerators."
  ),
  p(
    "Create ", span.red("powerful"),
    " layouts with ", b("native JS!")
  )
)
{{< /dotdom-example >}}

## `.tag` Accelerators

When accessing a property out of the `H` function, a new function is composed, with the `tag` argument, bound to a tag named as the property.

Typically you should use the ES6 destructuring operator in the beginning of your script to create helpers for the HTML entities you are using later. For example:

```js
const { div, b, i } = H;
```

This allows us to compose an HTML document in a natural manner like so:

{{< dotdom-example >}}
div(
  div("Name: ", b("John")),
  div("Surname: ", i("Doe"))
)
{{< /dotdom-example >}}

## `.class` Accelerators

When further accessing properties in the tag accelerator, a new function is composed that appends the property name in the list of the element's CSS class names.

There is no limit on how many classes you can append, you can keep accessing deeper properties, and each time you will be appending a class name:

{{< dotdom-example >}}
div(
  p.red.underline("Hello world!"),
  // You can also create classes by string
  // as you would normally do with any
  // javascript object 
  p['green']("Welcome to the world ",
    span['blue'].underline("of .dom!")
  )
)
{{< /dotdom-example >}}

---

{{< topicnav "components" "quick-start" >}}

