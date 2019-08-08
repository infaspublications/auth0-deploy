'use strict'

const chai = require('chai')
const expect = chai.expect
const loadScript = require('../../utils/load-custome-database-script')

describe('#get_user', () => {
  let script
  let stubs
  const globals = {}
  beforeEach(() => {
    globals.configuration = {
      DB_HOST: '<DB_HOST>',
      DB_USERNAME: '<DB_USERNAME>',
      DB_PASSWORD: '<DB_PASSWORD>',
      DB_DATABASE: '<DB_DATABASE>'
    }
  })

  it('should expose login info if userinfo exists in the legacy db', async () => {
    stubs = {
      mysql: {
        createConnection: () => {
          return {
            connect: () => {
              return true
            },
            query: (query, email, cb) => {
              cb(null, [
                {
                  id: 111,
                  email: 'test@example.com',
                  first_name: 'first_name',
                  surname: 'last_name'
                }
              ])
            }
          }
        }
      }
    }
    script = loadScript('get_user', globals, stubs)
    script('test', (data, user) => {
      expect(data).to.be.a('null')
      expect(user).to.deep.equal({
        user_id: '111',
        username: 'test',
        email: 'test@example.com',
        email_verified: true,
        name: 'first_name last_name'
      })
    })
  })

  it('should do nothing if userinfo does not exist in the legacy db', async () => {
    stubs = {
      mysql: {
        createConnection: () => {
          return {
            connect: () => {
              return true
            },
            query: (query, email, cb) => {
              cb(null, [])
            }
          }
        }
      }
    }
    script = loadScript('get_user', globals, stubs)
    script('test', (data, user) => {
      expect(data).to.be.a('null')
      expect(user).to.be.undefined
    })
  })
})
