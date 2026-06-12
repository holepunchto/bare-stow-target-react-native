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
const out = new URL('file:///app/out/index.js')

for await (const artifact of stow(entry, target, out)) {
  console.log(artifact.url.href)
}
```

On the command line, `bare-stow` resolves `--target react-native` to this package:

```console
$ bare-stow --target react-native --out ./out/index.js ./core.js
```

## License

Apache-2.0
