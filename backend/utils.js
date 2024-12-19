import fs from 'fs';
import https from 'https';
import path from 'path';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function downloadImage(imageUrl) {
    const uuid = crypto.randomUUID();
    const fileName = `${uuid}.png`;
    const varDir = path.join(__dirname, '..', 'var');
    
    // Create var directory if it doesn't exist
    if (!fs.existsSync(varDir)) {
      fs.mkdirSync(varDir, { recursive: true });
    }
    
    const localFilePath = path.join(varDir, fileName);
  
    await new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        const fileStream = fs.createWriteStream(localFilePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(localFilePath); // Nettoyer en cas d'erreur
          reject(err);
        });
      });
    });
  
    return localFilePath;
  }