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
        const reply = await redisClient.set(key, token, 86400);
        console.log(reply);
        response.status(200).json({ token });
      }
    } else {
      response.status(401).send('Unauthorized');
    }
  }
}

export default AuthController;
