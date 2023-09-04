import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    const userID = await redisClient.get(`auth_${token}`);
    if (!userID) response.status(400).json({ error: 'Unauthorized' }).end();
    const user = await dbClient.fetchUserByID(userID);
    if (!user) response.status(400).json({ error: 'Unauthorized' }).end();
    
  }
}
