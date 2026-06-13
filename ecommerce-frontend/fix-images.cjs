const fs = require('fs');

const file = 'src/shared/utils/seedData.ts';
let content = fs.readFileSync(file, 'utf-8');

const brokenUrls = [
  'https://images.unsplash.com/photo-1678911820864-e2c567cf6550?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1691136137682-93889025e796?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1605236453806-6ff3685e2ca7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1585060544812-6b45742d76b1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1612442449195-53531b798b31?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1593642632823-8f785bc67c7b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1597872200969-2b65dffc0e3b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1558882224-cca16273e197?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1563206767-5b18f218e7de?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1585909694668-0a6e03b89d21?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511499767390-903390e62bc0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524592091214-8c97af7c4a17?auto=format&fit=crop&q=80&w=800'
];

brokenUrls.forEach((url, i) => {
  const replacement = `https://placehold.co/800x800/e2e8f0/1e293b?text=Product+${i+1}`;
  content = content.replace(url, replacement);
});

fs.writeFileSync(file, content);
console.log('Fixed broken images in seedData.ts');
