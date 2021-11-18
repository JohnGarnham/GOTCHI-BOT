
import { gotchiList } from '../index';

module.exports = {
  name: 'remove',
  description: 'Remove gotchi from list',
  execute(message, args) {
    // Grab id from parameters
    let prefix = message.client.botConfig.prefix; 
    let gotchiID = "";
    // User passes in address
    if(args.length != 1) {
        message.channel.send("Usage: " + prefix + "remove <gotchiID>");
        return;
    } else {
        gotchiID = args[0];
    }
    // Remove id from gothchiList
    const idx = gotchiList.indexOf(gotchiID);
    if (idx == -1) {
      // Id not found. Alert user and return
      message.channel.send(gotchiID + " not found in gotchi list");
      return;
    } 
    // Remove from gotchiList
    gotchiList.splice(idx, 1);
    // Send msg to chat
    message.channel.send(gotchiID + " removed from gotchi list!");
  },
};