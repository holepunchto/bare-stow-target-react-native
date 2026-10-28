/* eslint-disable */

exports['generate - harness - 0'] = `import { Worklet } from 'react-native-bare-kit'
import stow from 'bare-stow-host'
import bundle from "./index.bundle.mjs"

export default {
  async start({ timeout, grace, ...opts } = {}) {
    const worklet = new Worklet(opts)

    worklet.start("bare-stow.bundle", bundle)

    const ipc = stow.wrap(worklet.IPC, { kill: () => worklet.terminate(), timeout, grace })

    // The worklet outlives its runtime until terminated, so release it once the
    // runtime has reported its exit.
    ipc.on('exit', () => worklet.terminate())

    await ipc.ready

    return { ipc }
  }
}
`

exports['generate - types - 0'] = `declare const harness: {
  start(
    opts?: import('react-native-bare-kit').WorkletOptions &
      Omit<import('bare-stow-host').IPCOptions, 'kill'>
  ): Promise<{ ipc: import('bare-stow-host').IPC }>
}

export default harness
`

exports['generate with client - harness - 0'] = `import { Worklet } from 'react-native-bare-kit'
import stow from 'bare-stow-host'
import bundle from "./index.bundle.mjs"
import * as client from "./core.client.js"

export default {
  async start({ timeout, grace, ...opts } = {}) {
    const worklet = new Worklet(opts)

    worklet.start("bare-stow.bundle", bundle)

    const ipc = stow.wrap(worklet.IPC, { kill: () => worklet.terminate(), timeout, grace })

    // The worklet outlives its runtime until terminated, so release it once the
    // runtime has reported its exit.
    ipc.on('exit', () => worklet.terminate())

    const rpc = client.attach(ipc)

    await ipc.ready

    return { ipc, rpc }
  }
}
`

exports['generate with client - types - 0'] = `declare const harness: {
  start(
    opts?: import('react-native-bare-kit').WorkletOptions &
      Omit<import('bare-stow-host').IPCOptions, 'kill'>
  ): Promise<{ ipc: import('bare-stow-host').IPC; rpc: ReturnType<typeof import("./core.client.js").attach> }>
}

export default harness
`

/* eslint-enable */
