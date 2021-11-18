import { gotchiList } from '../index';

module.exports = {
  name: 'list',
  description: 'List gotchis currenty in list',
  execute(message, args) {
    for (var i = 0; i < gotchiList.length; i++) {
      message.channel.send("#" + i + " : " + gotchiList[i]);
    }
  },
};