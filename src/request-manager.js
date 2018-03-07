const validateSingleMessage = message => {
  return (
    !!message &&
    !message.error &&
    message.jsonrpc === '2.0' &&
    (typeof message.id === 'number' || typeof message.id === 'string') &&
    message.result !== undefined
  ) // only undefined is not valid json object
}

export default class RequestManager {
  constructor(provider) {
    this.setProvider(provider)
    this.messageId = 0
  }

  setProvider(provider) {
    this.provider = provider
  }

  /**
   * Should be used to asynchronously send request
   *
   * @method send
   * @param {Object} data
   * @returns {Promise} promise object
   */
  async send(data) {
    if (!this.provider) {
      throw new Error('Invalid provider')
    }

    const payload = this.toPayload(data.method, data.params)
    const result = await this.provider.send(payload)
    if (result.error) {
      throw new Error(
        `Returned error: ${
          result.error ? result.message : JSON.stringify(result)
        }`
      )
    }

    if (result.result === 'undefined') {
      throw new Error(
        `Invalid JSON RPC response: ${
          result && result.error && result.error.message
            ? result.error.message
            : JSON.stringify(result)
        }`
      )
    }

    return result.result
  }

  /**
   * Should be called to valid json create payload object
   *
   * @method toPayload
   * @param {Function} method of jsonrpc call, required
   * @param {Array} params, an array of method params, optional
   * @returns {Object} valid jsonrpc payload object
   */
  toPayload(method, params = []) {
    if (!method) {
      throw new Error(
        `JSONRPC method should be specified for params: ${JSON.stringify(
          params
        )}!`
      )
    }

    // advance message id
    this.messageId += 1

    return {
      jsonrpc: '2.0',
      id: this.messageId,
      method: method,
      params: params
    }
  }

  /**
   * Should be called to check if jsonrpc response is valid
   *
   * @method isValidResponse
   * @param {Object}
   * @returns {Boolean} true if response is valid, otherwise false
   */
  isValidResponse(response) {
    return Array.isArray(response)
      ? response.every(validateSingleMessage)
      : validateSingleMessage(response)
  }
}
