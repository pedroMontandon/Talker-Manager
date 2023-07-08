const express = require('express');
const fs = require('fs').promises;
const connection = require('./db/connection');
const generateToken = require('./helpers/generateToken');
const verifyEmail = require('./middlewares/verifyEmail');
const verifyPassword = require('./middlewares/verifyPassword');
const { verifyName, verifyAge, verifyTalk, verifyRate,
   verifyToken, verifyRateNumber } = require('./middlewares/verifyTalkerPost');
const readFile = require('./helpers/readFile');
const { postNewTalker } = require('./helpers/writeFile');
const { filteringQ, filteringRate, filteringDate } = require('./helpers/filtering');
const { verifyQueryRate, verifyQueryDate } = require('./middlewares/queryMiddlewares');
const { verifyPatchRate, verifyPatchRateNumber } = require('./middlewares/patchMiddlewares');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/talker/search', verifyToken, verifyQueryRate, verifyQueryDate, async (req, res) => {
  const { q, rate, date } = req.query;
  const talkers = await readFile();
  const filteredQTalkers = filteringQ(q, talkers);
  const filteredRate = filteringRate(rate, filteredQTalkers);
  const filteredDate = filteringDate(date, filteredRate);
  return res.status(200).json(filteredDate);
});

app.get('/talker/db', async (req, res) => {
  const [result] = await connection.execute('SELECT * FROM talkers');
  const treatedResult = result.reduce((acc, curr) => {
    acc.push({
      id: curr.id,
      name: curr.name,
      age: curr.age,
      talk: {
        rate: curr.talk_rate,
        watchedAt: curr.talk_watched_at,
      },
    });
    return acc;
  }, []);
  return res.status(200).json(treatedResult);
});

app.get('/talker', async (req, res) => {
  const talkers = await readFile();
  res.status(HTTP_OK_STATUS).json([...talkers]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talkers = await readFile();
  const talker = talkers.find((talkerT) => talkerT.id === Number(id));

  if (!talker) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    return;
  }

  res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/talker', verifyToken, verifyName, verifyAge,
 verifyTalk, verifyRate, verifyRateNumber, async (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = await readFile();
  const id = (talkers.at(-1).id + 1);
  const talker = {
    name, id, age, talk,
  };

  postNewTalker(talkers, talker);

  return res.status(201).json(talker);
});

app.put('/talker/:id', verifyToken, verifyName, verifyAge, verifyTalk,
 verifyRate, verifyRateNumber, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await readFile();
  const editedTalker = { id: Number(id), name, age, talk };
  const talkerFound = talkers.find((talker) => talker.id === Number(id));
  if (!talkerFound) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const editedTalkers = talkers.reduce((acc, curr) => {
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
  const talkers = await readFile();

  const filteredTalkers = talkers.filter((talker) => talker.id !== Number(id));
  fs.writeFile('./src/talker.json', JSON.stringify(filteredTalkers), 'utf-8');

  return res.status(204).end();
});

app.patch('/talker/rate/:id', verifyToken, verifyPatchRate,
  verifyPatchRateNumber, async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;
    const talkers = await readFile();

    const talkerFound = talkers.find((talker) => talker.id === Number(id));
    talkerFound.talk.rate = rate;
    fs.writeFile('./src/talker.json', JSON.stringify(talkers), 'utf-8');

    res.status(204).end();
});

app.post('/login', verifyEmail, verifyPassword, async (req, res) => {
  const token = generateToken(8);
  res.status(HTTP_OK_STATUS).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
