<div align="center"><strong>octane-hot-toast</strong></div>
<div align="center">Port of <a href="https://github.com/timolins/react-hot-toast">react-hot-toast</a> for  <a href="https://octanejs.dev/">octane</a></div>

<!-- <div align="center">
    <img src="https://badgen.net/npm/v/octane-hot-toast" alt="NPM Version" />
  <img src="https://badgen.net/bundlephobia/minzip/octane-hot-toast" alt="minzipped size"/>
    <img src="https://github.com/timolins/octane-hot-toast/workflows/CI/badge.svg" alt="Build Status" />
</a>
</div> -->

[![version](https://img.shields.io/npm/v/octane-hot-toast)](https://www.npmjs.com/package/octane-hot-toast)
<!-- [![gzip size](https://img.badgesize.io/https://unpkg.com/octane-hot-toast@latest/dist/octane-hot-toast.modern.js?compression=gzip)](https://unpkg.com/octane-hot-toast) -->

[![downloads](https://img.shields.io/npm/dm/octane-hot-toast)](https://www.npmjs.com/package/octane-hot-toast)
<!-- [![coverage](https://img.shields.io/codecov/c/github/efossvold/octane-hot-toast.svg?maxAge=2592000)](https://codecov.io/github/cristianbote/octane-hot-toast?branch=master) -->

<br />
<div align="center"><strong>Smoking hot  Notifications for Octane.</strong></div>
<div align="center"> Lightweight, customizable and beautiful by default.</div>
<br />
<div align="center">
<a href="https://react-hot-toast.com/">Website</a>
<span> · </span>
<a href="https://react-hot-toast.com/docs">Documentation</a>
<span> · </span>
<a href="https://twitter.com/timolins">Twitter</a>
</div>

<br />
<div align="center">
  <sub>Cooked by <a href="https://twitter.com/timolins">Timo Lins</a> 👨‍🍳</sub>
</div>

<br />

## Features

- 🔥 **Hot by default**
- 🔩 **Easily Customizable**
- ⏳ **Promise API** - _Automatic loader from a promise_
- 🕊 **Lightweight** - _less than 5kb including styles_
- ✅ **Accessible**
- 🤯 **Headless Hooks** - _Create your own with [`useToaster()`](https://react-hot-toast.com/docs/use-toaster)_

## Installation

#### With bun

```sh
bun i octane-hot-toast
```

#### With pnpm

```sh
pnpm add octane-hot-toast
```

#### With NPM

```sh
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

Find the full API reference on [official documentation](https://react-hot-toast.com/docs).
