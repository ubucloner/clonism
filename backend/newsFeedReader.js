import  Parser from 'rss-parser'
import { addMemory } from './memory.js';
let parser = new Parser();

/**
 * Only read summary from rss for now
 */
export async function readRandomNews(sourceRSSUrl){
    let items = await readRss(sourceRSSUrl)
    let randomIndex = Math.floor(Math.random() * items.length)
    let rssItem = items[randomIndex]
    let summary = rssItem.content 
    let title   = rssItem.title 

    console.log(`just read some news: ${title}`)

    let memory = `just read some news: ${summary}`
    addMemory(memory)
    
}

async function readRss(url) {

  let feed = await parser.parseURL(url);
  return feed.items.map(item => {
   
    return {
        title: item.title,
        link: item.link,
        content: item.content
    }
  });
}
