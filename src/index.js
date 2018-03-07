import HttpProvider from './http-provider'
import RequestManager from './request-manager'
import Method from './method'

export default class Plasma {
  constructor(provider) {
    if (provider instanceof HttpProvider) {
      this.currentProvider = provider
    }

    if (typeof provider === 'string') {
      this.currentProvider = new HttpProvider(provider)
    }

    if (!this.currentProvider) {
      throw new Error('Invalid provider')
    }

    this.requestManager = new RequestManager(this.currentProvider)

    // create methods
    this._createMethods()
  }

  _createMethods() {
    const methods = [
      new Method({
        name: 'getLatestBlock',
        call: 'plasma_getLatestBlock',
        params: 0,
        requestManager: this.requestManager
      }),
      new Method({
        name: 'getLatestBlockNumber',
        call: 'plasma_getLatestBlockNumber',
        params: 0,
        requestManager: this.requestManager
      })
    ]

    methods.forEach(m => {
      Object.defineProperty(this, m.name, {
        enumerable: true,
        configurable: true,
        writable: false,
        value: (...args) => {
          return m.send(...args)
        }
      })
    })
  }
}
