const bots = {
    input : require('./robots/input'),
    text: require('./robots/text'),
    state: require('./robots/state')
};

async function start(){

    bots.input()
    await bots.text()

    content = bots.state.load()
	console.dir(content, { depth: null })
}
start()
