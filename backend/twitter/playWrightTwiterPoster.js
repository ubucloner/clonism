import "../loadEnv.js"

import { chromium } from "playwright"
import { downloadImage } from "../utils.js";


/**
 * Deprecated 
 */


export async function postTweet(textTweet, headless) {

  await getCurrentPage(headless);

  await login(page)
  await draftTweet(page, textTweet)   
  await clickPostButton(page)
}

export async function postTweetWithImage(textTweet, imageUrl, headless) {
  
  let localFilePath = await downloadImage(imageUrl)

  const page = await getCurrentPage(headless);

  try {
    await login(page)
   
    
    await uploadMediaOnTweet(page, localFilePath)
    await draftTweet(page, textTweet)
    await clickPostButton(page);
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    // Nettoyer : supprimer le fichier temporaire
  //  fs.unlinkSync(localFilePath);
    //await browser.close();
  }
}

var page = null
var context = null
async function getCurrentPage(headless){
  if (page){
    return page
  }

  context = await getOrCreateContext(headless)
  page =  await context.newPage()
  return page
}


async function setCookies(context, cookies) {
  if (cookies && Array.isArray(cookies)) {
    await context.addCookies(cookies);
  }
}

function setupCookies(context){
  setCookies(context, [{
      name: 'lang',
      value: 'en',
      domain: 'x.com',
      path: '/'
  }]
  )
}
async function removeCookieBanner(page) {
 
  let bannerSelector = '[data-testid="BottomBar"]' 
    
  try {
    await page.waitForSelector(bannerSelector, { timeout: 3000 });
    await page.evaluate(() => {
      const banner = document.querySelector('[data-testid="BottomBar"]'); //must be hardcoded
      if (banner) {
        banner.remove();
      }
    });
  } catch (error) {
    console.log("Error removing cookie banner:", error);
  }
}

async function fillEmailOrPhone(page, emailOrPhone) {
  try {
    const emailInput = await page.waitForSelector('[data-testid="ocfEnterTextTextInput"]', { timeout: 2000 });
    if (emailInput) {
      await emailInput.fill(emailOrPhone);
      await clickNext(page, 2000);
  
    }
  } catch (error) {
    console.log("Email/Phone input not found, continuing...");
  }
}
async function clickNext(page) {
  try {
    await page.getByRole('button', { name: /Next|Suivant/i }).click();
  } catch(e) {}
}

async function fillEmail(page){
  // Fill username
  await page.locator('input[autocomplete="username"]').fill(process.env.X_LOGIN);
  
  // Click next button
  await clickNext(page);
}

async function fillPassword(page){
  let password = process.env.X_PASSWORD
  try {
    await page.locator('input[autocomplete="current-password"]').fill(password, { timeout: 2000 });
  } catch (error) {
    await page.locator('input[name="password"]').fill(password);
  }
  
  await page.getByTestId('LoginForm_Login_Button').click();
}

var isLoggedInOnTweet = false

async function removeMask(page) {
  try {
    await page.waitForSelector('[data-testid="mask"]', { timeout: 2000 });
    await page.evaluate(() => {
      const mask = document.querySelector('[data-testid="mask"]');
      if (mask) {
        mask.remove();
      }
    });
  } catch (error) {
    console.log("No mask element found");
  }
}

async function login(page) {

  if (isLoggedInOnTweet){
    return
  }

  await page.goto('https://x.com/login');
  
  await fillEmail(page)
  await fillEmailOrPhone(page, process.env.X_EMAIL_OR_PHONE);
  await fillPassword(page)

  await page.waitForURL('https://x.com/home');
  await removeCookieBanner(page)
  //await removeMask(page)
 
  isLoggedInOnTweet = true
}

async function clickPostButton(page) {
  try {
    // Essaie d'abord le clic normal
    await page.getByTestId('tweetButtonInline').click({ timeout: 1000 });
  } catch (error) {
    // Si le clic normal échoue, force le clic via evaluate
    await page.evaluate(() => {
      const button = document.querySelector('[data-testid="tweetButtonInline"]');
      if (button) {
        button.click();
      } else {
        throw new Error("Button not found in DOM");
      }
    });
  }
}
async function draftTweet(page, textTweet){
  const tweetInput = page.locator('.public-DraftStyleDefault-block').first();
  await tweetInput.clear();

  // Type the text character by character with a small delay
  for (const char of textTweet) {
    await tweetInput.type(char, {delay: 100}); // 100ms delay between each character
  }
  
  await tweetInput.click();
}

async function newContext(browser){
  return await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    languageCode: 'en-US',
    geolocation: { longitude: -122.4194, latitude: 37.7749 }, // San Francisco
    timezoneId: 'America/Los_Angeles',
    viewport: { width: 1920, height: 1080 }, // Ajout de la taille de la fenêtre
    screen: { width: 1920, height: 1080 } 
  });
}


var browser = null

async function getOrLaunchBrowser(headless){

    if (browser){
      return browser
    }

    browser = await chromium.launch({ headless });
    return browser
}

async function uploadMediaOnTweet(page, localFilePath){
  const fileInput = await page.getByTestId('fileInput');
  await fileInput.evaluate(node => {
    node.style.visibility = 'visible';
    node.style.width = '150px';
    node.style.height = '20px';
    node.style.position= "absolute";
    node.style.right = 0
  });
  await page.waitForTimeout(100);
  
  await fileInput.setInputFiles(localFilePath);
  await fileInput.evaluate(node => node.style.visibility = 'hidden')
  await page.waitForTimeout(800);

}
async function getOrCreateContext(headless){


  browser = await getOrLaunchBrowser(headless)
  return await newContext(browser)
}

