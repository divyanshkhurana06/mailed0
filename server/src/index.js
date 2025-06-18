import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import UAParser from 'ua-parser-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize clients
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Free Hugging Face summarization function
async function summarizeEmail(subject, from, body) {
  try {
    const text = `Subject: ${subject}\nFrom: ${from}\n\n${body}`;
    
    // Use Hugging Face's free summarization API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_demo'}` // Use demo key if no API key
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 50,
          do_sample: false
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Fallback to simple summarization if API fails
      return {
        title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
        tags: ['general'],
        preview: body.length > 100 ? body.substring(0, 100) + '...' : body
      };
    }

    const result = await response.json();
    const summary = result[0]?.summary_text || body.substring(0, 100);

    // Simple categorization based on keywords
    const tags = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meeting') || lowerText.includes('work') || lowerText.includes('project')) {
      tags.push('work');
    }
    if (lowerText.includes('invoice') || lowerText.includes('payment') || lowerText.includes('money')) {
      tags.push('finance');
    }
    if (lowerText.includes('event') || lowerText.includes('party') || lowerText.includes('celebration')) {
      tags.push('events');
    }
    if (lowerText.includes('sale') || lowerText.includes('offer') || lowerText.includes('promotion')) {
      tags.push('marketing');
    }
    if (tags.length === 0) {
      tags.push('personal');
    }

    return {
      title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
      tags: tags.slice(0, 3), // Max 3 tags
      preview: summary.length > 100 ? summary.substring(0, 100) + '...' : summary
    };
  } catch (error) {
    console.error('Summarization error:', error);
    // Fallback
    return {
      title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
      tags: ['general'],
      preview: body.length > 100 ? body.substring(0, 100) + '...' : body
    };
  }
}

// Google OAuth routes
app.get('/api/auth/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ url: authUrl });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  
  console.log('OAuth callback received:', { code: !!code, error });
  
  if (error) {
    console.error('OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?reason=${error}`);
    return;
  }
  
  if (!code) {
    console.error('No authorization code received');
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?reason=no_code`);
    return;
  }
  
  try {
    console.log('Getting tokens from Google...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received, getting user info...');
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    console.log('User info received:', userInfo.email);

    // Store tokens in Supabase
    console.log('Storing tokens in Supabase...');
    
    // First check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userInfo.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking existing user:', checkError);
      throw checkError;
    }

    let supabaseError;
    if (existingUser) {
      // Update existing user
      console.log('Updating existing user...');
      const { error } = await supabase
        .from('users')
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: new Date(tokens.expiry_date).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', userInfo.email);
      supabaseError = error;
    } else {
      // Insert new user
      console.log('Creating new user...');
      const { error } = await supabase
        .from('users')
        .insert({
          email: userInfo.email,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: new Date(tokens.expiry_date).toISOString()
        });
      supabaseError = error;
    }

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw supabaseError;
    }

    console.log('Success! Redirecting to frontend...');
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?email=${userInfo.email}`);
  } catch (error) {
    console.error('Auth error details:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?reason=${error.message || 'unknown'}`);
  }
});

// Check if user is authenticated
app.get('/api/auth/check', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.json({ authenticated: false });
    }

    res.json({ authenticated: true, email: user.email });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Failed to check authentication' });
  }
});

// Email fetching and processing
app.get('/api/emails', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Email fetch request for:', email);
    
    if (!email) {
      console.log('No email provided in request');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get user's tokens from Supabase
    console.log('Fetching user tokens from Supabase...');
    const { data: user, error } = await supabase
      .from('users')
      .select('access_token, refresh_token')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.log('User not found or error:', error);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('User tokens found, setting up Gmail client...');

    // Set up Gmail client
    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch recent emails
    console.log('Fetching emails from Gmail...');
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 20
      });
      
      console.log('Gmail API response:', response.status, response.statusText);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      const { messages } = response.data;
      console.log(`Found ${messages?.length || 0} messages`);

      if (!messages || messages.length === 0) {
        console.log('No messages found');
        return res.json([]);
      }

      const processedEmails = await Promise.all(
        messages.map(async (message, index) => {
          console.log(`Processing message ${index + 1}/${messages.length}`);
          
          try {
            const { data: email } = await gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full'
            });

            // Extract email content
            const headers = email.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
            
            // Get email body
            let body = '';
            if (email.payload.parts) {
              const textPart = email.payload.parts.find(part => part.mimeType === 'text/plain');
              if (textPart) {
                body = Buffer.from(textPart.body.data, 'base64').toString();
              }
            } else if (email.payload.body.data) {
              body = Buffer.from(email.payload.body.data, 'base64').toString();
            }

            // Try to summarize with Hugging Face API, but fallback if it fails
            let summary;
            try {
              summary = await summarizeEmail(subject, from, body);
            } catch (summarizationError) {
              console.log(`Summarization failed for message ${index + 1}, using fallback`);
              summary = {
                title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
                tags: ['general'],
                preview: body.length > 100 ? body.substring(0, 100) + '...' : body
              };
            }

            return {
              id: message.id,
              subject,
              from,
              title: summary.title,
              tags: summary.tags,
              preview: summary.preview,
              snippet: email.snippet,
              date: new Date(parseInt(email.internalDate)).toISOString()
            };
          } catch (messageError) {
            console.error(`Error processing message ${index + 1}:`, messageError);
            // Return a basic email object if processing fails
            return {
              id: message.id,
              subject: 'Error loading email',
              from: 'Unknown',
              title: 'Error loading email',
              tags: ['error'],
              preview: 'This email could not be loaded properly.',
              snippet: '',
              date: new Date().toISOString()
            };
          }
        })
      );

      console.log(`Successfully processed ${processedEmails.length} emails`);
      res.json(processedEmails);
    } catch (gmailError) {
      console.error('Gmail API error details:', {
        message: gmailError.message,
        status: gmailError.status,
        code: gmailError.code,
        errors: gmailError.errors
      });
      throw gmailError;
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
  }
});

// Tracking pixel endpoint
app.get('/api/open', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send('Missing email ID');
    }

    // Parse user agent
    const ua = new UAParser(req.headers['user-agent']);
    const device = ua.getDevice();
    const browser = ua.getBrowser();
    const os = ua.getOS();

    // Get IP and location (you might want to use a proper IP geolocation service)
    const ip = req.ip;
    
    // Record the open
    const { error } = await supabase
      .from('opens')
      .insert({
        email_id: id,
        opened_at: new Date().toISOString(),
        device_type: device.type || 'desktop',
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
        ip_address: ip
      });

    if (error) throw error;

    // Return a 1x1 transparent pixel
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': '43',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error('Error recording email open:', error);
    res.status(500).send('Error recording open');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 