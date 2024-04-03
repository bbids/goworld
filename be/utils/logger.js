const dev = (...params) => {
  if (process.env.NODE_ENV === 'development')
    console.log(...params);
};

const devError = (...params) => {
  if (process.env.NODE_ENV === 'development')
    console.error('ERR:', ...params);
};

module.exports = {
  devError, dev
};