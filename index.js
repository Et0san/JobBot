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
		if(message.content.match('\\.me .+')){
			if(Math.floor(Math.random()*2)==0){
				if(message.author.username === 'nullpo'){
					message.channel.send('Oui, c\'est toi ! Le seul et l\'unique !');
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
					message.channel.send('*' + message.member.displayName + ' ' + mess + '*');
				}
			} else {
				message.channel.send('*' + message.member.displayName + ' ' + message.content.substring(4) + '*');
			}
		}

		if(message.author.username === 'nullpo'){
			if(message.content.match('\\.admin|\\.gm|\\.mj')){
				message.channel.send('Oui, c\'est toi ! Le seul et l\'unique !');
			}
		}

		if(message.content.match('\\.help')){
			message.author.send('Bonjour !');
			message.author.send(':cateyes:');
			message.author.send('Voici la liste des commandes que j\'autorise sur le channel '+message.channel.name +' :');
			message.author.send('`.help` : Affiche cette aide.');
			message.author.send('`.list scenarii` : Affiche la liste des Scénarii disponibles.');
			message.author.send('`.roll` : Lance les Dés pour déterminer le Ton.');
			message.author.send('`.give <user>` : Donne les Dés (ainsi que le Centre d\'Attention) à un Scénariste, lors d\'une partie de Face au Titan.');
		}
		
		if(message.content.match('\\.list scenar')){

		}

		if(message.content.match('\\.roll')){
			const a = Math.floor(Math.random()*6)+1;
			const b = Math.floor(Math.random()*6)+1;
			const c = Math.floor(Math.random()*2);
			if(c==0){
				message.channel.send(':black_dice'+a + ': :white_dice' + b + ':');
			} else {
				message.channel.send(':white_dice'+a + ': :black_dice' + b + ':');
			}
		}
	} else {
		if(message.content.match(':.*dice\\d: :.*dice\\d:')){
			const dice = message.content.split(': :');
			if(dice[1][dice[1].length-2] === dice[0][dice[1].length-1]){
				message.channel.send('Vous avez fait un double !');
			}
		}
	}
});

// login to Discord with your app's token
const tokenFile = fs.readFileSync("./myToken.json");
client.login(JSON.parse(tokenFile).token).then(console.log('connected')).catch('an error has occured');