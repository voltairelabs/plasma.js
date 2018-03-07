/* global describe, it, before */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

import Method from '../src/method'
import RequestManager from '../src/request-manager'
import FakeHttpProvider from './helpers/fake-http-provider'

chai.use(chaiAsPromised)
chai.should()

const expect = chai.expect

describe('Method', () => {
  describe('Initialization', () => {
    it('should create instance of method', () => {
      const method = new Method({
        name: 'testMethod',
        call: 'plasma_testMethod'
      })
      expect(method).to.be.an('object')
      expect(method.name).to.be.equal('testMethod')
      expect(method.call).to.be.equal('plasma_testMethod')
    })
  })

  describe('Send function', () => {
    let provider
    let requestManager

    before(() => {
      provider = new FakeHttpProvider()
      requestManager = new RequestManager(provider)
    })

    it('should have send method', () => {
      const method = new Method({
        name: 'testMethod',
        call: 'plasma_testMethod'
      })
      expect(method.send).to.be.a('function')
    })

    it('should check params before send', () => {
      const method = new Method({
        name: 'testMethod',
        call: 'plasma_testMethod',
        params: 2
      })

      return method.send('first argument').should.be.rejectedWith(Error)
    })

    it('should check request manager before send', () => {
      const method = new Method({
        name: 'testMethod',
        call: 'plasma_testMethod',
        params: 1
      })

      return method.send('first argument').should.be.rejectedWith(Error)
    })

    it('should return params as result with fake provider', () => {
      const method = new Method({
        name: 'testMethod',
        call: 'plasma_testMethod',
        params: 1,
        requestManager: requestManager
      })

      expect(method.requestManager.messageId).to.equal(requestManager.messageId)
      return method
        .send('first argument')
        .should.eventually.deep.equal(['first argument'])
    })
  })
})
