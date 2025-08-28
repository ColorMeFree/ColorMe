// Build script for production with environment variables
import { execSync } from 'child_process';
import fs from 'fs';

// Read config.secret to get the values
const configContent = fs.readFileSync('config.secret', 'utf8');
const secrets = {};

// Parse the config file
configContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const match = trimmedLine.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      secrets[match[1]] = match[2];
    }
  }
});

console.log('Building production version...');

// Set environment variables for build
const envVars = {
  VITE_SHOPIFY_DOMAIN: secrets.SHOPIFY_DOMAIN,
  VITE_SHOPIFY_STOREFRONT_TOKEN: secrets.SHOPIFY_STOREFRONT_TOKEN,
  VITE_SHOPIFY_VARIANT_GID: secrets.SHOPIFY_VARIANT_GID,
  VITE_BACKEND_URL: secrets.BACKEND_URL
};

try {
  // Use cross-platform environment variable setting
  const env = { ...process.env, ...envVars };
  execSync('npm run build', { stdio: 'inherit', env });
  console.log('✅ Production build complete!');
  console.log('📁 Built files are in the dist/ folder');
  console.log('🚀 You can now deploy the dist/ folder to your web server');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
