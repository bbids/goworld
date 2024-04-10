import server from './server.mjs';
import config from './utils/config.mjs';

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});