export const getWebhookConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isDevelopment) {
    return {
      url: 'http://localhost:3000/api/webhooks/clerk',
      secret: process.env.CLERK_SIGN_IN_SECRET_DEV || "",
      environment: 'development',
    };
  }
  
  if (isProduction) {
    return {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`,
      secret: process.env.CLERK_WEBHOOK_SECRET_KEY_PROD,
      environment: 'production',
    };
  }
  
  return {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`,
    secret: process.env.CLERK_WEBHOOK_SECRET_DEV,
    environment: 'unknown',
  };
};