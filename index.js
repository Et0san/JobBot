/**
 * Discord.js module
 */
const Discord = require('discord.js');

/**
 * Gestionnaire de fichiers
 */
const fs = require("fs");

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});


/**
 * Liste des Permissions discord
 */
const perms = Discord.Permissions.FLAGS;

const joblist = [
	'Paysan',
	'b',
	'v'
]

const users = [
	{ name: 'Test Cheh',
		jobs: [{name: Paysan, level: 100}]}
]

client.on('message', message => {
	if(!message.author.bot){
		if(message.content.match(/!job list/)){
				mySend(message.channel, 'List of existing jobs:');
				mySend(message.channel, joblist.map(_+'\n'));
		}

		if(message.content.match(/!job add \w+ \d+/)){
			let matcher = str.match(/!job add (\w+) (\d+)/g);
			const job = matcher[1];
			const level = matcher[2];

			//TODO ajouter un cas d'erreur si le job n'existe pas

			if(users.filter(_.name==message.author.username && _.jobs.filter(_.name==job)).length!=0){
				if(users.filter(_.jobs.filter(_.level==level)).length!=0){
					mySend(message.channel, 'You already have this job with the same level!');
				} else {
					users[users.findIndex(_.name==message.author.username)].jobs[jobs.findIndex(_.name==job)].level=level;
				}
			} else {
				if(users.filter(_.name==message.author.username).length!=0){
					users.push({
						name: message.author.username,
						jobs: []
					})
				}
				users[users.findIndex(_.name==message.author.username)].jobs.push({name: job, level: level});
			}

			mySend(message.channel, 'Job '+job+' added to '+message.author.username+' with level '+level);
		}

		if(message.content.match(/!jobs .+/)){
			let matcher = str.match(/!jobs (.+)/g);
			const pseudo = matcher[1];

			//TODO ajouter un cas d'erreur si le pseudo n'existe pas

			mySend(message.channel, 'List of '+pseudo+'\'s jobs:');
			mySend(message.channel, users.filter(_.name==pseudo)[0].jobs);
		}

		if(message.content.match(/!jobs whois .+/)){
			let matcher = str.match(/!jobs whois (.+)/g);
			const job = matcher[1];

			//TODO ajouter un cas d'erreur si le job n'existe pas

			mySend(message.channel, 'Who is '+job+ ' :');
			mySend(message.channel, users.filter(_.jobs.filter(_.name=job)).map(_+'\n'));
		}

		if(message.content.match(/!help/)){

		}
	}
});

function mySend(dest, message) {
	dest.send(parseEmotes(message));
}

function parseEmotes(str) {
	let matched = [];
	let outString = str;
	let matcher = str.match(/:[+_A-Za-z0-9]+:/g);
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
