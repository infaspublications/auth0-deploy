const auth0 = require('auth0-deploy-cli')

const config = {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_ALLOW_DELETE: true
}

auth0
  .deploy({
    input_file: 'tenant.yaml',
    config,
    env: process.env
  })
  .then(() => console.log('yey deploy was successful')) // eslint-disable-line no-console
  .catch((err) => console.log(`Oh no, something went wrong. Error: ${err}`)) // eslint-disable-line no-console
