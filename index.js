/**
 * Discord.js module
 */
const { match } = require('assert');
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
	'Boulanger',
	'Bijoutier'
]

const users = [
	{ 
		name: 'Test Cheh',
		jobs: [{name: 'Paysan', level: 100}]
	}
]

client.on('message', message => {
	if(!message.author.bot){
		if(message.content.match(/!jobs list/)){
			mySend(message.channel, 'List of existing jobs:');
			mySend(message.channel, joblist.reduce((k, l)=>k+'\n'+l));

		} else if(message.content.match(/!job add \w+ \d+/)){
			let matcher = message.content.match(/!job add (\w+) (\d+)/);
			const job = matcher[1];
			const level = matcher[2];

			if(joblist.filter(a=>a==job).length==0){
				mySend(message.channel, job+' is not a job');

			} else {

				if(users.filter(a=>a.name==getDisplayName(message) && a.jobs.filter(b=>b.name==job).length>0).length>0){
					if(users.filter(a=>a.jobs.filter(b=>b.level==level)).length!=0){
						mySend(message.channel, 'You already have this job with the same level!');
					} else {
						users[users.findIndex(a=>a.name==getDisplayName(message))].jobs[jobs.findIndex(b=>b.name==job)].level=level;
					}
				} else {
					if(users.filter(a=>a.name==getDisplayName(message)).length==0){
						
						users.push({
							name: getDisplayName(message),
							jobs: []
						})
					}
					users[users.findIndex(a=>a.name==getDisplayName(message))].jobs.push({name: job, level: level});
					mySend(message.channel, 'Job '+job+' added to '+getDisplayName(message)+' with level '+level);
				}
			}

		} else if(message.content.match(/!jobs whois .+/)){
			let matcher = message.content.match(/!jobs whois (.+)/);
			const job = matcher[1];

			if(joblist.filter(a=>a==job).length==0){
				mySend(message.channel, job+' is not a job');

			} else {
				mySend(message.channel, 'Who is '+job+ ':');

				let users_jobs=[];
				users.forEach(user=>{
					const filterjob = user.jobs.filter(a=>a.name==job);
					if(filterjob.length>0){
						users_jobs.push(user.name+' level '+filterjob[0].level);
					}
				})

				mySend(message.channel, users_jobs.reduce((k, l)=>k+', '+l));
			}

		} else if(message.content.match(/!jobs .+/)){
			let matcher = message.content.match(/!jobs (.+)/);
			const pseudo = matcher[1];

			if(users.filter(a=>a.name==pseudo).length==0){
				mySend(message.channel, pseudo+' has no jobs');
			} else {
				mySend(message.channel, 'List of '+pseudo+'\'s jobs:');
				mySend(message.channel, fancyJobs(users.filter(a=>a.name==pseudo)[0].jobs));
			}

		}

		if(message.content.match(/!help/)){
			mySend(message.channel, '\`\`!help\`\` renvoie la liste de commandes de ce bot'+'\n'
				+'\`\`!jobs list\`\` renvoie la liste des différents métiers disponibles'+'\n'
				+'\`\`!job add <job> <nombre>\`\` Ajoute à l\'auteur du message le métier et le niveau de ce dernier s\'il n\'a pas déjà le métier au niveau indiqué'+'\n'
				+'\`\`!jobs <pseudo>\`\` retourne la liste des métiers du joueur avec le pseudo <pseudo>');
		}
	}
});

function getDisplayName(message){
	return message.guild.member(message.author).displayName;
}

function fancyJobs(jobs){
	let fancyJobs='';

	jobs.forEach(job=>{
		fancyJobs+=job.name+' level '+job.level+'\n'
	});

	return fancyJobs;
}

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
