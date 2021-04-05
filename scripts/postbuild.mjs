import fs from 'fs';

['package.json', 'README.md'].forEach(file => {
    const target = `dist/${file}`;
    console.log(`mv ${file} > ${target}`);

    fs.copyFileSync(file, target);
});

console.log('\nls dist');
fs.readdirSync('dist').forEach(file => console.log(`> dist/${file}`));
