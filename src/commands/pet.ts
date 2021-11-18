import { getLogger } from '../logger';
import { gotchiList } from '../index';

const logger = getLogger();

const Config = require('../../config.json');    // Loads the configuration values

module.exports = {
	name: 'pet',
    aliases: ["p"],
	description: 'Pet all the gotchis',
	execute(message, args) {    
        let prefix = message.client.botConfig.prefix; 
        let address = "";
        console.log(`now petting: ${gotchiList.join(",")}`);
        // Pet all the gotchis
	},
};

function petTheGotchis() {


}
