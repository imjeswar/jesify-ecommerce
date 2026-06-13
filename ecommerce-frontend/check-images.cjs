const https = require('https');
const fs = require('fs');

const seedDataContent = fs.readFileSync('src/shared/utils/seedData.ts', 'utf-8');
const urls = [...seedDataContent.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g)].map(m => m[0]);

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => {
      resolve({ url, status: 'error' });
    });
  });
};

(async () => {
  const uniqueUrls = [...new Set(urls)];
  console.log(`Checking ${uniqueUrls.length} URLs...`);
  
  let broken = [];
  for (const url of uniqueUrls) {
    const { status } = await checkUrl(url);
    if (status !== 200 && status !== 302) {
      console.log(`BROKEN: ${status} - ${url}`);
      broken.push(url);
    }
  }
  
  console.log(`Finished. Found ${broken.length} broken URLs.`);
})();
