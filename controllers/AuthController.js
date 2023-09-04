import { atob } from 'buffer';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(request, response) {
    const { authorization } = request.headers;
    const decodedHeader = atob(authorization.split(' ')[1]);
    const [email, password] = decodedHeader.split(':');

    const user = await dbClient.fetchUserByEmail({ email });
    if (!user) {
      response.status(401).send('Unauthorized');
    } else {
      console.log(user);
      response.status(200).send("done");
    }
  }
}

export default AuthController;
