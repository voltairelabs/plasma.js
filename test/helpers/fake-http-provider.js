import HTTPProvider from '../../src/http-provider'

const block = {
  number: 1,
  hash: '0x4eae5c427f2a399c101f0f43831933146ad04e40bf175f491bc6a2a1440997ec',
  header: {
    number:
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    root: '0xf3227a90177afac4b31ee3120d6e4fdfdf500f8496fa7256786404570e16a741',
    createdAt: '0x'
  },
  transactions: [
    {
      blknum1: '0x',
      txindex1: '0x',
      oindex1: '0x',
      blknum2: '0x',
      txindex2: '0x',
      oindex2: '0x',
      newowner1: '0x9fb29aac15b9a4b7f17c3385939b007540f4d791',
      amount1:
        '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      newowner2: '0x0000000000000000000000000000000000000000',
      amount2: '0x',
      fee: '0x',
      sig1:
        '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      sig2:
        '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    }
  ]
}

export default class FakeHTTPProvider extends HTTPProvider {
  constructor() {
    super()
    this.latestBlockNumber = 0
  }

  setLatestBlockNumber(b) {
    this.latestBlockNumber = b
  }

  async send(obj) {
    if (obj.method === 'plasma_getLatestBlockNumber') {
      return {
        jsonrpc: obj.jsonrpc,
        id: obj.id,
        result: this.latestBlockNumber
      }
    } else if (obj.method === 'plasma_getLatestBlock') {
      return {
        jsonrpc: obj.jsonrpc,
        id: obj.id,
        result: block
      }
    }

    // send param as result
    return {
      jsonrpc: obj.jsonrpc,
      id: obj.id,
      result: obj.params
    }
  }
}
