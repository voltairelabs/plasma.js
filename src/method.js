export default class Method {
  constructor(options = {}) {
    if (!options.call || !options.name) {
      throw new Error(
        'When creating a method you need to provide at least the "name" and "call" property.'
      )
    }

    options.params = options.params || 0
    if (typeof options.params !== 'number') {
      throw new Error('Invalid params field')
    }

    if (options.requestManager) {
      // set request manager
      this.setRequestManager(options.requestManager)
    }

    this.name = options.name
    this.call = options.call
    this.params = options.params
    this.inputFormatter = options.inputFormatter
    this.outputFormatter = options.outputFormatter
  }

  setRequestManager(requestManager) {
    this.requestManager = requestManager
  }

  async send(...args) {
    const params = this.formatInput(args)
    this.validateArgs(params)

    // send request
    return this.requestManager.send({
      method: this.call,
      params: params
    })
  }

  validateArgs(args) {
    if (args.length !== this.params) {
      throw new Error(
        `Invalid number of parameters for ${this.call}. Got ${
          args.length
        }, expected ${this.params}`
      )
    }
  }

  formatInput(args) {
    if (!this.inputFormatter) {
      return args
    }

    // format each argument
    return this.inputFormatter.map((formatter, index) => {
      return formatter ? formatter.call(this, args[index]) : args[index]
    })
  }

  formatOutput(result) {
    if (Array.isArray(result)) {
      return result.map(r => {
        return this.outputFormatter && r ? this.outputFormatter(r) : r
      })
    }

    return this.outputFormatter && result
      ? this.outputFormatter(result)
      : result
  }
}
