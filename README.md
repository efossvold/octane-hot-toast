<div align="center"><strong>octane-hot-toast</strong></div>
<div align="center">Port of <a href="https://github.com/timolins/react-hot-toast">react-hot-toast</a> for  <a href="https://octanejs.dev/">octane</a></div>

<div align="center">
  <a href="https://www.npmjs.com/package/octane-hot-toast"><img src="https://img.shields.io/npm/v/octane-hot-toast" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/octane-hot-toast"><img src="https://img.shields.io/npm/dm/octane-hot-toast" alt="downloads"/></a>
  <a href="https://codecov.io/github/efossvold/octane-hot-toast?branch=master"><img src="https://img.shields.io/codecov/c/github/efossvold/octane-hot-toast.svg?maxAge=86400" alt="coverage" /></a>
  <a href="https://github.com/efossvold/octane-hot-toast/blob/main/LICENSE"><img src="https://img.shields.io/github/license/efossvold/octane-hot-toast?color=yellow
  " alt="license" /></a>
</div>

<p></p>
<div align="center"><strong>Smoking hot  Notifications for Octane.</strong></div>
<div align="center"> Lightweight, customizable and beautiful by default.</div>

<p></p>
<div align="center">
<a href="https://react-hot-toast.com/">Website</a>
<span> · </span>
<a href="https://react-hot-toast.com/docs">Documentation</a>
<span> · </span>
<a href="https://twitter.com/timolins">Twitter</a>
</div>

<p></p>
<div align="center">
  <sub>Cooked by <a href="https://twitter.com/timolins">Timo Lins</a> 👨‍🍳</sub>
</div>

<p></p>

## Features

- 🔥 **Hot by default**
- 🔩 **Easily Customizable**
- ⏳ **Promise API** - _Automatic loader from a promise_
- 🕊 **Lightweight** - _less than 5kb including styles_
- ✅ **Accessible**
- 🤯 **Headless Hooks** - _Create your own with [`useToaster()`](https://react-hot-toast.com/docs/use-toaster)_

## Installation

```sh
# bun
bun i octane-hot-toast

# pnpm
pnpm add octane-hot-toast

# npm
npm install octane-hot-toast
```

## Getting Started

Add the Toaster to your app first. It will take care of rendering all notifications emitted. Now you can trigger `toast()` from anywhere!

```jsx
import toast, { Toaster } from 'octane-hot-toast'

const notify = () => toast('Here is your toast.')

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  )
}
```

## Documentation

Find the full API reference on https://react-hot-toast.com/docs.
