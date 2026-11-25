const fs = require('fs');
const path = require('path');

const directories = [
    'c:/xampp/htdocs/San_Antonio_Water_Billing/resources/js/pages/admin',
    'c:/xampp/htdocs/San_Antonio_Water_Billing/resources/js/pages/staff'
];

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    if (filePath.includes('admin\\users\\') || filePath.includes('admin/users/') || filePath.includes('staff\\users\\') || filePath.includes('staff/users/')) return;
    if (filePath.includes('admin\\customers\\index.tsx') || filePath.includes('admin\\customers\\edit.tsx') || filePath.includes('admin\\customers\\create.tsx') || filePath.includes('admin\\customers\\show.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/username:\s*string\s*/g, 'meter_number: string ');
    // Fix broken 'meter_number: string ;' -> 'meter_number: string;'
    content = content.replace(/meter_number:\s*string\s*;/g, 'meter_number: string;');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated interface: ${filePath}`);
    }
}

directories.forEach(dir => {
    walk(dir, processFile);
});

console.log('Done.');
