import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Read .env.local manually since we're running this script directly with node
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
    envVars[key] = value;
  }
});

const apiKey = envVars.RESEND_API_KEY;
const fromEmail = envVars.EMAIL_FROM || 'onboarding@resend.dev';

if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found in .env.local');
  process.exit(1);
}

console.log(`Using API Key: ${apiKey.slice(0, 5)}...`);
console.log(`Sending from: ${fromEmail}`);

const resend = new Resend(apiKey);

async function sendTestEmail() {
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: 'eebueche@gmail.com', // Using the contact email found in the code
      subject: 'Test Email from Wedding Site',
      html: '<p>This is a test email to verify the Resend configuration.</p>'
    });

    if (data.error) {
      console.error('❌ Failed to send email:', data.error);
    } else {
      console.log('✅ Email sent successfully!', data);
    }
  } catch (error) {
    console.error('❌ Exception while sending email:', error);
  }
}

sendTestEmail();
