module.exports = function(user, context, callback) {
  const count = context.stats && context.stats.loginsCount ? context.stats.loginsCount : 0
  if (count > 1) {
    return callback(null, user, context)
  }

  const ManagementClient = require('auth0@2.17.0').ManagementClient
  const management = new ManagementClient({
    token: auth0.accessToken, // eslint-disable-line no-undef
    domain: auth0.domain // eslint-disable-line no-undef
  })

  management.assignRolestoUser(
    { id: user.user_id },
    { roles: [configuration.DEFAULT_ROLE] }, // eslint-disable-line no-undef
    function(error) {
      if (error) {
        callback(error)
      }
      callback(null, user, context)
    }
  )
}
