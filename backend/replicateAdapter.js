import Replicate from "replicate";

import fs from "node:fs/promises";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});


/**
 * return image urls (hosted on replicate)
 */
export async function predictWithModel(modelVersion, prompt, imageFilePath){

  let payload = {
    input: {
      prompt: prompt,
      lora_scale: 0.9,
      extra_lora_scale:0.9
    },
  }
  
  if (typeof imageFilePath !== "undefined"){
    payload['input']['image'] = await fs.readFile(imageFilePath)
  }

  const imageUrls = await replicate.run(
    modelVersion, 
    payload
  )

  return imageUrls
}


export async function fineTuneModel(ownerName, modelName, imageZipPath){

  let model =  await replicate.models.create(
    ownerName,
    modelName,
    {
      visibility: "private", 
      hardware:"gpu-t4"
    },
  )

  let destination = `${model.owner}/${model.name}`

  let training = replicate.trainings.create(
    model.name,
    {
        "input_images": await fs.promises.readFile(imageZipPath),
        "steps": 1000,
        "hf_token": "YOUR_HUGGING_FACE_TOKEN", 
        "hf_repo_id": "YOUR_HUGGING_FACE_REPO_ID",
    },
    destination

  )

  return training.id
}