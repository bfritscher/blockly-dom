# Blockly DOM

A hosted script which can be embedded into a webpage to interact with the DOM through Blockly coding.  It assumes learners are familiar with basic HTML and CSS, but have no JavaScript or other imperative programming experience.

Because learning the DOM and JavaScript syntax at the same time can be overwhelming, this solution uses [Blockly](https://developers.google.com/blockly/) to guide the learner and help familiarize them with JS syntax.

## Usage

add this script to the webpage (JSBin, codesandbox.io, ...)
```html
<script src="//bfritscher.github.io/blockly-dom/connect.js"></script>
```

Then a *Open Blockly Editor* button should appear on the lower left.

This should only be used to learn, not for production!

## Technology

This is a complete rewrite of the [Blockly Bridge](https://github.com/toolness/blockly-dom-tutorial). It uses a SharedWorker, LocalStorage and can also store the data on a remote server.
