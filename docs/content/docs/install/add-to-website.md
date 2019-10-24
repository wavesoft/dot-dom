---
title: "Adding .dom in your website"
type: docs
weight: 2
# bookFlatSection: false
# bookShowToC: true
---

# Adding .dom in your website

Use it according to your needs.

The `.dom` library is quite agile and can be used either in existing websites, where you just want to add some interactivity, or in a modern single-page app.

---

## Boilerplate

If you want to start from scratch, you can use the following HTML boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My .dom App</title>
    <!-- The .dom library sources -->
    <script src="{{< param dotdomCDNLink >}}" integrity="{{< param dotdomCDNIntegrity >}}" crossorigin="anonymous"></script>
  </head>
  <body>
    <!-- The root container where the app will be rendered -->
    <div id="main"></div>
    <!-- Your App -->
    <script>
      // Define some DOM accelerators
      const { p } = H;
      // Define your app entry point component
      const App = () => {
        return p("Hello World!");
      };
      // Render the main app
      R(H(App), document.getElementById("main"));
    </script>
  </body>
</html>
```

---

## Adding to an existing website

If you already have a website and you just want to make _some_ parts of it interactive, you can add `.dom` in three simple steps:

### Step 1 - Add a main view container

First you should create an empty element in the place you want `.dom` to render it's contents:

```html
    <!-- Here is where .dom will render it's contents  -->
    <div id="main"></div>
```

### Step 2 - Add script tags

Then you should load the `.dom` library in your website. You can either [download](https://github.com/wavesoft/dot-dom/releases) it and put it along with the rest of your website assets, or you can use a CDN link:

```js
<script 
  src="{{< param dotdomCDNLink >}}" 
  integrity="{{< param dotdomCDNIntegrity >}}" 
  crossorigin="anonymous">
</script>
```

### Step 3 - Define your components and render

You are now ready to define your components and render your app. You can do this by adding a `<script>` tag in your body:

```js
<script>
  // Define some DOM accelerators
  const { p } = H;
  // Define your app entry point component
  const App = () => {
    return p("Hello World!");
  };
  // Render the main app
  R(H(App), document.getElementById("main"));
</script>
```

---

{{< topicnav "create-web-app" "getting-started" >}}
