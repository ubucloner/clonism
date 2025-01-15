import fs from 'fs';
import https from 'https';
import path from 'path';
import crypto from 'crypto';


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

export function isTweetFromToday(tweet) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const tweetDate = new Date(tweet.timeParsed);

  return (tweetDate >= startOfDay && tweetDate < endOfDay);
};

export function getBestMentionToReply(mentions) {
  if (!mentions?.length)  return [];

  const mentionsWithScore = mentions?.map(mention => {
    const score = mention.retweets + mention.likes + mention.replies + mention.views;
    return { mention, score };
  });

  mentionsWithScore?.sort((a, b) => b.score - a.score);

  return mentionsWithScore[0]?.mention;
}

export function getRandomElements(arr, count) {
  return arr
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}