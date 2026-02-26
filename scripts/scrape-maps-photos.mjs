import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const url = "https://www.google.com/maps/place/Papa+Everett's+Pizza/@43.1440772,-93.3793697,17z/data=!4m15!1m8!3m7!1s0x87f10a607ad72d65:0xbe8d4e4013722cc9!2sPapa+Everett's+Pizza!8m2!3d43.1440733!4d-93.3767948!10e1!16s%2Fg%2F1vl9s125!3m5!1s0x87f10a607ad72d65:0xbe8d4e4013722cc9!8m2!3d43.1440733!4d-93.3767948!16s%2Fg%2F1vl9s125?entry=ttu&g_ep=EgoyMDI2MDIyMy4wIKXMDSoASAFQAw%3D%3D";

async function scrape() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const imageUrls = new Set();

  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('.jpg') || url.includes('.png') || url.includes('googleusercontent')) {
        console.log('Intercepted:', url.substring(0, 100));
    }
    // Google Maps photos typically come from lh3 or lh5 googleusercontent
    if (url.includes('googleusercontent.com/p/') || url.includes('googleusercontent.com/places/')) {
      let cleanUrl = url.replace(/=w\d+-h\d+-k-no.*/, '=s1200');
      cleanUrl = cleanUrl.replace(/=s\d+-p-k-no.*/, '=s1200');
      if (!cleanUrl.includes('=s1200')) {
           cleanUrl = cleanUrl.split('=')[0] + '=s1200';
      }
      imageUrls.add(cleanUrl);
    }
  });

  console.log('Navigating to Google Maps listing...');
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  
  console.log('Looking for Photos tab...');
  try {
    const photosButton = page.locator('button', { hasText: 'Photos' }).first();
    await photosButton.waitFor({ timeout: 10000 });
    await photosButton.click();
    console.log('Clicked Photos tab. Waiting for gallery to load...');
  } catch (e) {
    console.log('Could not click Photos tab directly. Analyzing page to find image buttons...');
    const alternatePhotos = page.locator('button[aria-label*="photo"]').first();
    if (await alternatePhotos.count() > 0) {
      await alternatePhotos.click();
    }
  }

  await page.waitForTimeout(3000);

  console.log('Scrolling to load more photos...');
  
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(500);
  }

  console.log(`Found ${imageUrls.size} unique photos via network interception.`);
  
  fs.writeFileSync('public/images/food/scraped-urls.json', JSON.stringify(Array.from(imageUrls), null, 2));

  await browser.close();
  console.log('Done.');
}

scrape().catch(console.error);
