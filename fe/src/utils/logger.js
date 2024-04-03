const dev = (...params) => {
  if (import.meta.env.MODE === 'development')
    console.log(...params);
};

const devError = (...params) => {
  if (import.meta.env.MODE === 'development')
    console.error(...params);
};


// todo
//const mutationEventLog = [];

// eslint-disable-next-line no-unused-vars
const devMutation = (type, wsData) => {
  if (import.meta.env.MODE === 'development'
    && __MUTATION__) {
    // console.log(wsData.mutation);

    console.log('mutation: ', type);
    // console.log(mutationEventLog);
  }
};

export default {
  dev, devError, devMutation
};