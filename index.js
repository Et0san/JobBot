// require the discord.js module
const Discord = require('discord.js');
var fs = require("fs");

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if(!message.author.bot){
		if(message.content.match(/\.me .+/)){
			if(Math.floor(Math.random()*2)==0){
				if(message.author.username === 'nullpo'){
					mySend(message.channel, 'Oui, c\'est toi ! Le seul et l\'unique !');
				} else {
					let mess = Math.floor(Math.random()*6);
					switch(mess){
						case 0: mess = 'est un bon à rien.';break;
						case 1: mess = 'est un étron puant.';break;
						case 2: mess = 'se croit mieux que les autres.';break;
						case 3: mess = 'pense donc il fuit.';break;
						case 4: mess = 'a l\'oeil lubrique.';break;
						default: mess = 'a gagné ~~au loto~~ le droit de rejouer.';break;
					}
					mySend(message.channel, '*' + message.member.displayName + ' ' + mess + '*');
				}
			} else {
				mySend(message.channel, '*' + message.member.displayName + ' ' + message.content.substring(4) + '*');
			}
		}

		if(message.author.username === 'nullpo'){
			if(message.content.match(/\.admin|\.gm|\.mj/)){
				mySend(message.channel, 'Oui, c\'est toi ! Le seul et l\'unique !');
			}
		}

		if(message.content.match(/\.help/)){
			mySend(message.author, 'Bonjour !');
			mySend(message.author, ':cateyes:');
			mySend(message.author, 'Voici la liste des commandes que j\'autorise sur le channel '+message.channel.name +' :');
			mySend(message.author, '`.help` : Affiche cette aide.');
			mySend(message.author, '`.list scenarii` : Affiche la liste des Scénarii disponibles.');
			mySend(message.author, '`.roll` : Lance les Dés pour déterminer le Ton.');
			mySend(message.author, '`.give <user>` : Donne les Dés (ainsi que le Centre d\'Attention) à un Scénariste, lors d\'une partie de Face au Titan.');
		}
		
		if(message.content.match(/\.list sc.nar/)){

		}

		if(message.content.match(/\.roll/)){
			const whiteDice = Math.floor(Math.random()*6)+1;
			const blackDice = Math.floor(Math.random()*6)+1;
			const order = Math.floor(Math.random()*2) == 0;
			if(order){
				mySend(message.channel, ':black_dice'+ whiteDice + ': :white_dice' + blackDice + ':');
			} else {
				mySend(message.channel, ':white_dice'+ blackDice + ': :black_dice' + whiteDice + ':');
			}
		}
	} else {
		if(message.content.match(/(.*white_dice.*|.*black_dice.*){2}/)){
			const dice = message.content.split(/ /);
			if(dice[1].match(/\D\d\D/)[0] === dice[0].match(/\D\d\D/)[0]){
				mySend(message.channel, 'Vous avez fait un double !');
			}
		}
	}
});

function mySend(dest, message) {
	dest.send(parseEmotes(message));
}

function parseEmotes(str) {
	let matched = [];
	let outString = str;
	let matcher = str.match(/:[_A-Za-z0-9]+:/g);
	if(matcher){
		matcher.map(x => {
			emoji = client.emojis.cache.find(emoji => x.match(emoji.name));
			if(emoji){
				matched.push(
					{ 
						found: x,
						replacement: emoji.toString()
					}
				);
			}
		});
		matched.forEach(data => outString = outString.replace(data.found, data.replacement));
	}
	return outString;
}

// login to Discord with your app's token
const tokenFile = fs.readFileSync("./myToken.json");
client.login(JSON.parse(tokenFile).token).then(console.log('connected')).catch('an error has occured');
