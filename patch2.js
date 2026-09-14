const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');
code = code.replace(/<AnalyticsTracker \/>/g, '{/* <AnalyticsTracker /> */}');
fs.writeFileSync('app/layout.tsx', code);
