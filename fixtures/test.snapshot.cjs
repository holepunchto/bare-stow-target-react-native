/* eslint-disable */

exports['generate - harness - 0'] = `import { Worklet } from 'react-native-bare-kit'
import stow from 'bare-stow/host'
import bundle from "./core.bundle.mjs"

export default {
  async start(opts = {}) {
    const worklet = new Worklet(opts)

    worklet.start('/core.bundle', bundle)

    const ipc = stow.wrap(worklet.IPC)

    await ipc.ready

    return { ipc }
  }
}
`

exports['generate - types - 0'] = `declare const harness: {
  start(opts?: object): Promise<{ ipc: import('bare-stow/host').IPC }>
}

export default harness
`

exports['generate with client - harness - 0'] = `import { Worklet } from 'react-native-bare-kit'
import stow from 'bare-stow/host'
import bundle from "./core.bundle.mjs"

export default {
  async start(opts = {}) {
    const worklet = new Worklet(opts)

    worklet.start('/core.bundle', bundle)

    const ipc = stow.wrap(worklet.IPC)

    import RPC from 'bare-rpc'

    const router = new RPC.CommandRouter()
    const rpc = new RPC(ipc, router)

    rpc.respond = router.respond.bind(router)

    await ipc.ready

    return { ipc, rpc }
  }
}
`

exports['generate with client - types - 0'] = `declare const harness: {
  start(opts?: object): Promise<{ ipc: import('bare-stow/host').IPC; rpc: import('bare-rpc') }>
}

export default harness
`

/* eslint-enable */
