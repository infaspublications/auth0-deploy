'use strict'

const chai = require('chai')
const expect = chai.expect
const loadScript = require('../../utils/load-custome-database-script')

describe('#login', () => {
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
    globals.WrongUsernameOrPasswordError = function() {}
  })

  it('should expose login info if login succeed', async () => {
    stubs = {
      bcrypt: {
        compare: (password, userPassword, cb) => {
          cb(null, true)
        }
      },
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
                  surname: 'last_name',
                  password: '$2y$password'
                }
              ])
            }
          }
        }
      }
    }
    script = loadScript('login', globals, stubs)
    script('test', 'password', (data, user) => {
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

  it('should return error if login fail', async () => {
    stubs = {
      bcrypt: {
        compare: (password, userPassword, cb) => {
          cb(null, false)
        }
      },
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
                  surname: 'last_name',
                  password: '$2y$password'
                }
              ])
            }
          }
        }
      }
    }
    script = loadScript('login', globals, stubs)
    script('test', 'password', (data) => {
      expect(data).to.be.an.instanceof(globals.WrongUsernameOrPasswordError)
    })
  })

  it('should return error if user data is not in the legacy db', async () => {
    stubs = {
      bcrypt: {
        compare: (password, userPassword, cb) => {
          cb(null, false)
        }
      },
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
    script = loadScript('login', globals, stubs)
    script('test', 'password', (data) => {
      expect(data).to.be.an.instanceof(globals.WrongUsernameOrPasswordError)
    })
  })

  it('should return error if the legacy db error occurs', async () => {
    stubs = {
      bcrypt: {
        compare: (password, userPassword, cb) => {
          cb(null, false)
        }
      },
      mysql: {
        createConnection: () => {
          return {
            connect: () => {
              return true
            },
            query: (query, email, cb) => {
              cb('error', [])
            }
          }
        }
      }
    }
    script = loadScript('login', globals, stubs)
    script('test', 'password', (data) => {
      expect(data).to.be.equal('error')
    })
  })
})
