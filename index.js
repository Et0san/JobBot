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
 * liste des carac alphanumériques, pour générer des ID facilement
 */
const aplhanum = 'azertyuiopmlkjhgfdsqwxcvbnAZERTYUIOPMLKJHGFDSQWXCVBN0123456789';

/** 
 * Liste des Scénarii
 */
const scenarii = [
	{
		titan: 'Vamakaskan',
		legende: 'Six jours avant la fin des temps, les pas de Vamakaskan seront ressentis.\nCinq jours avant la fin des temps, son brame retentira au loin.\nQuatre jours avant la fin des temps, les bêtes se laisseront choir au sol.\nTrois jours avant la fin des temps, le vent nous portera la puanteur de Vamakaskan.\nDeux jours avant la fin des temps, les murs trembleront et les édifices s’écrouleront.\nLe jour avant la fin des temps, nous verrons enfin apparaître Vamakaskan.',
		names: 'La Bête des Origines, La Piétineuse, La Mère du Troupeau, L’Indomptable, L’Impassible',
		desc: 'Une terre sauvage habitée par un peuple nomade, les Hohù. Le Titan vu comme la dernière des divinités, à craindre et respecter. Une nature à dompter, faite de grands espaces. Et puis des colons par milliers, venus d’un pays lointain, Dam. Un choc des cultures. Des conflits, des ententes. Les cultures qui se	mélangent. Et le Titan, craint par tous les peuples. Et qui n’a cure des colonies sédentaires sur son passage.',
		locations: 'La *passe d’Ohunti*, seul moyen de traverser la *chaîne des Grands Pics*, sauf à passer le désert écarlate.\nLe *volcan Krataho*, muet depuis des siècles et dont les terres alentour sont les plus fertiles du continent.\nLes *chutes d’eau d’Hitipa Ye* qui dominent même Vamakaskan et marquent la fin du grand plateau.\nLe *marais fongique* qu’ignore le Titan, où se sont réfugiées les communautés sorcières.\nLes *Grands Totems* sculptés à même le tronc des séquoias, représentant les héros mythologiques des Hohù.\n*Stell-Dam*, le cœur de la colonie Damoise et sa population sans cesse croissante.',
		factions: 'Les *Worachs*, reclus dans les Grands Pics et très territoriaux. On raconte que leurs ancêtres viennent aussi de l’autre côté de la grande mer.\nLa *Compagnie Damoise du Commerce*, qui entend bien avoir la mainmise sur les ressources locales et rétablir des voies vers d’autres pays.\nLes *Change-Peaux*, des êtres maudits qui se transforment en bêtes et se sont regroupés dans des coins reculés. Leur malédiction commence à toucher des colons.\nL’*Ordre des Éclaireurs* qui défriche les landes oubliées à la recherche de terres exploitables.\nLes Wakinyans, un groupe d’élite des communautés Hohù, seuls capables de maîtriser les fougueuses montures-tempêtes.\nLe *Culte de Hoeden*, des sorciers de toutes origines versés dans les secrets des champignons.',
		events: 'L’arrivée massive des colons Damois suite à une *catastrophe survenue au pays*, qu’aucun ne souhaite mentionner.\nUne tempête s’abattant sur les régions côtières et les noyant sous une *eau noire*.\nLe *grand craquement*, quand Krataho s’éveillera et crachera sa colère sur les terres avoisinantes\nLa *disparition de la colonie de Karnohe*, dont aucun habitant n\'a été retrouvé.\nLe troupeau des *tempêtes fantômes*, mené par la tempête infernale à la livrée d’ébène.\nLes *colonnes de feu* en provenance du désert écarlate, plongeant sur les landes proches.',
		tones: 'Paisible, Coriace, Sauvage',
		compagnons: '*Bernard Voeden*, descendant d’un des créateurs de l’Ordre.\n*Hilda Valuta*, braqueuse de banques et coupable de multiples meurtres.\n*Tikal*, change-peau convaincu du meurtre de sa propre famille.\n*Hetkya*, chasseuse de renom mise au ban de sa propre tribu.\n*Wakhan*, chaman exalté, extravagant et plus cultivé qu’il ne le laisse paraître.\n*Sœur Julia*, ayant intégré certaines coutumes Hohù à sa pratique religieuse.',
		ordre: 'Formé après la première rencontre des colons avec Vamakaskan, l’Ordre du Titan est une entreprise philanthropique financée par de riches colons anonymes. Formé uniquement de membres des colonies Damoises à son origine, l’Ordre a rapidement recruté des locaux pour	bénéficier de leurs savoirs, sans forcément toujours leur divulguer leur véritable but. Aujourd’hui, l’Ordre recrute les meilleurs. Mais aussi les pires, en proposant de racheter la vie des condamnés à mort, Hohù comme Damois',
		mysteres: 'Double 5 : Quel être de légende se réveillera quand Vamakaskan poussera trois brames le même jour ?\nDouble 6 : Quelle propriété extraordinaire les excréments de Vamakaskan procurent-ils à ceux qui s’en enduisent ?',
		menaces: 'Double 5 : Les Tankas, ces géants qui font paître leurs troupeaux dans le sillage de Vamakaskan.\n Double 6 : Begraf Plaats, le riche alchimiste qui attend que Vamakaskan le conduise au cimetière où reposent les ancêtres du Titan, dans l’espoir d’exploiter leurs ossements'
	}
]

