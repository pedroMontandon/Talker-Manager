const fs = require('fs').promises;

const readFile = async () => {
  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);
  return talkersTreated;
};

module.exports = readFile;