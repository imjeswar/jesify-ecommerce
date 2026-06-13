const fs = require('fs');

const file = 'src/shared/utils/seedData.ts';
let content = fs.readFileSync(file, 'utf-8');

const replacements = {
  '1473966968600-fa804b86862b': '1542272604-787c3835535d',
  '1558229986-7a7f4571de43': '1585366119957-e9730b6d0f60',
  '1596462502278-27bfdc4033c8': '1620916566398-39f1143ab7be',
  '1598251261353-8386345ec465': '1585366119957-e9730b6d0f60',
  '1505691722718-46843475962b': '1540518614846-7eded433c457',
  '1582281227203-7ea7c83d42bc': '1570222094114-d054a817e56b',
  '1550985543-f47f38aee65e': '1513694203232-719a280e022f',
  '1584990344321-27682ad0f144': '1570222094114-d054a817e56b',
  '1585144880900-21f0097dfbd3': '1592078615290-033ee584e267',
  '1559591931-988ad9845554': '1610557892470-55d9e80c0bce'
};

for (const [broken, working] of Object.entries(replacements)) {
  content = content.replace(broken, working);
}

fs.writeFileSync(file, content);
console.log('Fixed remaining 10 broken Unsplash images!');
