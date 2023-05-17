const express = require('express');
const fs = require('fs').promises;

const generateToken = require('./helpers/generateToken');
const verifyEmail = require('./middlewares/verifyEmail');
const verifyPassword = require('./middlewares/verifyPassword');
const { verifyName, verifyAge, verifyTalk, verifyRate,
   verifyToken, verifyRateNumber } = require('./middlewares/verifyTalkerPost');
const readFile = require('./helpers/readFile');
const { postNewTalker } = require('./helpers/writeFile');
const { filteringQ, filteringRate } = require('./helpers/filtering');
const { verifyQueryRate } = require('./middlewares/queryMiddlewares');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// 8 funcionando perfeitamente
// app.get('/talker/search', verifyToken, async (req, res) => {
//   const { q } = req.query;
//   const talkers = await readFile();

//   const filteredTalkers = talkers.filter((talker) => talker
//     .name.includes(q));
//     return res.status(200).json(filteredTalkers);
// });

app.get('/talker/search', verifyToken, verifyQueryRate, async (req, res) => {
  const { q, rate } = req.query;
  const talkers = await readFile();

  const filteredQTalkers = filteringQ(q, talkers);
  const filteredRate = filteringRate(rate, filteredQTalkers);
  return res.status(200).json(filteredRate);
    // return res.status(200).json(filteredTalkers);
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
  const talkerFound = talkers.find((talker) => talker.id === Number(id));

  talkers.splice(talkers.indexOf(talkerFound), 1);
  fs.writeFile('./src/talker.json', JSON.stringify(talkers), 'utf-8');

  return res.status(204).end();
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
