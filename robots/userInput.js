const readline = require('readline-sync')
async function userInput(content) {
    content.searchTerm = await askAndReturnSearchTerm()
    content.prefix = await askAndReturnPrefix()

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

module.exports = userInput;