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

## License

Apache-2.0
