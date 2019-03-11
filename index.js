const bots = {
    userInput : require('./robots/userInput'),
    text: require('./robots/text')
};

async function start(){
	const content = {}
    await bots.userInput(content)
    await bots.text(content)

	console.log(content)
}
start()
