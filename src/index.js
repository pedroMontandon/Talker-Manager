const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/talker', async (req,  res) => {
  const talkers = await fs.readFile('./src/talker.json');
  const talkersTreated = JSON.parse(talkers);
  res.status(HTTP_OK_STATUS).json([...talkersTreated]);
})


// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
