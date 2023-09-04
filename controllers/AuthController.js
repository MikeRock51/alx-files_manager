import { atob } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import Utils from '../utils/Utils';

class AuthController {
  static async getConnect(request, response) {
    const { authorization } = request.headers;
    const decodedHeader = atob(authorization.split(' ')[1]);
    const [email, password] = decodedHeader.split(':');
    const user = await dbClient.fetchUserByEmail({ email });
    if (user) {
      const hashedPassword = Utils.hashPassword(password);
      if (hashedPassword === user.password) {
        const token = uuidv4();
        const key = `auth_${token}`;
        console.log(key);
        const reply = await redisClient.set(key, user._id, 86400);
        console.log(reply);
        response.status(200).json({ token }).end();
      } else {
        response.status(401).json({ error: 'Unauthorized' }).end();
      }
    } else {
      response.status(401).json({ error: 'Unauthorized' }).end();
    }
  }

  static async getDisconnect(request, response) {
    const token = request.headers['x-token'];
    const key = `auth_${token}`;
    const userID = await redisClient.get(key);
    if (!userID) {
      response.status(401).json({ error: 'Unauthorized' }).end();
    } else {
      const user = await dbClient.fetchUserByID(userID);

      if (!user) {
        response.status(401).json({ error: 'Unauthorized' }).end();
      } else {
        const reply = await redisClient.del(key);
        console.log(reply);
        response.status(204).json().end();
      }
    }
  }

  static async getMe(request, response) {
    const token = request.headers['x-token'];
    const key = `auth_${token}`;
    const userID = await redisClient.get(key);
    if (!userID) {
      response.status(401).json({ error: 'Unauthorized' }).end();
    } else {
      const user = await dbClient.fetchUserByID(userID);

      if (!user) {
        response.status(401).json({ error: 'Unauthorized' }).end();
      } else {
        response.status(200).json({
          id: user._id,
          email: user.email,
        }).end();
      }
    }
  }
}

export default AuthController;
