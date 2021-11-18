
import { gotchiList } from '../index';

module.exports = {
  name: 'add',
  description: 'Add gotchi to list',
  execute(message, args) {
    // Grab id from parameters
    let prefix = message.client.botConfig.prefix; 
    let gotchiID = "";
    // User passes in address
    if(args.length != 1) {
        message.channel.send("Usage: " + prefix + "add <gotchiID>");
        return;
    } else {
        gotchiID = args[0];
    }
    // Add id to gothchiList
    gotchiList.push(gotchiID);
    // Send msg to chat
    message.channel.send(gotchiID + " added to gotchi list!");
  },
};