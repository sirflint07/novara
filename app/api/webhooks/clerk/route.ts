import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/admin-config';

const getWebhookSecret = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.CLERK_WEBHOOK_SECRET_KEY_DEV
  } else if (process.env.NODE_ENV === 'production') {
    return process.env.CLERK_WEBHOOK_SECRET_KEY_PROD
  }
  
  return process.env.CLERK_WEBHOOK_SECRET;
};

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      status: 'ok',
      message: 'Clerk webhook endpoint is active',
      environment: process.env.NODE_ENV,
      webhookSecret: getWebhookSecret() ? 'Set' : 'Missing',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');
  const client = await clerkClient();

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(getWebhookSecret() || '');

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;
    const primaryEmail = email_addresses?.find(
      (email) => email.id === evt.data.primary_email_address_id
    );
    const email = primaryEmail?.email_address || email_addresses?.[0]?.email_address;

    const isAdmin = isAdminEmail(email);
    const role = isAdmin ? 'ADMIN': null;
    const onboardingCompleted = isAdmin ? true : false;

    try {
      await db.user.create({
        data: {
          clerkId: id,
          email: email || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          avatarUrl: image_url || '',
          role: role,
          onboardingCompleted: onboardingCompleted,
          username: username || null
        },
      });

      await client.users.updateUser(id, {
        publicMetadata: {
          role: role,
          onboardingCompleted: onboardingCompleted,
        },
      });

      console.log(`User created in database: ${id}`, { role, onboardingCompleted });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error: Failed to create user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await db.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          avatarUrl: image_url || '',
        },
      });

      console.log(`User updated in database: ${id}`);
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error: Failed to update user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (id) {
      try {
        const existingUser = await db.user.findUnique({
          where: { clerkId: id },
        });

        if (existingUser) {
          await db.user.delete({
            where: { clerkId: id },
          });
          console.log(`User deleted from database: ${id}`);
        } else {
          console.log(`User not found in database, skipping deletion: ${id}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        return new Response('Error: Failed to delete user', { status: 500 });
      }
    }

    return NextResponse.json(
      { message: 'User deletion processed' },
      { status: 200 }
    );
  }

  return new Response('Webhook received', { status: 200 });
}