exports.name = 'react-native'
exports.isolation = 'thread'
exports.linked = true
exports.linking = 'app'
exports.offload = false
exports.format = 'bundle.mjs'
exports.encoding = 'utf8'
exports.extension = '.bundle.mjs'
exports.hosts = [
  'ios-arm64',
  'ios-arm64-simulator',
  'ios-x64-simulator',
  'android-arm',
  'android-arm64',
  'android-ia32',
  'android-x64'
]

exports.languages = {
  javascript: {
    options: { module: 'esm' },
    generate: javascript
  }
}

function javascript(context) {
  const { bundle, client, resources } = context

  const handle = client
    ? `{ ipc: import('bare-stow-host').IPC; rpc: ReturnType<typeof import(${JSON.stringify(client)}).attach> }`
    : `{ ipc: import('bare-stow-host').IPC }`

  const source = `\
import { Worklet } from 'react-native-bare-kit'
import stow from 'bare-stow-host'
import bundle from ${JSON.stringify(bundle)}
${client ? `import * as client from ${JSON.stringify(client)}\n` : ''}
export default {
  async start({ timeout, grace, ...opts } = {}) {
    const worklet = new Worklet(opts)

    worklet.start(${JSON.stringify(resources + '.bundle')}, bundle)

    const ipc = stow.wrap(worklet.IPC, { kill: () => worklet.terminate(), timeout, grace })

    // The worklet outlives its runtime until terminated, so release it once the
    // runtime has reported its exit.
    ipc.on('exit', () => worklet.terminate())
${client ? '\n    const rpc = client.attach(ipc)\n' : ''}
    await ipc.ready

    return ${client ? '{ ipc, rpc }' : '{ ipc }'}
  }
}
`

  const types = `\
declare const harness: {
  start(
    opts?: import('react-native-bare-kit').WorkletOptions &
      Omit<import('bare-stow-host').IPCOptions, 'kill'>
  ): Promise<${handle}>
}

export default harness
`

  return {
    source,
    types,
    dependencies: {
      'bare-stow-host': '^0.1.0',
      'react-native-bare-kit': '^0.16.0'
    }
  }
}
