import XHR2 from 'xhr2'

export default class HttpProvider {
  constructor(host = 'http://localhost:8080', timeout = 0, headers = []) {
    this.host = host
    this.timeout = timeout
    this.headers = headers
    this.connected = false
  }

  _prepareRequest() {
    const request = new XHR2()
    request.open('POST', this.host, true)
    request.setRequestHeader('Content-Type', 'application/json')
    this.headers.forEach(header => {
      request.setRequestHeader(header.name, header.value)
    })

    return request
  }

  send(payload) {
    return new Promise((resolve, reject) => {
      const request = this._prepareRequest()
      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.timeout !== 1) {
          let result = request.responseText
          let error = null
          this.connected = true
          try {
            result = JSON.parse(result)
            resolve(result)
          } catch (e) {
            error = new Error(request.responseText || 'Connection error')
            reject(error)
          }
        }
      }

      request.ontimeout = () => {
        this.connected = false
        reject(new Error('Connection timeout'))
      }

      try {
        request.send(JSON.stringify(payload))
      } catch (error) {
        this.connected = false
        reject(new Error(`Invalid connection ${this.host}`))
      }
    })
  }
}