/**
 * Liste des phases de jeu
 * à utiliser comme suit:
 * 'Phase '+phases[<phase_index>]
 */
const phases = ['des Compagnons,', 'du Titan', 'du Monde', 'des Préparatifs', 'de l\'Affrontement'];

/**
 * Liste des Permissions discord
 */
const perms = Discord.Permissions.FLAGS;

/**
 * Contient les parties en cours, objets json contenant :
 * 
 * name: nom de la partie,
 * players: [
 *     {
 *         name: nom de Scénariste, le username discord (pour éviter les petits malins qui changeraient de pseudo pour récupérer la parole),
 *         perso: nom du personnage incarné,
 *         center: boolean indiquant s'il est centre d'attention ou non,
 *         dead: boolean indiquant si le perso est mort ou non,
 *         discoursDone: boolean indiquant si le perso a déjà fait son Discours lors de cette Phase ou non,
 *         animateur: boolean indiquant si le Scénariste est Animateur
 *     },...
 * ],
 * scenario: numéro du scénario courant,
 * phase: index dans phases de la Phase de jeu en cours
 * motifs: [
 *     {
 *         desc: courte description,
 *         phase: Phase où il a été entendu,
 *         echoes: [] <- liste des indices des motifs auxquels celui-ci fait écho,
 *         approved: boolean qui indique si les Scénaristes ont approuvé ce motif
 *     },...
 * ],
 * doubleCount: entier indiquant le nombre de doubles tombés lors de cette partie,
 * ended: boolean indiquant si la partie est terminée,
 * paused: boolean indiquant si la partie est en pause
 */
let currentGames = [

];

// Permet de gérer la partie en cours de création (.setup game)
let gameInCreation = {};

let gameStarting = false;

