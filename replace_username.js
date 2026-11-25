const fs = require('fs');
const path = require('path');
const glob = require('glob');

const directories = [
    'c:/xampp/htdocs/San_Antonio_Water_Billing/resources/js/pages/admin',
    'c:/xampp/htdocs/San_Antonio_Water_Billing/resources/js/pages/staff'
];

function processFile(filePath) {
    if (filePath.includes('admin/users/') || filePath.includes('staff/users/') || filePath.includes('CustomerManagementController.php')) {
        return; // skip users
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace interface properties
    content = content.replace(/username:\s*string;/g, 'meter_number?: string;');
    
    // Replace customer.username
    content = content.replace(/customer\.username/g, 'customer.meter_number');
    
    // Replace c.username
    content = content.replace(/c\.username/g, 'c.meter_number');

    // Replace r.customer.username
    content = content.replace(/r\.customer\.username/g, 'r.customer.meter_number');

    // Replace p.customer.username
    content = content.replace(/p\.customer\.username/g, 'p.customer.meter_number');
    
    // Replace bill.customer.username
    content = content.replace(/bill\.customer\.username/g, 'bill.customer.meter_number');

    // Replace b.customer.username
    content = content.replace(/b\.customer\.username/g, 'b.customer.meter_number');
    
    // Replace placeholder texts
    content = content.replace(/customer or username/gi, 'customer or meter');
    content = content.replace(/name or username/gi, 'name or meter');
    content = content.replace(/username or ref/gi, 'meter or ref');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

directories.forEach(dir => {
    glob.sync(`${dir}/**/*.tsx`).forEach(processFile);
});

console.log('Done.');
