'use strict'

const chai = require('chai')
const expect = chai.expect
const proxyquire = require('proxyquire')

describe('#login', () => {
  let login
  beforeEach(() => {
    global.configuration = {
      DB_HOST: '<DB_HOST>',
      DB_USERNAME: '<DB_USERNAME>',
      DB_PASSWORD: '<DB_PASSWORD>',
      DB_DATABASE: '<DB_DATABASE>'
    }
    global.WrongUsernameOrPasswordError = function() {}
  })

  it('should expose login info if login succeed', async () => {
    const proxymysql = {
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
    const proxybcrypt = {
      compare: (password, userPassword, cb) => {
        cb(null, true)
      }
    }
    login = proxyquire('../../../databases/Username-Password-Authentication/login', {
      mysql: proxymysql,
      bcrypt: proxybcrypt
    })
    login('test', 'password', (data, user) => {
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
    const proxymysql = {
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
    const proxybcrypt = {
      compare: (password, userPassword, cb) => {
        cb(null, false)
      }
    }
    login = proxyquire('../../../databases/Username-Password-Authentication/login', {
      mysql: proxymysql,
      bcrypt: proxybcrypt
    })
    login('test', 'password', (data) => {
      expect(data).to.be.an.instanceof(global.WrongUsernameOrPasswordError)
    })
  })

  it('should return error if user data is not in the legacy db', async () => {
    const proxymysql = {
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
    const proxybcrypt = {
      compare: (password, userPassword, cb) => {
        cb(null, false)
      }
    }
    login = proxyquire('../../../databases/Username-Password-Authentication/login', {
      mysql: proxymysql,
      bcrypt: proxybcrypt
    })
    login('test', 'password', (data) => {
      expect(data).to.be.an.instanceof(global.WrongUsernameOrPasswordError)
    })
  })

  it('should return error if the legacy db error occurs', async () => {
    const proxymysql = {
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
    const proxybcrypt = {
      compare: (password, userPassword, cb) => {
        cb(null, false)
      }
    }
    login = proxyquire('../../../databases/Username-Password-Authentication/login', {
      mysql: proxymysql,
      bcrypt: proxybcrypt
    })
    login('test', 'password', (data) => {
      expect(data).to.be.equal('error')
    })
  })
})
