const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  return next();
};

const verifyName = (req, res, next) => {
    const { name } = req.body;
    if (!name) { 
      return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
        return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    return next();
};

const verifyAge = (req, res, next) => {
    const { age } = req.body;

    if (!age) { 
      return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (Number(age) < 18 || !Number.isInteger(age)) {
        return res.status(400)
        .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
    }
    return next();
};

const verifyTalk = (req, res, next) => {
  const { talk } = req.body;
  const dateFormat = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!talk) { 
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!talk.watchedAt) { 
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
    if (!dateFormat.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  
  return next();
};

const verifyRateNumber = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (Number(rate) < 1 || Number(rate) > 5) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  if (!Number.isInteger(rate)) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  return next();
};

const verifyRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate && rate !== 0) { 
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  return next();
};

module.exports = {
    verifyName,
    verifyAge,
    verifyTalk,
    verifyRate,
    verifyToken,
    verifyRateNumber,
};