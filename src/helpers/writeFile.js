const fs = require('fs').promises;

const postNewTalker = (talkers, talker) => {
    fs.writeFile('./src/talker.json', JSON.stringify([...talkers, talker]), 'utf-8');
};

module.exports = {
    postNewTalker,
};
