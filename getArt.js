const getArt = (urlArr) => {
  const artArr = urlArr.reduce((acc, curr, ind) => {
    const art = curr.split('/').slice(4, 5);
    acc = [...acc, art[0]];
    return acc;
  }, []);

  return artArr;
};
module.exports = { getArt };
