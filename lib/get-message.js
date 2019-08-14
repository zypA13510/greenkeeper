const _ = require('lodash')
const { defaultCommitMessages } = require('./default-commit-messages')
const { defaultPrTitles } = require('./default-pr-titles')

function replaceVariables (message, variables) {
  let replacedString = message

  Object.keys(variables).forEach((key) => {
    replacedString = replacedString.replace(`\${${key}}`, variables[key])
  })

  return replacedString
}

function hasInvalidVar (message) {
  return message.match(/\${.+?}/)
}

function getMessage (commitMessages, messageKey, values) {
  if (!_.has(commitMessages, messageKey)) {
    throw new Error(`Unknown message messageKey '${messageKey}'`)
  }

  // get rid of null and undefined
  const templateValues = Object.assign({}, values)

  let commitMessage = replaceVariables(_.get(commitMessages, messageKey), templateValues)

  // if someone replaced the variable name with something else,
  // return the default message for that messageKey
  if (hasInvalidVar(commitMessage)) {
    commitMessage = replaceVariables(_.get(defaultCommitMessages, messageKey), templateValues)
  }

  return commitMessage
}

function getPrTitle ({ version, dependency, group, prTitles }) {
  const variables = { dependency, group }
  if (!_.has(prTitles, version)) {
    throw new Error(`exited: Unknown PR key '${version}'`)
  }

  let prTitle = replaceVariables(_.get(prTitles, version), variables)

  // if someone replaced the variable name with something else,
  // return the default pr title for that messageKey
  if (hasInvalidVar(prTitle)) {
    prTitle = replaceVariables(_.get(defaultPrTitles, version), variables)
  }

  return prTitle
}

module.exports = {
  getMessage,
  getPrTitle
}
