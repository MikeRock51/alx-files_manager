import Utils from '../utils/Utils';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      response.status(400).json({ error: 'Missing email' }).end();
    } else if (!password) {
      response.status(400).json({ error: 'Missing password' }).end();
    } else if (await dbClient.fetchUserByEmail({ email }) !== null) {
      response.status(400).json({ error: 'Already exist' }).end();
    } else {
      const hashedPassword = Utils.hashPassword(password);
      const userID = await dbClient.createUser({
        email,
        password: hashedPassword,
      });

      response.status(201).json({ id: userID, email }).end();
    }
  }
}

export default UsersController;
