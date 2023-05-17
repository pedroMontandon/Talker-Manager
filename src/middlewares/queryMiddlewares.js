const verifyQueryRate = (req, res, next) => {
  const { rate } = req.query;

  if (!rate) {
    return next();
  }
  if (Number(rate) < 1 || Number(rate) > 5 || !Number.isInteger(Number(rate))) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  return next();
};

module.exports = { verifyQueryRate };