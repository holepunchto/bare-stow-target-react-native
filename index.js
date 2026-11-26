exports.name = 'react-native'
exports.isolation = 'thread'
exports.linked = true
exports.linking = 'app'
exports.offload = false
exports.format = 'bundle.mjs'
exports.encoding = 'utf8'
exports.extension = '.bundle.mjs'
exports.syntax = syntax
exports.modules = modules
exports.hosts = [
  'ios-arm64',
  'ios-arm64-simulator',
  'ios-x64-simulator',
  'android-arm',
  'android-arm64',
  'android-ia32',
  'android-x64'
]

const engines = {
  ios: ['v8', 'javascriptcore'],
  android: ['v8', 'quickjs']
}

exports.options = function options(given = {}) {
  const resolved = { ios: { engine: 'v8' }, android: { engine: 'v8' } }

  for (const [platform, opts] of Object.entries(given)) {
    if (!Object.hasOwn(engines, platform)) {
      throw new Error(`Unknown option '${platform}' for target 'react-native'`)
    }

    if (typeof opts !== 'object' || opts === null) {
      throw new Error(`Option '${platform}' must be an object, got '${opts}'`)
    }

    const { engine = 'v8', ...unknown } = opts

    for (const option of Object.keys(unknown)) {
      throw new Error(`Unknown option '${platform}.${option}' for target 'react-native'`)
    }

    if (!engines[platform].includes(engine)) {
      const supported = engines[platform].map((name) => `'${name}'`)

      throw new Error(
        `Option '${platform}.engine' must be ${supported.join(' or ')}, got '${engine}'`
      )
    }

    resolved[platform] = { engine }
  }

  return resolved
}

// The bundle runs on both platforms, so it must suit the engine of each.
// JavaScriptCore lacks class static blocks until iOS 16.4, past the minimum
// version of React Native.
function syntax({ targetOptions }) {
  const used = usedEngines(targetOptions)

  if (used.includes('javascriptcore')) return 'es2021'
  if (used.includes('quickjs')) return 'es2024'
  return 'esnext'
}

function modules({ targetOptions }) {
  return usedEngines(targetOptions).every((engine) => engine === 'v8') ? 'esm' : 'cjs'
}

function usedEngines(targetOptions) {
  return Object.keys(engines).map((platform) => targetOptions[platform].engine)
}

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
  async start({ timeout, grace, ${client ? 'handlers = () => {}, ' : ''}...opts } = {}) {
    const worklet = new Worklet(opts)

    worklet.start(${JSON.stringify(resources + '.bundle')}, bundle)

    const ipc = stow.wrap(worklet.IPC, { kill: () => worklet.terminate(), timeout, grace })

    worklet.IPC.on('end', () => worklet.IPC.destroy())

    worklet.on('exit', (code) => ipc.exited(code))
${client ? '\n    const rpc = client.attach(ipc, handlers)\n' : ''}
    await ipc.ready

    return ${client ? '{ ipc, rpc }' : '{ ipc }'}
  }
}
`

  const types = `\
declare const harness: {
  start(
    opts?: import('react-native-bare-kit').WorkletOptions &
      Omit<import('bare-stow-host').IPCOptions, 'kill'>${client ? ` & { handlers?: import(${JSON.stringify(client)}).Handlers }` : ''}
  ): Promise<${handle}>
}

export default harness
`

  return {
    source,
    types,
    dependencies: {
      'bare-stow-host': '^0.2.0',
      'react-native-bare-kit': '^0.17.1'
    }
  }
}
