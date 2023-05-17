const express = require('express');
const fs = require('fs').promises;

const generateToken = require('./helpers/generateToken');
const verifyEmail = require('./middlewares/verifyEmail');
const verifyPassword = require('./middlewares/verifyPassword');
const { verifyName, verifyAge, verifyTalk, verifyRate, verifyToken, verifyRateNumber } = require('./middlewares/verifyTalkerPost');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/talker', async (req, res) => {
  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);
  res.status(HTTP_OK_STATUS).json([...talkersTreated]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);
  const talker = talkersTreated.find((talkerT) => talkerT.id === Number(id));

  if (!talker) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    return;
  }

  res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/talker', verifyToken, verifyName, verifyAge, verifyTalk, verifyRate, verifyRateNumber, async (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);

  const id = (talkersTreated.at(-1).id + 1);

  fs.writeFile('./src/talker.json', JSON.stringify([ ...talkersTreated, {
    name, id, age, talk: { watchedAt: talk.watchedAt, rate: talk.rate }
  }]), 'utf-8')

  return res.status(201).json({
    id,
    name,
    age,
    talk: {
      watchedAt: talk.watchedAt,
      rate: talk.rate
    }
  })
})

app.put('/talker/:id', verifyToken, verifyName, verifyAge, verifyTalk, verifyRate, verifyRateNumber, async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);

  const editedTalker = {
    id: Number(id),
    name: req.body.name,
    age: req.body.age,
    talk: {
      watchedAt: req.body.talk.watchedAt,
      rate: req.body.talk.rate
    }
  };

  const talkerFound = talkersTreated.find((talker) => talker.id === Number(id));

  if (!talkerFound) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  const editedTalkers = talkersTreated.reduce((acc, curr) => {
    if (curr.id === Number(id)) {
      acc.push(editedTalker);
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  fs.writeFile('./src/talker.json', JSON.stringify(editedTalkers), 'utf-8');

  return res.status(HTTP_OK_STATUS).json(editedTalker);
});

app.delete('/talker/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);
  const talkerFound = talkersTreated.find((talker) => talker.id === Number(id));

  talkersTreated.splice(talkersTreated.indexOf(talkerFound), 1);
  fs.writeFile('./src/talker.json', JSON.stringify(talkersTreated), 'utf-8');

  return res.status(204).end();
})

app.post('/login', verifyEmail, verifyPassword, async (req, res) => {
  const token = generateToken(8);

  res.status(HTTP_OK_STATUS).json({ token,  });

});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
