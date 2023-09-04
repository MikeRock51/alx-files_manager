import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static postNew(request, response) {
    const { email, password } = request.body;
    const sha1 = crypto.createHash('sha1');

    if (!email) {
      response.status(400).send('Missing email');
    }
    if (!password) {
      response.status(400).send('Missing password');
    }
    if (dbClient.fetchUserByEmail(email)) {
      response.status(400).send('Already exists');
    }
    sha1.update(password);
    const hashedPassword = sha1.digest('hex');

    const userID = dbClient.createUser({
      email,
      password: hashedPassword,
    });

    response.status(200).send({ id: userID, email });
  }
}

export default UsersController;
