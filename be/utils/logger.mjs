const dev = (...params) => {
  if (process.env.NODE_ENV === 'development')
    console.log(...params);
};

const devError = (...params) => {
  if (process.env.NODE_ENV === 'development')
    console.error('ERR:', ...params);
};

export default {
  devError, dev
};