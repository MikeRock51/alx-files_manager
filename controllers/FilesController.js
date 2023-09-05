import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { atob } from 'buffer';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    const userID = await redisClient.get(`auth_${token}`);
    const user = await dbClient.fetchUserByID(userID);
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' }).end();
    }
    const supportedTypes = ['folder', 'file', 'image'];
    const fileInfo = request.body;

    if (!('name' in fileInfo)) {
      return response.status(400).json({ error: 'Missing name' }).end();
    }
    if (!('type' in fileInfo) || !supportedTypes.includes(fileInfo.type)) {
      return response.status(400).json({ error: 'Missing type' }).end();
    }
    if (!('data' in fileInfo) && fileInfo.type !== 'folder') {
      return response.status(400).json({ error: 'Missing data' });
    }
    if (fileInfo.parentId && fileInfo.parentId !== 0) {
      const file = await dbClient.fetchFileByParentID(fileInfo.parentId);
      if (!file) {
        return response.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return response.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    let fileData = {
      name: fileInfo.name,
      type: fileInfo.type,
      parentId: fileInfo.parentId && fileInfo.parentId !== 0 ? new ObjectId(fileInfo.parentId) : 0,
      isPublic: fileInfo.isPublic || false,
      userId: new ObjectId(userID),
    };
    if (fileInfo.type === 'folder') {
      const newFileID = await dbClient.createFile(fileData);
      return response.status(201).json({
        id: newFileID.toString(),
        userId: userID,
        name: fileData.name,
        type: fileData.type,
        isPublic: fileData.isPublic,
        parentId: fileData.parentId,
      });
    }
    const fileName = uuidv4();
    const filePath = process.env.FOLDER_PATH || '/tmp/files_manager/';
    fileData = {
      ...fileData,
      localPath: `${filePath}/${fileName}`,
    };

    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(fileData.localPath, atob(fileInfo.data));

    const fileID = await dbClient.createFile(fileData);

    return response.status(201).json({
      id: fileID.toString(),
      userId: userID,
      name: fileData.name,
      type: fileData.type,
      isPublic: fileData.isPublic,
      parentId: fileData.parentId,
    });
  }
}

export default FilesController;
