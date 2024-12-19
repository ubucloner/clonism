import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { schedulePosting } from './scheduler.js';
import { makeAPost } from './makeAPost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
dotenv.config({ path: `.env.local`, override: true })


const nodeEnv = process.env.NODE_ENV || 'development';

// Configuration CORS
const corsOptions = {
  origin: nodeEnv === 'development' ? 'http://localhost:5173' : false,
  optionsSuccessStatus: 200
};

// Middleware

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Nouveau endpoint pour l'upload d'image
const privateImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'privateImages';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uuid = uuidv4();
    cb(null, `${uuid}${path.extname(file.originalname)}`);
  }
});

const uploadPrivateImage = multer({ storage: privateImagesStorage });


app.post('/new-art-post', (req, res) => {
  let {modelVersion, artistPrompt} = req.body
  makeAPost(modelVersion, artistPrompt)
  res.json("done")
})

// Endpoint pour la prédiction
app.post('/predict', async (req, res) => {
  try {
    const { prompt, modelVersion, imagePath	 } = req.body;
    const generatedImages = await predict(modelVersion, prompt, imagePath	);
    res.json({ generatedImages });
  } catch (error) {
    console.error("Erreur lors de la prédiction:", error);
    res.status(500).json({ error: "Erreur lors de la prédiction" });
  }
});


app.post('/upload-private-image', uploadPrivateImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image n'a été uploadée" });
  }
  const uuid = req.file.filename;
  res.json({ uuid: uuid });
});

app.post('/schedule-artist', async (req, res) => {
 
    const { modelVersion, frequency, artistPrompt } = req.body;
    schedulePosting(modelVersion, frequency, artistPrompt);
    res.json("scheduled");
});



// Catch-all route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});