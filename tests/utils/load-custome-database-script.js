'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Loads a db script , optionally with stubs
 *
 * @param {string} scriptFileName - file name of db script to load
 * @param {object} globals - the global context the rule is executed within
 * @param {object} stubs - modules to override when required by the rule
 **/
module.exports = function(scriptFileName, globals, stubs) {
  globals = globals || {}
  stubs = stubs || {}

  const fileName = path.join(
    __dirname,
    '../../databases/Username-Password-Authentication/',
    scriptFileName + '.js'
  )
  const data = fs.readFileSync(fileName, 'utf8')
  const code = data.substr(data.indexOf('function'))
  return compile(code, globals, stubs)
}

function compile(code, globals, stubs) {
  function fakeRequire(moduleName) {
    return stubs[moduleName] || require(moduleName)
  }

  const globalObj = Object.assign({}, { require: fakeRequire }, globals)
  const params = Object.keys(globalObj)
  const paramValues = params.map((name) => globalObj[name])
  //console.log(eval(params.concat(`getByEmail()\n ${code}`)))

  return Function.apply(null, params.concat(`return ${code}`)).apply(null, paramValues)
}
