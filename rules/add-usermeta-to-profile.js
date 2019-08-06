module.exports = function(user, context, callback) {
  const namespace = 'https://wwdjapan.com/'
  context.idToken[namespace + 'user_metadata'] = user.user_metadata
  callback(null, user, context)
}
