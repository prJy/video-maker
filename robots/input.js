const readline = require('readline-sync')
const state = require('./state')

async function robot() {
    const content = {
        maximumSentences: 7
    }
    content.searchTerm = await askAndReturnSearchTerm()
    content.prefix = await askAndReturnPrefix()

    state.save(content)

    async function askAndReturnSearchTerm(){
       return readline.question('Type a Wikipedia search term:')
    }

    async function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose and option')
        const selectedPrefix = prefixes[selectedPrefixIndex]
        return selectedPrefix
    }
}

module.exports = robot;