import  Parser from 'rss-parser'
import { addMemory } from './memory.js';
let parser = new Parser();

/**
 * Only read summary from rss for now
 */
export async function readRandomNews(sourceRSSUrl){
    let items = await readRss(sourceRSSUrl)
    let randomIndex = Math.floor(Math.random() * items.length)

    let newsItem = items[randomIndex].content 
    let memory = `just read some news: ${newsItem}`
    console.log(memory)
    addMemory(memory)
    return newsItem
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
