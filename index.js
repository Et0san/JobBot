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

// Liste des Scénarii
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
		ordre: 'Formé après la première rencontre des colons avec Vamakaskan, l’Ordre du Titan est une entreprise philanthropique financée par de riches colons anonymes. Formé uniquement de membres des colonies Damoises à son origine, l’Ordre a rapidement recruté des locaux pour	bénéficier de leurs savoirs, sans forcément toujours leur divulguer leur véritable but. Aujourd’hui, l’Ordre recrute les meilleurs. Mais aussi les pires, en proposant de racheter la vie des condamnés à mort, Hohù comme Damois'
	}
]

/**
 * Liste des phases de jeu
 * à utiliser comme suit:
 * 'Phase '+phases[<phase_index>]
 */
const phases = ['des Compagnons,', 'du Titan', 'du Monde', 'des Préparatifs', 'de l\'Affrontement'];

/**
 * Contient les parties en cours, objets json contenant :
 * 
 * name: nom de la partie,
 * players: [
 *     {
 *         name: nom de scénariste, le username discord (pour éviter les petits malins qui changeraient de pseudo pour récupérer la parole)
 *         perso: nom du personnage incarné
 *         center: boolean indiquant s'il est centre d'attention ou non,
 *         dead: boolean indiquant si le perso est mort ou non,
 *         discoursDone: boolean indiquant si le perso a déjà fait son Discours lors de cette Phase ou non
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
const currentGames = [

]

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
		}

		if(message.content.match(/\.start ?game/)){
			if(!gameStarting){
				gameStarting = true;
				// TODO
			} else {
				mySend(message.channel, 'Une autre partie est déjà en cours de création ; veuillez patienter.');
			}
		}

		if(message.content.match(/\.list ?games?/)){
			currentGames.forEach(game => {
				mySend(message.channel, '**Partie '+currentGames.indexOf(game)+1+'** :');
			});
		}

		if(message.content.match(/\.unpause ?game ? \d+/)){
			const index = parseInt(message.content.match(/\d+/)[0]);
			const game = currentGames[index-1];
			if(game){
				// TODO relancer la partie. Cela signifie redonner les rôles aux gens et changer le bool "paused" de la game.
			}
		}

		if(message.content.match(/\.game \d+/)){
			const index = parseInt(message.content.match(/\d+/)[0]);
			const game = currentGames[index-1];
			if(game){
				mySend(message.channel, '**Détail de la partie '+index+'** :');
				mySend(message.channel, '**Titan** :' + scenarii[game.scenario].titan);
				const players = game.players.map(player => player.name+' ,');
				mySend(message.channel, '**Scénaristes** :' + players.substring(0, players.length-3));
				mySend(message.channel, '**Phase courante** : Phase ' + phases[game.phase]);
				mySend(message.channel, '**Scénariste en Discours** :' + game.players.find(player => player.center).name);
				const motifs = '';
				game.motifs.forEach(motif => {
					motifs += '*Motif '+game.motifs.indexOf(motif)+'* :\n';
					motifs += 'Description : '+motif.desc+'\n';
					motifs += 'Échos : ';
					motif.echoes.forEach(echo => {
						motifs += 'Motif '+echo+', ';
					});
					motifs = motifs.substring(0,motifs.length-3)+'\n';
				});
				mySend(message.channel, '**Motifs** :\n' + motifs);
			}
		}

		if(message.content.match(/\.save ?game? \d+/)){
			const game = currentGames[parseInt(message.content.match(/\d+/))];
			if(game){
				mySend(message.channel, game);
			}
		}

		if(message.content.match(/\.help/)){
			mySend(message.author, 'Bonjour !');
			mySend(message.author, ':cateyes:');
			mySend(message.author, 'Voici la liste des commandes que j\'autorise sur le channel '+message.channel.name +' :');
			mySend(message.author, '`.help` : Affiche cette aide.');
			mySend(message.author, '`.scenarii list` : Affiche la liste des Scénarii disponibles.');
			mySend(message.author, '`.scenario <numero scenario>` : Affiche le détail du Scénario paramètre.');
			mySend(message.author, '`.roll` : Lance les Dés pour déterminer le Ton.');
			mySend(message.author, '`.give <user>` : Donne les Dés (ainsi que le Centre d\'Attention) à un Scénariste, lors d\'une partie de Face au Titan.');
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
