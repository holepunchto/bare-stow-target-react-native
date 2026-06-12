const test = require('brittle')
const target = require('.')

const client = {
  source: `import RPC from 'bare-rpc'

const router = new RPC.CommandRouter()
const rpc = new RPC(ipc, router)

rpc.respond = router.respond.bind(router)
`,
  type: "import('bare-rpc')"
}

function snapshot(t, bundleSpecifier, client = null) {
  const [harness, types] = target.generate({
    bundleSpecifier,
    ipc: 'ipc',
    rpc: 'rpc',
    client
  })

  t.snapshot(harness.source, 'harness')
  t.snapshot(types.source, 'types')
}

test('generate', (t) => {
  t.is(target.name, 'react-native')
  t.is(target.format, 'bundle.mjs')
  snapshot(t, './core.bundle.mjs')
})

test('generate with client', (t) => {
  snapshot(t, './core.bundle.mjs', client)
})
