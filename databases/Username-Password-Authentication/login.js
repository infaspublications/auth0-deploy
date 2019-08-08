// eslint-disable-next-line no-unused-vars
function login(email, password, callback) {
  const mysql = require('mysql')
  const bcrypt = require('bcrypt')

  const connection = mysql.createConnection({
    host: configuration.DB_HOST, // eslint-disable-line no-undef
    user: configuration.DB_USERNAME, // eslint-disable-line no-undef
    password: configuration.DB_PASSWORD, // eslint-disable-line no-undef
    database: configuration.DB_DATABASE // eslint-disable-line no-undef
  })

  connection.connect()

  const query =
    'SELECT account_storages.id as id, email, password, surname, first_name FROM account_storages LEFT JOIN esuite_accounts ON account_storages.id = esuite_accounts.id WHERE email = ?'

  connection.query(query, [email], function(err, results) {
    if (err) return callback(err)
    if (results.length === 0) return callback(new WrongUsernameOrPasswordError(email)) // eslint-disable-line no-undef
    const user = results[0]
    // phpのbcryptのprefixをnodeに変更
    const userPassword = user.password.replace('$2y$', '$2a$')

    bcrypt.compare(password, userPassword, function(error, isValid) {
      if (error || !isValid) return callback(error || new WrongUsernameOrPasswordError(email)) // eslint-disable-line no-undef

      callback(null, {
        user_id: user.id.toString(),
        username: user.email.replace(/@.+$/, ''),
        email: user.email,
        email_verified: true,
        name: user.first_name + ' ' + user.surname
      })
    })
  })
}
