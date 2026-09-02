import Stripe from 'stripe';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }

  const globalStripe = global as unknown as { stripe: Stripe | null };

  if (!globalStripe.stripe) {
    globalStripe.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia',
    });
  }

  return globalStripe.stripe;
};

export default getStripe();