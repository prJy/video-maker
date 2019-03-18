const watsonNLUCredentials = require('../../credentials/watson-nlu.json')
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonNLUCredentials.apikey,
  version: '2018-04-05',
  url: watsonNLUCredentials.url
})

module.exports = naturalLanguageUnderstanding