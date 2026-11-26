# bare-stow-target-react-native

The React Native target for `bare-stow` (<https://github.com/holepunchto/bare-stow>). It generates a harness that boots a stowed bundle in a `react-native-bare-kit` worklet.

```
npm i bare-stow-target-react-native
```

## Usage

Pass the target to `stow()`:

```js
const stow = require('bare-stow')
const target = require('bare-stow-target-react-native')

const entry = new URL('file:///app/core.js')
const out = new URL('file:///app/core-harness/')

for await (const artifact of stow(entry, target, out)) {
  console.log(artifact.url.href)
}
```

On the command line, `bare-stow` resolves `--target react-native` to this package:

```console
$ bare-stow pack --target react-native --out ./core-harness ./core.js
```

The harness imports `bare-stow-host` and `react-native-bare-kit`, which the generated `package.json` declares as dependencies, along with the RPC library when a `client` is requested.

The addons and assets of the bundle are left to the application, which links those of all of its bundles once with `bare-stow link`:

```console
$ bare-stow link --target bare-kit --language swift --out ./ios/BareKitAddons ./core.js ./push.js
$ bare-stow link --target bare-kit --language kotlin --language-option package=com.example.addons --out ./android/addons ./core.js ./push.js
```

### Engines

The bundle runs with the JavaScript engine that the application links on each platform, which is V8 by default. Set the target option `ios.engine` to `'javascriptcore'` or `android.engine` to `'quickjs'` when the application links the smaller engine instead, so that the bundle can run on it. Its ES modules are then converted to CommonJS, which neither engine loads ES modules without, and its syntax is lowered to ES2021 for JavaScriptCore and ES2024 for QuickJS. The bundle runs on both platforms, so it suits the engines of both:

```js
for await (const artifact of stow(entry, target, out, {
  targetOptions: { ios: { engine: 'javascriptcore' }, android: { engine: 'quickjs' } }
})) {
  console.log(artifact.url.href)
}
```

```console
$ bare-stow pack --target react-native --target-option ios.engine=javascriptcore --target-option android.engine=quickjs --out ./core-harness ./core.js
```

Link the addons with the same engine, as the target option `engine` of `bare-kit`.

## License

Apache-2.0
