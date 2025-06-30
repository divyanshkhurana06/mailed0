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
app.use(cors({
  origin: [
    'https://mailed.netlify.app',        // Production frontend
    'http://localhost:5173',              // Development frontend
    'http://localhost:3000',              // Development backend
    'https://mail.google.com'             // Gmail for extension
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email']
}));
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
    // Clean the body content first
    let cleanBody = body;
    if (isHTML(body)) {
      // Simple HTML tag removal for Node.js
      cleanBody = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    // Create a comprehensive text for summarization
    const text = `Subject: ${subject}\nFrom: ${from}\n\n${cleanBody}`;
    
    console.log('Summarizing email:', subject);
    console.log('Text length for summarization:', text.length);
    console.log('Text preview:', text.substring(0, 200) + '...');
    
    // Use Hugging Face's free summarization API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Try multiple models in case one fails
    const models = [
      'facebook/bart-large-cnn',
      'sshleifer/distilbart-cnn-12-6',
      'google/pegasus-xsum'
    ];
    
    let summary = null;
    let lastError = null;
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_demo'}`
          },
          body: JSON.stringify({
            inputs: text.substring(0, 1000), // Limit input length
            parameters: {
              max_length: 300, // Increased from 150
              min_length: 50,  // Increased from 30
              do_sample: false,
              num_beams: 3
            }
          }),
          signal: controller.signal
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Model ${model} response:`, result);
          
          if (result[0]?.summary_text) {
            summary = result[0].summary_text;
            console.log(`Successfully got summary from ${model}:`, summary);
            break;
          }
        } else {
          console.log(`Model ${model} failed with status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Model ${model} error:`, error.message);
        lastError = error;
        continue;
      }
    }

    clearTimeout(timeoutId);

    if (!summary) {
      console.log('All Hugging Face models failed, using fallback');
      // Fallback to simple summarization if API fails
      const fallbackSummary = cleanBody.length > 300 ? cleanBody.substring(0, 300) + '...' : cleanBody;
      console.log('Using fallback summary:', fallbackSummary);
      return {
        title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
        tags: ['general'],
        preview: fallbackSummary
      };
    }

    // Enhanced categorization based on keywords
    const tags = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meeting') || lowerText.includes('work') || lowerText.includes('project') || lowerText.includes('deadline') || lowerText.includes('coding') || lowerText.includes('team')) {
      tags.push('work');
    }
    if (lowerText.includes('invoice') || lowerText.includes('payment') || lowerText.includes('money') || lowerText.includes('bill') || lowerText.includes('transaction')) {
      tags.push('finance');
    }
    if (lowerText.includes('event') || lowerText.includes('party') || lowerText.includes('celebration') || lowerText.includes('invitation')) {
      tags.push('events');
    }
    if (lowerText.includes('sale') || lowerText.includes('offer') || lowerText.includes('promotion') || lowerText.includes('discount') || lowerText.includes('newsletter')) {
      tags.push('marketing');
    }
    if (lowerText.includes('confirm') || lowerText.includes('verify') || lowerText.includes('account') || lowerText.includes('signup')) {
      tags.push('account');
    }
    if (tags.length === 0) {
      tags.push('personal');
    }

    console.log('Final summary:', summary);
    console.log('Final tags:', tags);

    return {
      title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
      tags: tags.slice(0, 3), // Max 3 tags
      preview: summary // Remove truncation - show full summary
    };
  } catch (error) {
    console.error('Summarization error:', error);
    // Fallback
    const fallbackSummary = body.length > 300 ? body.substring(0, 300) + '...' : body;
    console.log('Error fallback summary:', fallbackSummary);
    return {
      title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
      tags: ['general'],
      preview: fallbackSummary
    };
  }
}

// Helper function to check if content is HTML
function isHTML(content) {
  return content.trim().startsWith('<html') || content.includes('<body') || content.includes('<div');
}

// Google OAuth routes
app.get('/api/auth/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
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

// Fetch emails from Gmail
app.get('/api/emails', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Fetching emails for user:', email);

    // Get user's tokens from Supabase
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

    // Get user's email address
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const userEmail = profile.data.emailAddress;
    console.log('User email:', userEmail);

    // Fetch recent emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      q: 'is:inbox'
    });

    const emails = [];
    const messageIds = response.data.messages || [];

    for (const message of messageIds) {
      try {
        // Get full message details
        const messageDetails = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        const headers = messageDetails.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

        // Extract email body
        let body = '';
        let snippet = messageDetails.data.snippet || '';

        if (messageDetails.data.payload?.body?.data) {
          body = Buffer.from(messageDetails.data.payload.body.data, 'base64').toString('utf-8');
        } else if (messageDetails.data.payload?.parts) {
          // Try to find text/plain or text/html part
          for (const part of messageDetails.data.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              body = Buffer.from(part.body.data, 'base64').toString('utf-8');
              break;
            } else if (part.mimeType === 'text/html' && part.body?.data) {
              body = Buffer.from(part.body.data, 'base64').toString('utf-8');
              break;
            }
          }
        }

        console.log(`Processing email: ${subject} (${message.id})`);
        console.log(`Body length: ${body.length}, Snippet: ${snippet.substring(0, 50)}...`);

        // Simple categorization without AI summarization
        const tags = categorizeEmail(subject, from, body || snippet);

        const emailData = {
          id: message.id,
          subject,
          from,
          date,
          body: body || snippet,
          snippet,
          title: subject.length > 50 ? subject.substring(0, 50) + '...' : subject,
          tags: tags,
          preview: snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet,
          aiSummary: null // Will be populated on demand
        };

        emails.push(emailData);

        // Store in Supabase
        try {
          const { error } = await supabase
            .from('emails')
            .upsert({
              id: message.id,
              user_email: userEmail,
              subject,
              from_address: from,
              date,
              snippet,
              title: emailData.title,
              tags: emailData.tags,
              preview: emailData.preview,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (error) {
            console.error('Supabase error:', error);
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
        }

      } catch (messageError) {
        console.error('Error processing message:', messageError);
      }
    }

    console.log(`Successfully processed ${emails.length} emails`);
    res.json(emails);

  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// On-demand email summarization endpoint
app.post('/api/emails/:id/summarize', async (req, res) => {
  try {
    const { id } = req.params;
    const { email: userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log(`Summarizing email ${id} for user: ${userEmail}`);

    // Get user's tokens from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('access_token, refresh_token')
      .eq('email', userEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Set up Gmail client
    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Get the specific email
    const messageDetails = await gmail.users.messages.get({
      userId: 'me',
      id: id,
      format: 'full'
    });

    const headers = messageDetails.data.payload?.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown';

    console.log(`Email subject: ${subject}`);
    console.log(`Email from: ${from}`);

    // Extract email body
    let body = '';
    if (messageDetails.data.payload?.body?.data) {
      body = Buffer.from(messageDetails.data.payload.body.data, 'base64').toString('utf-8');
    } else if (messageDetails.data.payload?.parts) {
      for (const part of messageDetails.data.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
          break;
        } else if (part.mimeType === 'text/html' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
          break;
        }
      }
    }

    console.log(`Email body length: ${body.length}`);
    console.log(`Email body preview: ${body.substring(0, 100)}...`);

    // Generate AI summary
    const summary = await summarizeEmail(subject, from, body || messageDetails.data.snippet);

    console.log(`Generated summary: ${summary.preview}`);

    res.json({ 
      summary: summary.preview,
      tags: summary.tags 
    });

  } catch (error) {
    console.error('Error summarizing email:', error);
    res.status(500).json({ error: 'Failed to summarize email' });
  }
});

// Simple email categorization function
function categorizeEmail(subject, from, body) {
  const text = `${subject} ${from} ${body}`.toLowerCase();
  const tags = [];
  
  if (text.includes('meeting') || text.includes('work') || text.includes('project') || text.includes('deadline') || text.includes('coding') || text.includes('team')) {
    tags.push('work');
  }
  if (text.includes('invoice') || text.includes('payment') || text.includes('money') || text.includes('bill') || text.includes('transaction')) {
    tags.push('finance');
  }
  if (text.includes('event') || text.includes('party') || text.includes('celebration') || text.includes('invitation')) {
    tags.push('events');
  }
  if (text.includes('sale') || text.includes('offer') || text.includes('promotion') || text.includes('discount') || text.includes('newsletter')) {
    tags.push('marketing');
  }
  if (text.includes('confirm') || text.includes('verify') || text.includes('account') || text.includes('signup')) {
    tags.push('account');
  }
  if (tags.length === 0) {
    tags.push('personal');
  }
  
  return tags.slice(0, 3);
}

// Tracking pixel endpoint
app.get('/api/open', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      console.log('Missing tracking ID in tracking request');
      return res.status(400).send('Missing tracking ID');
    }

    // Detect Google proxy or sender's own device
    const uaString = req.headers['user-agent'] || '';
    console.log('User-Agent:', uaString); // Log the user-agent for debugging
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip || 'unknown';
    const ua = new UAParser(uaString);
    const device = ua.getDevice();
    const browser = ua.getBrowser();
    const os = ua.getOS();

    // Improved device type detection with broader regex
    let deviceType = device.type || '';
    if (!deviceType) {
      if (/mobile|iphone|android|ipad|ipod|blackberry|iemobile|opera mini|webos|fennec|windows phone|kindle|silk|palm|symbian|nokia|bb10|playbook|tablet/i.test(uaString)) {
        deviceType = /tablet|ipad/i.test(uaString) ? 'tablet' : 'mobile';
      } else {
        deviceType = 'desktop';
      }
    }
    // Force deviceType to be only 'mobile', 'tablet', or 'desktop'
    if (deviceType !== 'mobile' && deviceType !== 'tablet') {
      deviceType = 'desktop';
    }

    // List of known Google IP patterns (partial)
    const googleIpPatterns = [
      /^66\.102\./, /^66\.249\./, /^64\.233\./, /^72\.14\./, /^203\.208\./, /^209\.85\./, /^216\.239\./, /^74\.125\./, /^173\.194\./, /^207\.126\./, /^216\.58\./, /^172\.217\./, /^108\.177\./, /^35\./, /^34\./
    ];
    const isGoogleProxy = googleIpPatterns.some(pattern => pattern.test(ip)) || uaString.toLowerCase().includes('googleimageproxy');

    if (isGoogleProxy) {
      console.log(`Google proxy detected. Recording open for tracking ID: ${id}`);
    } else {
      console.log(`Direct open detected for tracking ID: ${id}`);
    }
    
    console.log(`Open details - Device: ${deviceType}, Browser: ${browser.name}, OS: ${os.name}, IP: ${ip}`);

    // Record the open (all opens are logged, first-open filtering happens in analytics)
    const { data, error } = await supabase
      .from('opens')
      .insert({
        tracking_id: id,
        opened_at: new Date().toISOString(),
        device_type: deviceType,
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
        ip_address: ip,
        is_proxy_open: isGoogleProxy
      })
      .select();

    if (error) {
      console.error('Supabase error recording open:', error);
      throw error;
    }

    console.log(`Successfully recorded open for tracking ID ${id}:`, data);

    // Return a 1x1 transparent pixel
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': '43',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error('Error recording email open:', error);
    // Still return the pixel even if recording fails
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': '43'
    });
    res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  }
});

// Fetch sent emails with tracking analytics
app.get('/api/emails/sent', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Fetching sent emails for user:', email);

    // Get sent emails from our database
    const { data: sentEmails, error: dbError } = await supabase
      .from('sent_emails')
      .select('*')
      .eq('user_email', email)
      .order('sent_at', { ascending: false })
      .limit(20);

    if (dbError) {
      console.error('Error fetching sent emails:', dbError);
      return res.status(500).json({ error: 'Failed to fetch sent emails' });
    }

    console.log(`Found ${sentEmails?.length || 0} sent emails in database`);

    const processedEmails = [];

    for (const sentEmail of sentEmails || []) {
      try {
        // Get tracking analytics from Supabase (all opens, we'll ignore just the first one)
        const { data: allOpens, error: opensError } = await supabase
          .from('opens')
          .select('*')
          .eq('tracking_id', sentEmail.tracking_id)
          .order('opened_at', { ascending: true }); // Order by earliest first

        if (opensError) {
          console.error('Error fetching opens:', opensError);
        }

        // Remove the very first open (chronologically), count all the rest
        const validOpens = allOpens && allOpens.length > 0 ? allOpens.slice(1) : [];
        
        if (allOpens && allOpens.length > 0) {
          console.log(`Ignoring first open (${allOpens[0].opened_at}) for tracking ID: ${sentEmail.tracking_id}`);
        }

        const openCount = validOpens.length;
        const lastOpened = validOpens[validOpens.length - 1]?.opened_at || null;

        // Get device analytics (only from valid opens)
        const deviceStats = {};
        const locationStats = {};
        
        validOpens.forEach(open => {
          // Device stats
          const deviceType = open.device_type || 'unknown';
          deviceStats[deviceType] = (deviceStats[deviceType] || 0) + 1;
          
          // Location stats
          const location = open.ip_address || 'unknown';
          locationStats[location] = (locationStats[location] || 0) + 1;
        });

        // Simple categorization
        const tags = categorizeEmail(sentEmail.subject, sentEmail.to_email, sentEmail.body);

        const emailData = {
          id: sentEmail.id,
          subject: sentEmail.subject,
          to: sentEmail.to_email,
          date: sentEmail.sent_at,
          body: sentEmail.body,
          snippet: sentEmail.body.substring(0, 150) + (sentEmail.body.length > 150 ? '...' : ''),
          title: sentEmail.subject.length > 50 ? sentEmail.subject.substring(0, 50) + '...' : sentEmail.subject,
          preview: sentEmail.body.length > 150 ? sentEmail.body.substring(0, 150) + '...' : sentEmail.body,
          tags: tags,
          trackingId: sentEmail.tracking_id,
          analytics: {
            opens: openCount,
            lastOpened,
            devices: Object.entries(deviceStats).map(([type, count]) => ({ type, count })),
            locations: Object.entries(locationStats).map(([location, count]) => ({ location, count })),
            openHistory: validOpens.map(open => ({
              timestamp: open.opened_at,
              device: open.device_type,
              browser: open.browser,
              os: open.os,
              location: open.ip_address
            }))
          }
        };

        processedEmails.push(emailData);

      } catch (messageError) {
        console.error('Error processing sent message:', messageError);
      }
    }

    console.log(`Successfully processed ${processedEmails.length} sent emails`);
    res.json(processedEmails);

  } catch (error) {
    console.error('Error fetching sent emails:', error);
    res.status(500).json({ error: 'Failed to fetch sent emails' });
  }
});

// Send email with tracking pixel
app.post('/api/emails/send', async (req, res) => {
  try {
    const { email: userEmail, to, subject, body } = req.body;
    
    if (!userEmail || !to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Sending email from ${userEmail} to ${to}: ${subject}`);

    // Get user's tokens from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('access_token, refresh_token')
      .eq('email', userEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Set up Gmail client
    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Generate a unique tracking ID
    const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create tracking pixel URL
    const trackingPixelUrl = `${process.env.FRONTEND_URL}/api/open?id=${trackingId}`;
    
    // Create HTML email with tracking pixel
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          ${body.replace(/\n/g, '<br>')}
        </div>
        <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
      </body>
      </html>
    `;

    // Create plain text version
    const sendBody = req.body.body || '';

    // Create the email message
    const message = {
      raw: Buffer.from(
        `To: ${to}\r\n` +
        `From: ${userEmail}\r\n` +
        `Subject: ${subject}\r\n` +
        `MIME-Version: 1.0\r\n` +
        `Content-Type: multipart/alternative; boundary="boundary"\r\n\r\n` +
        `--boundary\r\n` +
        `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
        `${sendBody}\r\n\r\n` +
        `--boundary\r\n` +
        `Content-Type: text/html; charset="UTF-8"\r\n\r\n` +
        `${htmlBody}\r\n\r\n` +
        `--boundary--`
      ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    };

    // Send the email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: message
    });

    console.log('Email sent successfully:', response.data.id);

    // Store the sent email in our database with tracking info
    const { error: dbError } = await supabase
      .from('sent_emails')
      .insert({
        id: trackingId,
        tracking_id: trackingId,
        user_email: userEmail,
        to_email: to,
        subject,
        body: sendBody,
        html_body: htmlBody,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Error storing sent email:', dbError);
    }

    res.json({ 
      success: true, 
      messageId: response.data.id,
      trackingId: trackingId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Endpoint for browser extension to report sent emails
app.post('/api/extension/email-sent', async (req, res) => {
  try {
    console.log('[EXTENSION API] Received email-sent POST:', req.body);
    // Accept both 'to' and 'toAddress' for compatibility
    const to = req.body.to || req.body.toAddress;
    const subject = req.body.subject;
    const trackingId = req.body.trackingId;
    const userEmail = req.body.userEmail || 'unknown';
    const extensionBody = req.body.body || '';
    if (!to || !subject || !trackingId) {
      console.log('[EXTENSION API] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store in sent_emails table
    const { error } = await supabase
      .from('sent_emails')
      .upsert({
        id: trackingId,
        tracking_id: trackingId,
        user_email: userEmail,
        to_email: to,
        subject,
        body: extensionBody,
        html_body: '',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('[EXTENSION API] Supabase error:', error);
      return res.status(500).json({ error: 'Failed to store sent email' });
    }

    console.log('[EXTENSION API] Email stored successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('[EXTENSION API] Extension email-sent error:', error);
    res.status(500).json({ error: 'Failed to process extension email' });
  }
});

// --- Tracking Pixel Endpoint (public, no auth required) ---
app.get('/api/pixel', (req, res) => {
  const trackingId = req.query.id;
  console.log(`[TRACKING] Pixel loaded for ID: ${trackingId} at ${new Date().toISOString()}`);
  // Return a 1x1 transparent GIF
  const pixel = Buffer.from([
    71,73,70,56,57,97,1,0,1,0,128,0,0,0,0,0,255,255,255,33,249,4,1,0,0,1,0,44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59
  ]);
  res.set({
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-store',
  });
  res.send(pixel);
});

// --- API: Get all sent emails with analytics ---
app.get('/api/sent-emails', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    console.log(`[API] Fetching sent emails for user: ${email}`);

    // Fetch sent emails for this specific user only
    const { data: emails, error } = await supabase
      .from('sent_emails')
      .select('*')
      .eq('user_email', email)  // Filter by user email
      .order('sent_at', { ascending: false });
      
    if (error) {
      console.error('[API] Error fetching sent emails:', error);
      return res.status(500).json({ error: 'Failed to fetch sent emails' });
    }

    console.log(`[API] Found ${emails?.length || 0} sent emails for user: ${email}`);

    // For each email, fetch open events and build analytics
    const emailsWithAnalytics = await Promise.all(
      emails.map(async (email) => {
        // Fetch open events for this email (all opens, ordered chronologically)
        const { data: allOpens, error: opensError } = await supabase
          .from('opens')
          .select('*')
          .eq('tracking_id', email.tracking_id)
          .order('opened_at', { ascending: true }); // Order by earliest first

        if (opensError) {
          console.error('Error fetching opens:', opensError);
        }

        // Remove the very first open (chronologically), count all the rest
        const validOpens = allOpens && allOpens.length > 0 ? allOpens.slice(1) : [];
        
        if (allOpens && allOpens.length > 0) {
          console.log(`Ignoring first open (${allOpens[0].opened_at}) for tracking ID: ${email.tracking_id}`);
        }

        const openCount = validOpens.length;
        const lastOpened = validOpens[validOpens.length - 1]?.opened_at || null;

        // Get device analytics (only from valid opens)
        const deviceStats = {};
        const locationStats = {};
        
        validOpens.forEach(open => {
          // Device stats
          const deviceType = open.device_type || 'unknown';
          deviceStats[deviceType] = (deviceStats[deviceType] || 0) + 1;
          
          // Location stats
          const location = open.ip_address || 'unknown';
          locationStats[location] = (locationStats[location] || 0) + 1;
        });

        // Simple categorization
        const tags = categorizeEmail(email.subject, email.to_email, email.body);

        return {
          id: email.id,
          to: email.to_email,
          subject: email.subject,
          body: email.body,
          date: email.sent_at || email.created_at,
          analytics: {
            opens: openCount,
            lastOpened,
            devices: Object.entries(deviceStats).map(([type, count]) => ({ type, count })),
            locations: Object.entries(locationStats).map(([location, count]) => ({ location, count })),
            openHistory: validOpens.map(open => ({
              timestamp: open.opened_at,
              device: open.device_type,
              browser: open.browser,
              os: open.os,
              location: open.ip_address
            }))
          }
        };
      })
    );
    res.json(emailsWithAnalytics);
  } catch (err) {
    console.error('[API] Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 