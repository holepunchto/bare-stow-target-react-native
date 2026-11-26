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

  t.alike(dependencies, { 'bare-stow-host': '^0.2.0', 'react-native-bare-kit': '^0.17.1' })
})

test('generate with client', (t) => {
  snapshot(t, './core.client.js')
})

test('the bundle suits the engines of both platforms', (t) => {
  const resolve = (targetOptions) => {
    targetOptions = target.options(targetOptions)

    return [target.syntax({ targetOptions }), target.modules({ targetOptions })]
  }

  t.alike(resolve({}), ['esnext', 'esm'])
  t.alike(resolve({ ios: { engine: 'javascriptcore' } }), ['es2021', 'cjs'])
  t.alike(resolve({ android: { engine: 'quickjs' } }), ['es2024', 'cjs'])
  t.alike(resolve({ ios: { engine: 'javascriptcore' }, android: { engine: 'quickjs' } }), [
    'es2021',
    'cjs'
  ])
})

test('options reject an engine of another platform', (t) => {
  t.exception.all(
    () => target.options({ ios: { engine: 'quickjs' } }),
    /Option 'ios.engine' must be 'v8' or 'javascriptcore', got 'quickjs'/
  )
  t.exception.all(() => target.options({ windows: {} }), /Unknown option 'windows'/)
  t.exception.all(() => target.options({ ios: 'v8' }), /Option 'ios' must be an object/)
})
