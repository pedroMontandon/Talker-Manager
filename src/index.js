const express = require('express');
const fs = require('fs').promises;

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
  const talker = talkersTreated.find((talker) => talker.id === Number(id));

  if (!talker) {
    res.status(404).json({ "message": "Pessoa palestrante não encontrada" });
    return;
  }

  res.status(HTTP_OK_STATUS).json(talker);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
