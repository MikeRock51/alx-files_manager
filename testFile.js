import fs from 'fs';

// console.log(__dirname);

const filePath = '/home/mike_rock/Desktop/MikeHey';

fs.mkdirSync(filePath, { recursive: true });
fs.writeFileSync(`${filePath}/MikeHey.txt`, 'Hey Mike Hey!!!');
console.log('Mission accomplished');
