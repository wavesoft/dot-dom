---
title: "Creating a WebApp"
type: docs
weight: 3
# bookFlatSection: false
# bookShowToC: true
---

# Creating a WebApp

Since `.dom` natively supports JSX integration you can use a similar tooling like React to create a single-page application.

In this page we are describing step-by-step the process you should follow in order to create a single-page application using webpack and babel.

---

## Starting a node project

First we should start by creating a blank new node.js project:

```sh
mkdir my-dotdom-app; cd my-dotdom-app
yarn init -y
```

---

## Setting-up Dependencies
 
We are going to use [webpack](https://webpack.js.org/) as our main build tool. It is responsible for packaging all of our project assets into bundles, pre-processing them with some filters if needed. Let's add it:

```sh
yarn add -D webpack webpack-cli webpack-dev-server
```

In our case, we are going to use the [React JSX](https://reactjs.org/docs/introducing-jsx.html) extensions to Javascript. This is implemented as an [Babel](https://babeljs.io/) plugin. So let's add it:

```sh
yarn add -D babel-loader @babel/core @babel/preset-env @babel/plugin-transform-react-jsx
```

And finally, we should add the `dot-dom` library:

```sh
yarn add dot-dom
```

---

## Adding boilerplate code

Let's continue creating the structure of our project, and more specifically the entry point for our javascript and HTML part in the following locations:

```
- src/
-- index.js
- dist/
-- index.html 
```

The `src/index.js` is the entry point to our web app. Create it with following contents:

```jsx
import DotDom from 'dot-dom';

DotDom.R(
  <h1>.dom and JSX</h1>,
  document.getElementById('app')
);
```

The `dist/index.html` is the static HTML page that loads our application bundle. Create it with following contents:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello .dom</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

---

## Configuring Webpack

For our next step, we should configure webpack. More specifically we must instruct it to pass all the `.js` or `.jsx` sources through the `babel-loader` plugin, that is going to translate the JSX expressions in our source code.

Create a file called `webpack.config.js` with the following contents:

```js
module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  }
};
```

The `babel` plugin is further configured with a separate file. You must then create a file called `.babelrc` in the root directory of your project with the following contents:

```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "DotDom.H"
    }]
  ]
}
```

---

## Adding build scripts

It's a good practice to add the following build scripts in your `package.json`:

```json
  ...
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development"
  },
  ...
```

This will allow you to build your project by simply running `yarn build`, or start a development server by running `yarn start`.

---

## Trying it out

You are now ready to start the webpack development server and see your project.

```sh
yarn start
```

You can now open [http://127.0.0.1:8080](http://127.0.0.1:8080) and see your app.

---

{{< topicnav "serving-compressed" "add-to-website" >}}
