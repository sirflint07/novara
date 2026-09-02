import { getWebhookConfig } from '../lib/webhook-config';

const config = getWebhookConfig();

console.log('📋 Webhook Configuration');
console.log('=======================');
console.log(`Environment: ${config.environment}`);
console.log(`URL: ${config.url}`);
console.log(`Secret: ${config.secret ? 'Set' : 'Missing'}`);
console.log('=======================');
console.log('Add this URL to Clerk Dashboard:');
console.log(config.url);


export const getWebhookUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return process.env.CLERK_WEBHOOK_URL_DEV || 'https://your-ngrok-url.ngrok-free.dev/api/webhooks/clerk';
  }
  
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`;
};

console.log('Webhook URL configured in Clerk:', getWebhookUrl());