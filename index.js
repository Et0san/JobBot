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
	'Alchimiste',
	'Bijoutier',
	'Boucher',
	'Boulanger',
	'Bricoleur',
	'Bûcheron',
	'Chasseur',
	'Cordonnier',
	'Cordomage',
	'Costumage',
	'Forgeur dagues',
	'Forgeur épées',
	'Forgeur haches',
	'Forgeur marteaux',
	'Forgeur pelles',
	'Forgemage dagues',
	'Forgemage épées',
	'Forgemage haches',
	'Forgemage marteaux',
	'Forgemage pelles',
	'Joaillomage',
	'Mineur',
	'Paysan',
	'Pêcheur',
	'Poissonnier',
	'Sculpteur baguettes',
	'Sculpteur bâtons',
	'Tailleur'
]

let users = [];
const re = /!metiers ajout ([A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)*) (?<level>\d+)/;
client.on('message', message => {
	if(!message.author.bot){
		if(message.content.match(/!metiers liste/)){
			mySend(message.channel, 'Liste des métiers disponibles:');
			mySend(message.channel, joblist.reduce((k, l)=>k+'\n'+l));

		} else if(message.content.match(re)){
			let matcher = message.content.match(re);
			const { groups: { level } } = re.exec(message.content);
			const job = matcher[1];

			if(joblist.filter(a=>a==job).length==0){
				mySend(message.channel, job+' n\'est pas un métier');

			} else {
				if(users.length!=0){
					if(users.filter(a=>a.name==getDisplayName(message)).length==0){
						users.push({
							name: getDisplayName(message),
							jobs: []
						})
					}
				} else{
					users.push({
							name: getDisplayName(message),
							jobs: []
						})
				}
				if(users.filter(a=>a.name==getDisplayName(message) && a.jobs.filter(b=>b.name==job).length>0).length>0){
					if(users.filter(a=>a.jobs.filter(b=>b.level==level)).length!=0){
						mySend(message.channel, 'Vous avez déjà ce niveau pour le métier concerné!');
					} else {
						users[users.findIndex(a=>a.name==getDisplayName(message))].jobs[jobs.findIndex(b=>b.name==job)].level=level;
						let donnees = JSON.stringify(users)
					fs.writeFileSync('data.json', donnees)
					mySend(message.channel, 'Le métier '+job+' a été modifié pour le joueur '+getDisplayName(message)+' avec le niveau '+level);
					}
				} else {
					
					users[users.findIndex(a=>a.name==getDisplayName(message))].jobs.push({name: job, level: level});
					let donnees = JSON.stringify(users)
					fs.writeFileSync('data.json', donnees)
					mySend(message.channel, 'Le métier '+job+' a été ajouté pour le joueur '+getDisplayName(message)+' avec le niveau '+level);
				}
			}
			console.log(users);
		} else if(message.content.match(/!artisans ([A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)*)/)){
			let matcher = message.content.match(/!artisans ([A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)*)/);
			const job = matcher[1];

			if(joblist.filter(a=>a==job).length==0){
				mySend(message.channel, job+' n\'est pas un métier');

			} else {

				let users_jobs=[];
				users.forEach(user=>{
					const filterjob = user.jobs.filter(a=>a.name==job);
					if(filterjob.length>0){
						users_jobs.push(user.name+' niveau '+filterjob[0].level);
					}
				})
				if(users_jobs.length==0){
					mySend(message.channel, 'Personne ne possède ce métier');
				} else{
					mySend(message.channel, 'Les joueurs avec comme métier '+job+ ':');
					mySend(message.channel, users_jobs.reduce((k, l)=>k+', '+l));
				}
			}

		} else if(message.content.match(/!metiers .+/)){
			let matcher = message.content.match(/!metiers (.+)/);
			const pseudo = matcher[1];

			if(users.filter(a=>a.name==pseudo).length==0){
				mySend(message.channel, pseudo+' n\'a pas de métier');
			} else {
				mySend(message.channel, 'Liste des métiers de '+pseudo+':');
				mySend(message.channel, fancyjobs(users.filter(a=>a.name==pseudo)[0].jobs));
			}

		}

		if(message.content.match(/!aide/)){
			mySend(message.channel, '\`\`!aide\`\` renvoie la liste de commandes de ce bot'+'\n'
				+'\`\`!metiers liste\`\` renvoie la liste des différents métiers disponibles'+'\n'
				+'\`\`!metiers ajout <metier> <niveau>\`\` Ajoute à l\'auteur du message le métier et le niveau de ce dernier (s\'il n\'a pas déjà le métier au niveau indiqué)'+'\n'
				+'\`\`!metiers <pseudo>\`\` retourne la liste des métiers du joueur avec le pseudo <pseudo>'+'\n'
				+'\`\`!artisans <metier>\`\` retourne la liste des joueurs avec le métier <metier>');
		}
	}
});

function getDisplayName(message){
	return message.guild.member(message.author).displayName;
}

function fancyjobs(jobs){
	let fancyjobs='';

	jobs.forEach(job=>{
		fancyjobs+=job.name+' niveau '+job.level+'\n'
	});

	return fancyjobs;
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
client.login(JSON.parse(tokenFile).token).then(()=>{
		console.log('connected');
		users = JSON.parse(fs.readFileSync("data.json"));
	}).catch('an error has occured');
