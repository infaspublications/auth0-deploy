'use strict'

const chai = require('chai')
const expect = chai.expect
const func = require('./../../rules/add-usermeta-to-profile.js')

describe('#add-usermeta-to-profile', () => {
  it('should return profile with user_metadata', async () => {
    func({ user_metadata: { test: 'aaaa' } }, { idToken: {} }, (data, user, context) => {
      expect(context.idToken['https://wwdjapan.com/user_metadata']).to.deep.equal({ test: 'aaaa' })
      expect(data).to.be.a('null')
    })
  })
})
