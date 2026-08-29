const fs = require('fs');
const path = require('path');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already refactored
  if (content.includes('require(\'../prismaClient\')') || content.includes('require(\'./prismaClient\')')) return;

  // Determine relative path to prismaClient.js
  const dir = path.dirname(filePath);
  const relativePath = path.relative(dir, path.join(__dirname, 'prismaClient'));
  const requirePath = relativePath.startsWith('.') ? relativePath : './' + relativePath;

  // Replace
  content = content.replace(/const\s*{\s*PrismaClient\s*}\s*=\s*require\('@prisma\/client'\);?/g, '');
  content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, `const prisma = require('${requirePath.replace(/\\/g, '/')}');`);

  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') walk(fullPath);
    } else if (fullPath.endsWith('.js') && fullPath !== path.join(__dirname, 'prismaClient.js') && fullPath !== path.join(__dirname, 'refactor.js')) {
      refactorFile(fullPath);
    }
  }
}

walk(__dirname);
console.log('Refactoring complete.');
