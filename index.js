const bots = {
    userInput : require('./robots/userInput'),
    text: require('./robots/text')
};

async function start(){
	const content = {
        maximumSentences: 7
    }

    await bots.userInput(content)
    await bots.text(content)

	console.log(JSON.stringify(content, null, 4))
}
start()
