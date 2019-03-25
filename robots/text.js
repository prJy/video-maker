const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const watson = {
    nlu: require('../services/watson/watson-nlu')
}

const state = require('./state')

async function robot() {

    const content = state.load()
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSetence(content)
    limitMaximumSentences(content)
    await fetchAllKeyWordsOfAllSentences(content)
    state.save(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content;
    }

    async function sanitizeContent(content) {
        const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(content.sourceContentOriginal)
        const withoutDateInParentheses = removeDataInParentheses(withoutBlankLinesAndMarkDown)

        content.sourceContentSanitized = withoutDateInParentheses

        function removeBlankLinesAndMarkDown(text) {
            const allLines = text.split('\n')
            const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
                if ((line.trim().length === 0) || (line.trim().startsWith('='))) {
                    return false
                }
                return true
            })
            return withoutBlankLinesAndMarkDown.join(' ')
        }

        function removeDataInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }
    }

    async function breakContentIntoSetence(content) {
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) =>{
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function fetchAllKeyWordsOfAllSentences(content){
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchKeyWordsFromWatson(sentence.text)
        }
    }

    async function fetchKeyWordsFromWatson(sentence) {
        return new Promise((resolve, reject) =>{
            watson.nlu.analyze({
                'text': sentence,
                'features': {
                    'keywords': {}
                }
            }, (error, response) => {
                if (error){
                    throw error
                }
                const keywords = response.keywords.map((keyword) => {
                    return keyword.text
                })
                resolve(keywords)
            });
        })
    }
}
module.exports = robot