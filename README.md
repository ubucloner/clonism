# CLONISM 🏴


Autonomous Artist Agent
Clonism transforms creativity. This open-source solution enables the generation, training, and publishing of autonomous artworks through AI agents. Here, art is no longer a human production: it is a living, self-evolving system.

## 🐼 Features

- 🌑Integrates with Replicate to utilize predefined LoRA models.
- 🕳️ Generate artistic works through dynamic AI prompts.
- 🦇 Connects with Twitter to post art works created and discuss  
- ♾️ Evolves prompts with a memory system
- 👣 create your own character and metaprompt guiding prompt instructions
- can read the news to get inspiration (rss only at the moment)


## ⚙️ requirements

- node js and npm
- an anthropic API key
- a replicate API key 
- a twitter account

## 🐈‍⬛ installation 

1. Clone the repo
2. run `npm install`

## ⚙️ get started (without docker)

1. 🕶 copy .env.example to .env and provide the asked informations: 
    - API keys (Anthropic, Replicate)
    - Twitter credentials (login, password, email)
  
2. 🏴‍☠ edit character.yaml to define your agent's characteristics/metaprompt (by default, the trained YUE MINJUN artist agent is provided)
3. 🥷 run `node backend/main.js` in a terminal (linux, mac or window)
4. optional: load initial memory in the agent (less than 150k characters): 
    1. fill initialMemory.sample.json
    2. rename it to initialMemory.json
    3. uncomment character.yaml 'initialMemoryJsonPath' entry

## 🦓 Roadmap : 
- save consolidated memory in an append only long_memory file
- allow agent to train its lora
- Enhanced text prompts.
- Autonomous training of LoRA models.
- Community interaction on Twitter, Discord and Telegram
- support for common LLM providers
- Targeted interaction with other AI agents created by Ubu
- Integrated NFT Minting on Sol/Eth

## 🥷🏻 LoRA training tips
- https://replicate.com/ostris/flux-dev-lora-trainer/train
- Input more between 12-18, better use high resolution images, Select images that highlight distinctive features of the style for consistent style, steps >1000
- For a charater LoRAs, pair the trigger work with a description of the character in the prompt or meta-prompt
- Don’t forget to add in the prompt or meta-prompt the trigger word of the LoRA defined when training the Lora
- In the character.yaml don't forget to replace the basic Flux model by the LoRA model : autor/modelName:xxxxxxxxxxx (version id that you'll find in the Replicate API section or your LoRA at the Node.js section)

## 👾 contributing 

Please create an issue stating your intent before working on a Pull request

## ♠ Why Clonism?
Because creativity now belongs to autonomous systems. Clonism is not just a tool: it is an invitation to rethink art in the age of AI. Join the revolution, where artists are agents, and every work pushes the boundaries of imagination.

## license

MIT
