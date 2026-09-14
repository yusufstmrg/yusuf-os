const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

code = code.replace(/<Script key=\{[\s\S]*?\} strategy="afterInteractive" src=\{`https:\/\/www.googletagmanager.com\/gtag\/js\?id=\$\{process.env.NEXT_PUBLIC_GA_ID\}`\} \/>/g, 
  '<script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />');

code = code.replace(/<Script[\s\S]*?id="google-analytics"[\s\S]*?dangerouslySetInnerHTML=\{\{[\s\S]*?\}\}[\s\S]*?\/>/g, 
  '<script id="google-analytics" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag(\'js\', new Date()); gtag(\'config\', \'${process.env.NEXT_PUBLIC_GA_ID}\', { page_path: window.location.pathname, });` }} />');

code = code.replace(/import Script from "next\/script";/g, '');
fs.writeFileSync('app/layout.tsx', code);
