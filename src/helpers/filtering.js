const filteringQ = (q, talkers) => {
  if (!q) return talkers;
  const filteredTalkers = talkers.filter((talker) => talker
  .name.includes(q));
  return filteredTalkers;
};

const filteringRate = (rate, filteredQTalkers) => {
  if (!rate) return filteredQTalkers;
  const filteredTalkers = filteredQTalkers
    .filter((talker) => Number(talker.talk.rate) === Number(rate));
  return filteredTalkers;
};

module.exports = {
    filteringQ,
    filteringRate,
};