client.on('message', message => {
	if(!message.author.bot){
		if(message.content.match(/\.me .+/)){
			if(Math.floor(Math.random()*2)==0){
				if(message.author.username === 'nullpo'){
					mySend(message.channel, '*Oui, Le Maître, c\'est toi ! Le seul et l\'unique !*');
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

			if(message.content.match(/\.save ?game? \d+/)){
				const game = currentGames[parseInt(message.content.match(/\d+/))];
				if(game){
					mySend(message.channel, game);
				}
			}
		}

		// if(message.content.match(/\.start ?game/)){
		// 	// TODO vérifier que la personne est MJ
		// 	if(!gameStarting){
				
		// 		// Création de partie
		// 		gameStarting = true;
		// 		mySend(message.channel, 'Création de partie commencée. Vous pouvez à tout moment faire `.setupcancel` pour arrêter cette séquence.\nLes autres commandes de AdHBot peuvent être indisponibles pendant la création.');

		// 		// Passage au choix du nom de la partie
		// 		mySend(message.channel, 'Saisissez le nom de la partie : `.setupname <nom>`, `.setupname` pour calculer un ID par défaut.');

		// 	} else {
		// 		mySend(message.channel, 'Une autre partie est déjà en cours de création ; veuillez patienter.');
		// 	}
		// }

		// if(message.content.match(/\.setup/)){
		// 	// TODO vérifier que la personne est MJ
		// 	if(gameStarting){
		// 		if(message.content.match(/\.setupcancel/)){
		// 			// Annulation de la création
		// 			gameStarting = false;
		// 			mySend(message.channel, 'Annulation de la création de la partie.');
		// 		} else if(message.content.match(/\.setupname/)) {
		// 			// Setup du nom
		// 			const matcher = message.content.match(/\.setupname .+/);
		// 			gameInCreation.name = '';
		// 			if(matcher) {
		// 				gameInCreation.name = matcher[0].substring(11);
		// 			} else {
		// 				for(let i=0;i<8;++i){
		// 					gameInCreation.name+=aplhanum[Math.floor(Math.random()*aplhanum.length)];
		// 				}
		// 				mySend(message.channel, 'Aucun nom sélectionné. Choix d\'un nom par défaut : ' + gameInCreation.name);
		// 			}
					
		// 			// Création du rôle pour les joueurs de la partie
		// 			message.guild.roles.create({
		// 				data: {
		// 					name: gameInCreation.name,
		// 					mentionable: true 
		// 				},
		// 				reason: 'Lancement d\'une partie de Face au Titan.'
		// 			});

		// 			// création du channel
		// 			message.guild.channels.create(gameInCreation.name,{
		// 				type: 'text',
		// 				topic: 'Partie de Face au Titan (id = '+gameInCreation.name+') en cours. Pas de hors-sujet !',
		// 				nsfw: false,
		// 				parent: message.guild.channels.cache.find(channel => channel.type === 'category' && channel.name === 'face au titan'),
		// 				permissionOverwrites: [{
		// 					id: message.guild.id,
		// 					allow: [perms.ADD_REACTIONS, perms.ATTACH_FILES, perms.READ_MESSAGE_HISTORY, perms.MENTION_EVERYONE, perms.USE_EXTERNAL_EMOJIS, perms.CONNECT, perms.EMBED_LINKS, perms.SEND_MESSAGES, perms.VIEW_CHANNEL],
		// 					deny: [perms.ADMINISTRATOR, perms.CHANGE_NICKNAME, perms.CREATE_INSTANT_INVITE, perms.KICK_MEMBERS, perms.BAN_MEMBERS, perms.MANAGE_CHANNELS, perms.MANAGE_GUILD, perms.MANAGE_EMOJIS, perms.MANAGE_WEBHOOKS, perms.MANAGE_ROLES, perms.MANAGE_NICKNAMES, perms.MUTE_MEMBERS, perms.DEAFEN_MEMBERS, perms.MOVE_MEMBERS, perms.STREAM, perms.PRIORITY_SPEAKER, perms.VIEW_AUDIT_LOG],
		// 					type: 'role'
		// 				},
		// 				{
		// 					id: message.guild.roles.cache.find(role => role.name === '@everyone'),
		// 					allow: [],
		// 					deny: [perms.ADMINISTRATOR, perms.CHANGE_NICKNAME, perms.CREATE_INSTANT_INVITE, perms.KICK_MEMBERS, perms.BAN_MEMBERS, perms.MANAGE_CHANNELS, perms.MANAGE_GUILD, perms.MANAGE_EMOJIS, perms.MANAGE_WEBHOOKS, perms.MANAGE_ROLES, perms.MANAGE_NICKNAMES, perms.MUTE_MEMBERS, perms.DEAFEN_MEMBERS, perms.MOVE_MEMBERS, perms.STREAM, perms.PRIORITY_SPEAKER, perms.VIEW_AUDIT_LOG, perms.ADD_REACTIONS, perms.ATTACH_FILES, perms.READ_MESSAGE_HISTORY, perms.MENTION_EVERYONE, perms.USE_EXTERNAL_EMOJIS, perms.CONNECT, perms.EMBED_LINKS, perms.SEND_MESSAGES, perms.VIEW_CHANNEL],
		// 					type: 'role'
		// 				}
		// 				],
		// 				position: '0',
		// 				reason: 'Lancement d\'une partie de Face au Titan.'
		// 			});

		// 			// Passage à la création des persos
		// 			gameInCreation.players = [];
		// 			mySend(message.channel, 'Entrez le nom des Scénaristes : `.setupplayers <pseudo>`, `.setupplayersstop` une fois qu\'ils sont tous inscrits.');

		// 		} else if(message.content.match(/\.setupplayers/)){
		// 			// Création des persos
		// 			const matcher = message.content.match(/\.setupplayers .+/);
		// 			if(message.content.match(/\.setupplayersstop/)){
		// 				// Passage à la sélection de l'Animateur
		// 				mySend(message.channel, 'Sélectionnez l\'Animateur : `.setupanim <pseudo>`, `.setupnoanim` pour ne pas mettre d\'Animateur');
		// 			} else if(matcher){
		// 				const playerName = matcher[0].substring(14);

		// 				// TODO debug ce bout de code
		// 				message.guild.members.cache.find(member => member.displayName === playerName).roles.add('face au titan', 'Lancement d\'une partie de Face au Titan');
		// 				message.guild.members.cache.find(member => member.displayName === playerName).roles.add(gameInCreation.name, 'Lancement d\'une partie de Face au Titan');

		// 				gameInCreation.players.push({
		// 					name: playerName,
		// 					perso: undefined,
		// 					center: false,
		// 					dead: false,
		// 					discoursDone: false,
		// 					animateur: false
		// 				});
		// 				mySend(message.channel, 'Entrez le nom du Scénariste suivant.');
		// 			}
		// 		} else if(message.content.match(/\.setup(no)?anim/)) {
		// 			// Sélection de l'Animateur
		// 			const matcher = message.content.match(/\.setupanim .+/);
		// 			if(matcher) {
		// 				const animateurName = matcher[0].substring(11);

		// 				// ??? attribuer le rôle Animateur au playerName ??? peut-être

		// 				gameInCreation.players.find(player => player.name === animateurName).animateur = true;
						
		// 				// Passage au choix du Scénario
		// 				mySend(message.channel, 'Entrez le numéro du Scénario de la partie : `.setupscenar <numero>`');
		// 			} else {

		// 				// Passage au choix du Scénario
		// 				mySend(message.channel, 'Aucun Animateur sélectionné. Passage à la suite.\nEntrez le numéro du Scénario de la partie : `.setupscenar <numero>`');
		// 			}
		// 		} else if(message.content.match(/\.setupscenar \d+/)){
		// 			// Choix du Scénario
		// 			const matcher = message.content.match(/\d+/);
		// 			const index = parseInt(matcher[0])-1;
		// 			const scenar = scenarii[index];
		// 			if(scenar){
		// 				mySend(message.channel, '**Scénario sélectionné** :');
		// 				mySend(message.channel, '**Nom du Titan** : ' + scenar.titan);
		// 				mySend(message.channel, '**Tons** : ' + scenar.tones);
		// 				mySend(message.channel, '**Autres noms** : ' + scenar.names);
		// 				mySend(message.channel, '**Légende** : ' + scenar.legende);

		// 				gameInCreation.scenario = index;

		// 				// Ajout de la partie à la liste des parties
		// 				currentGames.push(gameInCreation);
						
		// 				// Debug
		// 				console.log(gameInCreation);

		// 				// La partie n'est plus en création
		// 				gameInCreation = {};
		// 				gameStarting = false;
						
		// 				// C'est bon !
		// 				mySend(message.channel, 'La partie peut commencer !');
		// 			} else {
		// 				mySend(message.channel, 'Ce Scénario n\'existe pas.\nEntrez le numéro du Scénario de la partie : `.setupscenar <numero>`');
		// 			}
		// 		}
		// 	} else {
		// 		mySend(message.channel, 'Aucune création en cours. Utilisez `.start game` pour setup une partie.');
		// 	}			
		// }

		// if(message.content.match(/\.stop game \d+/)){
		// 	const index = parseInt(message.content.match(/\d+/)[0]);
		// 	const game = currentGames[index-1];
		// 	if(game){
		// 		// TODO stopper la partie. Cela signifie retirer les rôles des gens et changer le bool "ended" de la game.
		// 	}
		// }

		// if(message.content.match(/\.list ?games?/)){
		// 	if(!currentGames || currentGames.length == 0){
		// 		mySend(message.channel, 'Aucune partie n\'est enregistrée dans AdHBot !');
		// 	} else {
		// 		currentGames.forEach(game => {
		// 			mySend(message.channel, '**Partie '+currentGames.indexOf(game)+1+'** :');
		// 			mySend(message.channel, '**Titan** :' + scenarii[game.scenario].titan);
		// 			const players = game.players.map(player => player.name+' ,');
		// 			mySend(message.channel, '**Scénaristes** :' + players.substring(0, players.length-3));
		// 		});// TODO print state (fini, pause, en cours)
		// 	}
		// }

		// if(message.content.match(/\.unpause ?game ? \d+/)){
		// 	const index = parseInt(message.content.match(/\d+/)[0]);
		// 	const game = currentGames[index-1];
		// 	if(game){
		// 		// TODO relancer la partie. Cela signifie redonner les rôles aux gens et changer le bool "paused" de la game.
		// 	}
		// }

		// if(message.content.match(/\.game \d+/)){
		// 	const index = parseInt(message.content.match(/\d+/)[0]);
		// 	const game = currentGames[index-1];
		// 	if(game){
		// 		mySend(message.channel, '**Détail de la partie '+index+'** :');
		// 		mySend(message.channel, '**Titan** :' + scenarii[game.scenario].titan);
		// 		const players = game.players.map(player => player.name+' ,');
		// 		mySend(message.channel, '**Scénaristes** :' + players.substring(0, players.length-3));
		// 		mySend(message.channel, '**Phase courante** : Phase ' + phases[game.phase]);
		// 		mySend(message.channel, '**Scénariste en Discours** :' + game.players.find(player => player.center).name);
		// 		const motifs = '';
		// 		game.motifs.forEach(motif => {
		// 			motifs += '*Motif '+game.motifs.indexOf(motif)+'* :\n';
		// 			motifs += 'Description : '+motif.desc+'\n';
		// 			motifs += 'Échos : ';
		// 			motif.echoes.forEach(echo => {
		// 				motifs += 'Motif '+echo+', ';
		// 			});
		// 			motifs = motifs.substring(0,motifs.length-3)+'\n';
		// 		});
		// 		mySend(message.channel, '**Motifs** :\n' + motifs);
		// 	}
		// }

		if(message.content.match(/\.help/)){
			mySend(message.author, 'Bonjour !');
			mySend(message.author, ':cateyes:');
			mySend(message.author, 'Voici la liste des commandes que j\'autorise sur le channel '+message.channel.name +' :\n`.help` : Affiche cette aide.\n`.me` : Parle de soi-même à la troisième personne.');

			if(message.content.match(/.* .*titan.*/)){
				mySend(message.author, '`.scenarii list` : Affiche la liste des Scénarii disponibles.\n`.scenario <numero scenario>` : Affiche le détail du Scénario à l\'index en paramètre.\n`.roll` : Lance les Dés pour déterminer le Ton. Commande réservée au Centre d\'Attention.\n`.give <user>` : Donne les Dés (ainsi que le Centre d\'Attention) au Scénariste paramètre. Commande réservée au Centre d\'Attention.\n`.list games` : Affiche la liste des parties connues ainsi que leur état.\n`.game <numero>` : Affiche le détail de la partie à l\'index en paramètre.\n`.save game <numero>` : Retourne l\'objet JSON contenant la totalité de l\'état de la partie à l\'index en paramètre. Commande Admin.\n`.pause game <numero>` : Met en pause la partie à l\'index en paramètre. Commande MJ.\n`.unpause game <numero>` : Reprend la partie à l\'index en paramètre. Commande MJ.\n`.start game` : Lance la création d\'une partie. Toutes les commandes seront expliquées au fur et à mesure.');
			}
		}

		if(message.content.match(/\.scenario \d+/)){
			const matcher = message.content.match(/\d+/);
			const index = parseInt(matcher[0]);
			const scenar = scenarii[index-1];
			if(scenar){
				mySend(message.channel, '**Détail du Scénario '+index+'** :');
				mySend(message.channel, '**Nom du Titan** : ' + scenar.titan);
				mySend(message.channel, '**Tons** : ' + scenar.tones);
				mySend(message.channel, '**Autres noms** : ' + scenar.names);
				mySend(message.channel, '**Légende** : ' + scenar.legende);
				mySend(message.channel, '**Cadre** : ' + scenar.desc);
				mySend(message.channel, '**Ordre du Titan** : ' + scenar.ordre);
				mySend(message.channel, '**Lieux** : ' + scenar.locations);
				mySend(message.channel, '**Factions** : ' + scenar.factions);
				mySend(message.channel, '**Événements** : ' + scenar.events);
				mySend(message.channel, '**Compagnons** : ' + scenar.compagnons);
				mySend(message.channel, '**Mystères** : ' + scenar.mysteres);
				mySend(message.channel, '**Menaces** : ' + scenar.menaces);
			}
		} else if(message.content.match(/\.((scenari(i|os?))|(scenari(i|os?) ?list)|(list ?scenari(i|os?)))/)){
			mySend(message.channel, '**Liste des Scénarii** :');
			scenarii.forEach(scenar => {
					mySend(message.channel, '**Scénario '+(scenarii.indexOf(scenar)+1)+'** :');
					mySend(message.channel, '**Nom du Titan** : ' + scenar.titan);
					mySend(message.channel, '**Tons** : ' + scenar.tones);
					mySend(message.channel, '**Autres noms** : ' + scenar.names);
				}
			);
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
