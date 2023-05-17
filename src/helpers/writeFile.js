const fs = require('fs').promises;

const postNewTalker = (talkers, talker) => {
    fs.writeFile('./src/talker.json', JSON.stringify([...talkers, talker]), 'utf-8');
};

module.exports = {
    postNewTalker,
};

  // const editedTalkers = talkers.reduce((acc, curr) => {
  //   if (curr.id === Number(id)) {
  //     acc.push(editedTalker);
  //   } else {
  //     acc.push(curr);
  //   }
  //   return acc;
  // }, []);

  // const editedTalkers = talkers.map((talker) => talker.id === Number(id) ? editedTalker : talker);