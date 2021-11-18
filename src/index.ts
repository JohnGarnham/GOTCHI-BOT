import { ethers } from 'ethers';
import { TransactionResponse } from "@ethersproject/abstract-provider";

const fs = require('fs');                   // Loads the Filesystem library
const Discord = require('discord.js');      // Loads the discord API library
const Config = require('../config.json');    // Loads the configuration values

const client = new Discord.Client(); // Initiates the client
client.botConfig = Config; // Stores the config inside the client object so it's auto injected wherever we use the client
client.botConfig.rootDir = __dirname; // Stores the running directory in the config so we don't have to traverse up directories.
client.aliases = new Discord.Collection()

// Info for lookup
const pettingInverval = Config.interval;	// How often to pet the gotchis
const privateKey = Config.privateKey;
const contractAddress = Config.contractAddress; 
const abi = Config.abi;
const rpcEndpoint = Config.rpcEndpoint;		// RPC endpoint for ETH network

// List of aavegotchi ids to pet
export var gotchiList : string[]  = [
  "7988"
];

// Set up connection to ETH network
var provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);

// When provider is ready
provider.ready.then(() => {
	const contract = new ethers.Contract(contractAddress, abi, provider);
	const wallet = new ethers.Wallet(privateKey, provider);
	const contractWithSigner = contract.connect(wallet);

	const options = {
		gasLimit: 88000,
		gasPrice: ethers.utils.parseUnits("12.0", "gwei"),
	};

	contractWithSigner
		.interact(gotchiList, options)
		.then((tx: TransactionResponse) => {
			console.log(`tx sent: ${tx.hash}`);
			console.log("tx:", tx.hash);

			// The operation is NOT complete yet; we must wait until it is mined
			tx.wait()
				.then((receipt) => {
					console.log(`status: ${receipt.status}`);
				})
				.catch((e: any) => {
					console.error(e);
					throw new Error(e);
				});
		})
		.catch((e: any) => {
			console.error(e);
			throw new Error(e);
		});
});

// Starts the bot and makes it begin listening to events.
client.on('ready', () => {
    // Log successful login
    console.log("GOTCHI-PETTER Online as " + client.user.username + 
        " with prefix " + client.botConfig.prefix);
});

// Call update circuling supply every updateInterval ms
/*setInterval(async () => {
	await petTheGotchis();
}, updateInverval);*/

// Dynamically load commands from commands directory
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	// Grab command
	const command = require(`./commands/${file}`);
	const commandName = file.split(".")[0];
  console.log("Adding new command " + commandName + " from file \"" + file + "\"");
	client.commands.set(commandName, command);
	// Add aliases if there are any
	if (command.aliases) {
			console.log("Aliases found for " + command.name);
			command.aliases.forEach(alias => {
				console.log("Adding alias " + alias + " for " + command.name);
					client.aliases.set(alias, command);
			});
	};
}

// Dynamically run commands
client.on('message', message => {
	// Grab and watch for our prefix
	const prefix = client.botConfig.prefix;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	// Parse user input
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	var input : string = args.shift().toLowerCase().replace(/@/g, "_");
	// Check if it has this command
	if (!client.commands.has(input) && !client.aliases.has(input)) {
		// Command not found. Report an error and return
		console.error("Unknown command: " + input);
		message.channel.send('I do not know what ' + input + ' means.');
		return;
	} 
	// Grab command and execute it
	try {
		var command = client.commands.get(input) || client.aliases.get(input); 
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send('There was an error trying to execute ' + command.name);
	}
});

// Log the bot in using the token provided in the config file
client.login(client.botConfig.token)
.catch((err) => {
    console.log(`Failed to authenticate with Discord network: "${err.message}"`)
});