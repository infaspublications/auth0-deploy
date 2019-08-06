'use strict'

const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect
const loadRule = require('../utils/load-rule')
const ruleName = 'add-default-role-when-initial-signup'

describe('#add-default-role-when-initial-signup', () => {
  let rule
  let globals
  let stubs
  let spy
  beforeEach(() => {
    globals = {
      auth0: {
        domain: 'mydomain.auth0.com',
        accessToken: 'xxxx'
      },
      configuration: { DEFAULT_ROLE: 'xxx' }
    }

    stubs = {
      'auth0@2.17.0': {
        ManagementClient: class {
          assignRolestoUser(user, roles, cb) {
            cb(null)
          }
        }
      }
    }

    spy = sinon.spy(stubs['auth0@2.17.0'].ManagementClient.prototype, 'assignRolestoUser')

    rule = loadRule(ruleName, globals, stubs)
  })

  it('should call assignRolestoUser when first login', async () => {
    rule({ user_id: 1 }, { stats: { loginsCount: 1 } }, (data, user, context) => {
      expect(data).to.be.a('null')
      expect(user).to.deep.equal({ user_id: 1 })
      expect(context).to.deep.equal({ stats: { loginsCount: 1 } })
      expect(spy.calledOnce).to.be.true
    })
  })

  it('should not call assignRolestoUser when next login', async () => {
    rule({ user_id: 1 }, { stats: { loginsCount: 2 } }, (data, user, context) => {
      expect(data).to.be.a('null')
      expect(user).to.deep.equal({ user_id: 1 })
      expect(context).to.deep.equal({ stats: { loginsCount: 2 } })
      expect(spy.calledOnce).to.be.false
    })
  })
})
