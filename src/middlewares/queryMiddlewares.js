const verifyQueryRate = (req, res, next) => {
  const { rate } = req.query;
  if (!rate) return next();
  if (Number(rate) < 1 || Number(rate) > 5 || !Number.isInteger(Number(rate))) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  return next();
};

const verifyQueryDate = (req, res, next) => {
  const { date } = req.query;
  if (!date) return next();
  if (!date.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i)) {
    return res.status(400)
    .json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
};

module.exports = { verifyQueryRate, verifyQueryDate };