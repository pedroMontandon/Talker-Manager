const verifyPatchRateNumber = (req, res, next) => {
    const { rate } = req.body;
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
  
  const verifyPatchRate = (req, res, next) => {
    const { rate } = req.body;
    if (!rate && rate !== 0) { 
      return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
  
    return next();
  };

  module.exports = {
      verifyPatchRate,
      verifyPatchRateNumber,
  };