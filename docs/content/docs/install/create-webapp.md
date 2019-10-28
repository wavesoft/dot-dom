---
title: "Web-App with JSX"
type: docs
weight: 3
# bookFlatSection: false
# bookShowToC: true
---

# Creating a WebApp with JSX

If you want a more descriptive syntax for expressing your components, `.dom` natively supports [React's JSX](https://reactjs.org/docs/introducing-jsx.html) syntax.

You can use the same tooling as with React to pre-process your javascript sources and convert them to `.dom` function calls. In this page we are describing step-by-step the process you should follow in order to create a single-page application using webpack and babel.

---

## Starting a node project

First we should start by creating a blank new node.js project:

```sh
mkdir my-dotdom-app; cd my-dotdom-app
yarn init -y
```

{{< hint "info" >}}
[`yarn`](https://yarnpkg.com/lang/en/) is a faster package manager than `npm` an we are urging your to give it a try if you haven't done already. However if you still want to use `npm`, substitute the commands like so:

* `yarn init -y` &rarr; `npm init -y`
* `yarn add ...` &rarr; `npm install --save ...`
* `yarn add -D ...` &rarr; `npm install --save-dev ...`
{{< /hint >}}

---

## Setting-up Dependencies
 
We are going to use [webpack](https://webpack.js.org/) as our main build tool. It is responsible for packaging all of our project assets into bundles, pre-processing them with some filters if needed. Let's add it:

```sh
yarn add -D webpack webpack-cli webpack-dev-server
```

We are going to use [`babel`](https://babeljs.io/) to pre-process our javascript sources on-the-fly. And more specifically, we are going to use the [`plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) plugin to convert the JSX notation into standard javascript.

We are also going to use the smart [`preset-env`](https://babeljs.io/docs/en/babel-preset-env) that automatically finds out the correct javascript transformations in order to be compatible with all browser versions.

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

{{< hint "info" >}}
This funny tag syntax is neither a string nor HTML. It is called JSX, and it is a [syntax extension to JavaScript](https://reactjs.org/docs/introducing-jsx.html) proposed by React.
{{</ hint >}}

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

For our next step, we should configure webpack. More specifically we must instruct it to pass all the `.js` sources through the `babel-loader` plugin, that is going to translate the JSX expressions in our source code.

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

{{< topicnav "serving-compressed" "create-website" >}}
