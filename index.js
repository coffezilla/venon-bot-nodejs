const fs = require('fs');
// const venom = require('venom-bot');

const loggedOnes = [];

const express = require('express');
const venom = require('venom-bot');
const app = express();

const currentWA = 'wp1';
const currentWA2 = 'wp2';

const textThread = [
	'Pergunta A: escolha 1 ou 2 \n você precisa escolher um número',
	'Pergunta B: escolha 1 ou 2 \n você precisa escolher um número',
	'Pergunta C: escolha 1 ou 2 \n você precisa escolher um número',
	'Pergunta D: escolha 1 ou 2 \n você precisa escolher um número',
	'Agradecemos o contato!',
];

venom
	.create({
		session: currentWA, // name of session
		catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
			var matches = base64Qr.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/),
				response = {};
			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}
			response.type = matches[1];
			response.data = new Buffer.from(matches[2], 'base64');
			var imageBuffer = response;
			require('fs').writeFile(
				`./public/${currentWA}.png`,
				imageBuffer['data'],
				'binary',
				function (err) {
					if (err != null) {
						console.log(err);
					}
				}
			);
		},
		multidevice: true, // for version not multidevice use false.(default: true)
	})
	.then((client) => {
		start(client);
		console.log('feito');
		loggedOnes.push(currentWA);
	})
	.catch((erro) => {
		console.log(erro);
	});

venom
	.create({
		session: currentWA2, // name of session
		catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
			var matches = base64Qr.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/),
				response = {};
			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}
			response.type = matches[1];
			response.data = new Buffer.from(matches[2], 'base64');
			var imageBuffer = response;
			require('fs').writeFile(
				`./public/${currentWA2}.png`,
				imageBuffer['data'],
				'binary',
				function (err) {
					if (err != null) {
						console.log(err);
					}
				}
			);
		},
		multidevice: true, // for version not multidevice use false.(default: true)
	})
	.then((client) => {
		start(client);
		console.log('feito');
		loggedOnes.push(currentWA2);
	})
	.catch((erro) => {
		console.log(erro);
	});

// start wp
function start(client) {
	console.log('LOGADO');
	let currentMessage = 0;

	client.onMessage((message) => {
		if (message.body === 'Hi' && message.isGroupMsg === false) {
			client
				.sendText(message.from, textThread[currentMessage])
				.then((result) => {
					console.log('Result: ', result); //return object success
					currentMessage = currentMessage + 1;
				})
				.catch((erro) => {
					console.error('Error when sending: ', erro); //return object error
				});
		}

		if (currentMessage > 0 && message.isGroupMsg === false) {
			if ('1'.includes(message.body) || '2'.includes(message.body)) {
				client
					.sendText(message.from, textThread[currentMessage])
					.then((result) => {
						// console.log('Result: ', result); //return object success
						currentMessage = currentMessage + 1;
					})
					.catch((erro) => {
						console.error('Error when sending: ', erro); //return object error
					});
			} else {
				console.log('valor incorreto da pergunta');
				client
					.sendText(message.from, textThread[currentMessage - 1])
					.then((result) => {
						// console.log('Result: ', result); //return object success
					})
					.catch((erro) => {
						console.error('Error when sending: ', erro); //return object error
					});
			}
		}
	});

	client.onStateChange((state) => {
		console.log('State changed: ', state);
		// force whatsapp take over
		if ('CONFLICT'.includes(state)) client.useHere();
		// detect disconnect on whatsapp
		if ('UNPAIRED'.includes(state)) console.log('logout');
		// disconected
		// if ('DISCONNECTED'.includes(state)) client.close();
		// if ('SYNCING'.includes(state)) client.close();
		// if ('OPENING'.includes(state)) {
		//   // remove the token
		//   token_path = `tokens/${session_name}.data.json`
		//   console.log('unlinking ', token_path)
		//   fs.unlink(`tokens/${session_name}.data.json`, (err => console.log(err)))
		//   console.log('REOPENING');
		//   // reinitiate venom
		//   client.close();
		//   init_venom(session_name, hook, handle_function);
		//   //client.restartService();
		// }
	});
}
