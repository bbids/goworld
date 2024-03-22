const dev = (...params) => {
  if (import.meta.env.MODE === 'development')
    console.log(...params);
};

const devError = (...params) => {
  if (import.meta.env.MODE === 'development')
    console.error(...params);
};

export default {
  dev, devError
};