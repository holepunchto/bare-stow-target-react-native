const test = require('brittle')
const target = require('.')

function snapshot(t, client = null) {
  const { source, types } = target.languages.javascript.generate({
    bundle: './index.bundle.mjs',
    client,
    resources: 'bare-stow',
    options: target.languages.javascript.options
  })

  t.snapshot(source, 'harness')
  t.snapshot(types, 'types')
}

test('generate', (t) => {
  t.is(target.name, 'react-native')
  t.is(target.isolation, 'thread')
  t.is(target.linking, 'app')
  t.is(target.format, 'bundle.mjs')
  t.alike(target.languages.javascript.options, { module: 'esm' })
  snapshot(t)
})

test('generate declares the packages the harness imports', (t) => {
  const { dependencies } = target.languages.javascript.generate({
    bundle: './index.bundle',
    client: null,
    resources: 'bare-stow',
    options: target.languages.javascript.options
  })

  t.alike(dependencies, { 'bare-stow-host': '^0.1.0', 'react-native-bare-kit': '^0.16.0' })
})

test('generate with client', (t) => {
  snapshot(t, './core.client.js')
})
