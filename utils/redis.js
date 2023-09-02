import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor () {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(error);
    });
  }

  isAlive () {
    return this.client.connected;
  }

  async get (key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    return asyncGet(key);
  }

  async set (key, value, duration) {
    const setExp = promisify(this.client.setex).bind(this.client);
    return setExp(key, duration, value);
  }

  async del (key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    return asyncDel(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
