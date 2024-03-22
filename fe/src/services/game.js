const baseUrl = '/play';

const get = () => {
  return fetch(baseUrl)
    .then(response => {
      if (!response.ok)
        throw new Error('???', response);

      return response.json();
    })
    .then(data => data)
    .catch(error => {
      console.log(error);
    });
};

const createGame = () => {
  return fetch(`${baseUrl}/create_game`)
    .then(response => {
      if (!response.ok)
        throw new Error('*???');
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export default {
  get, createGame
};