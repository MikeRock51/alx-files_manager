import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    const userID = await redisClient.get(`auth_${token}`);
    const user = await dbClient.fetchUserByID(userID);
    if (!user) {
      response.status(401).json({ error: 'Unauthorized' }).end();
    } else {
      const supportedTypes = ['folder', 'file', 'image'];
      const fileInfo = request.body;

      if (!('name' in fileInfo)) {
        return response.status(400).json({ error: 'Missing name' }).end();
      }
      if (!('type' in fileInfo)) {
        return response.status(400).json({ error: 'Missing type' }).end();
      }
      if (!('data' in fileInfo) && fileInfo.type !== 'folder') {
        return response.status(400).json({ error: 'Missing data' });
      }
      if (fileInfo.parentId) {
        const file = await dbClient.fetchFileByParentID(fileInfo.parentId);
        if (!file) {
          return response.status(400).json({ error: 'Parent not found' });
        }
        if (!fileInfo.type !== 'folder') {
          return response.status(400).json({ error: 'Parent is not a folder' });
        }
      }
      if (fileInfo.type === 'folder') {
        fileInfo.userId = userID;
        const newFile = await dbClient.createFile(fileInfo);
        return response.status(201).json(newFile);
      }
      const fileName = uuidv4();
      const fileData = {
        name: fileInfo.name,
        type: fileInfo.type,
        parentId: fileInfo.parentId || 0,
        isPublic: fileInfo.isPublic || false,
        data: fileInfo.data,
        userId: userID,
        localPath: process.env.FOLDER_PATH || '/tmp/files_manager',
      };
    }
  }
}

export default FilesController;
