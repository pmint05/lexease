const fs = require('fs');
const path = require('path');

const files = [
  'app/(guardian)/(tabs)/dashboard.tsx',
  'app/(child)/book/[id].tsx',
  'app/(child)/reading/[id].tsx',
  'app/(guardian)/book/[id].tsx'
];

const replacements = [
  // COLORS replacements (as property access)
  { regex: /COLORS\.cream/g, replacement: '"$background"' },
  { regex: /COLORS\.textDark/g, replacement: '"$foreground"' },
  { regex: /COLORS\.blue/g, replacement: '"$primary"' },
  { regex: /COLORS\.orange/g, replacement: '"$secondary"' },
  { regex: /COLORS\.green/g, replacement: '"$accent"' },
  { regex: /COLORS\.red/g, replacement: '"$destructive"' },
  { regex: /COLORS\.textMuted/g, replacement: '"$mutedForeground"' },
  { regex: /COLORS\.gray/g, replacement: '"$mutedForeground"' },
  { regex: /COLORS\.easy/g, replacement: '"$accent"' },
  { regex: /COLORS\.medium/g, replacement: '"$secondary"' },
  { regex: /COLORS\.hard/g, replacement: '"$destructive"' },
  
  // Hex color replacements
  { regex: /"#FFF8F0"/g, replacement: '"$background"' },
  { regex: /'#FFF8F0'/g, replacement: '"$background"' },
  
  // Tamagui token replacements
  { regex: /"\$color5"/g, replacement: '"$border"' },
  { regex: /'\$color5'/g, replacement: '"$border"' },
  { regex: /"\$color4"/g, replacement: '"$border"' },
  { regex: /'\$color4'/g, replacement: '"$border"' },
  { regex: /"\$color2"/g, replacement: '"$muted"' },
  { regex: /'\$color2'/g, replacement: '"$muted"' },
  { regex: /"\$color10"/g, replacement: '"$mutedForeground"' },
  { regex: /'\$color10'/g, replacement: '"$mutedForeground"' },
  { regex: /"\$gray"/g, replacement: '"$mutedForeground"' },
  { regex: /'\$gray'/g, replacement: '"$mutedForeground"' },
];

files.forEach(fileRelPath => {
  const filePath = path.resolve(process.cwd(), fileRelPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    // Special case for root container backgroundColor if it was missing or had different name
    // (This is harder to automate perfectly with regex but we'll do our best)

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${fileRelPath}`);
  } else {
    console.log(`File not found: ${fileRelPath}`);
  }
});
