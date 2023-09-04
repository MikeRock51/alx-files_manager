import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    const sha1 = crypto.createHash('sha1');

    if (!email) {
      response.status(400).json({ error: 'Missing email' }).end();
    } else if (!password) {
      response.status(400).json({ error: 'Missing password' }).end();
    } else if (await dbClient.fetchUserByEmail({ email }) !== null) {
      response.status(400).json({ error: 'Already exist' }).end();
    } else {
      sha1.update(password);
      const hashedPassword = sha1.digest('hex');

      const userID = await dbClient.createUser({
        email,
        password: hashedPassword,
      });

      response.status(201).json({ id: userID, email }).end();
    }
  }
}

export default UsersController;
