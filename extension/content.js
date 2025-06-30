const BACKEND_URL = 'https://mailed0.onrender.com/api/extension/email-sent';
const TRACKING_PIXEL_BASE = 'https://mailed0.onrender.com/api/open?id=';

// This variable will hold the email data captured just before sending.
let lastComposeData = null;

// Utility to generate a unique ID for tracking.
function generateTrackingId() {
  // Generate a random 9-character string by padding and slicing.
  const randomPart = (Math.random().toString(36) + '000000000').slice(2, 11);
  return 'track_' + Date.now() + '_' + randomPart;
}

/**
 * Extract email address from Gmail's data-hovercard-id attribute
 * @param {string} hovercardId - The data-hovercard-id value
 * @returns {string} The clean email address
 */
function extractEmail(hovercardId) {
  // Gmail's data-hovercard-id is usually in the format: email@domain.com
  // But sometimes it might have additional parameters or encoding
  return hovercardId.split('?')[0].trim();
}

/**
 * Captures the To, Subject, and Body from a compose window right when
 * the user clicks the "Send" button.
 * @param {HTMLElement} composeWindow - The root DOM element of the compose window.
 */
function captureComposeData(composeWindow) {
  console.log('[Mailed Extension] Capturing compose data and injecting pixel...');

  try {
    // --- Find To recipients ---
    const toElements = composeWindow.querySelectorAll('div[name="to"] .afV[data-hovercard-id], div[name="to"] span[email]');
    const toAddresses = Array.from(toElements).map(el => {
      // Try both data-hovercard-id and email attribute
      const email = el.getAttribute('data-hovercard-id') || el.getAttribute('email');
      return email ? extractEmail(email) : null;
    }).filter(email => email && email.includes('@')); // Ensure valid email addresses

    const to = toAddresses.join(', ');

    // --- Find Subject ---
    const subjectElement = composeWindow.querySelector('input[name="subjectbox"]');
    const subject = subjectElement ? subjectElement.value.trim() : '';

    // --- Find Body ---
    const bodyElement = composeWindow.querySelector('div[role="textbox"][aria-label="Message Body"]');

    if (!to || !subjectElement || !bodyElement) {
      console.error('[Mailed Extension] Could not find all compose fields:', {
        hasTo: !!to,
        hasSubject: !!subjectElement,
        hasBody: !!bodyElement
      });
      return;
    }

    // Generate tracking ID and create pixel
    const trackingId = generateTrackingId();
    const randomCacheBuster = `&rand=${Math.random().toString(36).substr(2, 5)}`;
    const pixelImg = `<img src="${TRACKING_PIXEL_BASE}${trackingId}${randomCacheBuster}" width="1" height="1" alt="" border="0" style="border:0;" />`;
    
    // Log the current body content for debugging
    console.log('[Mailed Extension] Current body content:', bodyElement.innerHTML);
    
    // CRITICAL STEP: Inject the pixel directly into the message body as raw HTML
    bodyElement.innerHTML += pixelImg;

    // Store everything we need to send to the backend
    lastComposeData = {
      to: to,
      subject: subject,
      trackingId: trackingId,
      body: bodyElement.innerHTML
    };

    console.log('[Mailed Extension] Successfully captured data:', {
      to: to,
      subject: subject,
      trackingId: trackingId
    });

  } catch (error) {
    console.error('[Mailed Extension] Error in captureComposeData:', error);
  }
}

/**
 * Get the current Gmail user's email address
 * @returns {string} The user's email address
 */
function getCurrentUserEmail() {
  try {
    console.log('[Mailed Extension] Attempting to detect user email...');

    // Method 1: Check URL for user identification (most reliable)
    const urlMatch = window.location.href.match(/[/#]\/([^/]+)@([^/]+)/);
    if (urlMatch) {
      const email = `${urlMatch[1]}@${urlMatch[2]}`;
      console.log('[Mailed Extension] Found email from URL:', email);
      return email;
    }

    // Method 2: Look for account switcher or profile image with email
    const accountElements = document.querySelectorAll('[data-email], [email], [title*="@"], [aria-label*="@"]');
    for (const element of accountElements) {
      const email = element.getAttribute('data-email') || 
                   element.getAttribute('email') || 
                   element.getAttribute('title') || 
                   element.getAttribute('aria-label');
      
      if (email && email.includes('@')) {
        const emailMatch = email.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          console.log('[Mailed Extension] Found email from attributes:', emailMatch[1]);
          return emailMatch[1];
        }
      }
    }

    // Method 3: Check for Gmail settings or profile areas
    const profileSelectors = [
      'div[data-tooltip*="@"]',
      'span[data-tooltip*="@"]', 
      'div[title*="@"]',
      '[jsname="CG5Sme"]', // Gmail profile container
      '.gb_Eb', // Google bar profile
      '.gb_db', // Account menu
    ];

    for (const selector of profileSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent || element.getAttribute('title') || element.getAttribute('data-tooltip');
        if (text && text.includes('@')) {
          const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch) {
            console.log('[Mailed Extension] Found email from profile elements:', emailMatch[1]);
            return emailMatch[1];
          }
        }
      }
    }

    // Method 4: Look in page source/scripts for email (last resort)
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      if (script.textContent && script.textContent.includes('@gmail.com')) {
        const emailMatch = script.textContent.match(/(['"][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"])/);
        if (emailMatch) {
          const email = emailMatch[1].replace(/['"]/g, '');
          console.log('[Mailed Extension] Found email from scripts:', email);
          return email;
        }
      }
    }

    // Method 5: Check localStorage/sessionStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (value && value.includes('@')) {
          const emailMatch = value.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch) {
            console.log('[Mailed Extension] Found email from localStorage:', emailMatch[1]);
            return emailMatch[1];
          }
        }
      }
    } catch (e) {
      console.log('[Mailed Extension] Could not access localStorage');
    }

    console.warn('[Mailed Extension] Could not detect user email, using fallback');
    
    // Fallback: Try to extract from page title or other elements
    const pageTitle = document.title;
    if (pageTitle && pageTitle.includes('@')) {
      const emailMatch = pageTitle.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        console.log('[Mailed Extension] Found email from page title:', emailMatch[1]);
        return emailMatch[1];
      }
    }

    return 'unknown';
  } catch (error) {
    console.error('[Mailed Extension] Error getting user email:', error);
    return 'unknown';
  }
}

/**
 * Sends the captured email data to our backend for tracking.
 */
function sendTrackedEmail() {
  if (!lastComposeData) {
    console.log('[Mailed Extension] No compose data to send');
    return;
  }

  let userEmail = getCurrentUserEmail();
  
  // If we couldn't detect the email, prompt the user once and store it
  if (userEmail === 'unknown') {
    const storedEmail = localStorage.getItem('mailed_user_email');
    if (storedEmail) {
      userEmail = storedEmail;
      console.log('[Mailed Extension] Using stored email:', userEmail);
    } else {
      const promptedEmail = prompt('Mailed Extension: Please enter your Gmail address for tracking:');
      if (promptedEmail && promptedEmail.includes('@')) {
        userEmail = promptedEmail.trim();
        localStorage.setItem('mailed_user_email', userEmail);
        console.log('[Mailed Extension] Stored user email for future use:', userEmail);
      }
    }
  }

  const payload = {
    toAddress: lastComposeData.to,
    subject: lastComposeData.subject,
    trackingId: lastComposeData.trackingId,
    body: lastComposeData.body,
    userEmail: userEmail  // Include the sender's email
  };

  console.log('[Mailed Extension] Sending to backend:', payload);
  
  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(`Backend error (${response.status}): ${err.error || 'Unknown error'}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('[Mailed Extension] Successfully sent to backend:', data);
  })
  .catch(err => {
    console.error('[Mailed Extension] Backend error:', err);
  })
  .finally(() => {
    lastComposeData = null;
  });
}

/**
 * Sets up the core logic: a click listener to capture data, and a
 * mutation observer to know when the send is confirmed.
 */
function initialize() {
  console.log('[Mailed Extension] Initializing...');

  // Listen for clicks on the entire document
  document.body.addEventListener('click', (e) => {
    const sendButton = e.target.closest('div[role="button"][data-tooltip*="Send"]');
    if (sendButton) {
      const composeWindow = sendButton.closest('div.nH.Hd[role="dialog"]');
      if (composeWindow) {
        captureComposeData(composeWindow);
      }
    }
  }, { capture: true }); // Use capture phase to inject before Gmail sends

  // Watch for the "Message sent" notification
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && 
            (node.textContent.includes('Message sent') || 
             node.textContent.includes('Sending'))) {
          console.log('[Mailed Extension] Send confirmation detected');
          sendTrackedEmail();
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Wait for Gmail UI to load
const startupObserver = new MutationObserver(() => {
  if (document.querySelector('div[role="main"]')) {
    console.log('[Mailed Extension] Gmail UI ready, initializing extension');
    initialize();
    startupObserver.disconnect();
  }
});

startupObserver.observe(document.documentElement, { childList: true, subtree: true }); console.log("[Mailed Extension] VERSION 2 - PIXEL BASE:  + TRACKING_PIXEL_BASE + ");
console.log("[Mailed Extension] VERSION 2 - PIXEL BASE: " + TRACKING_PIXEL_BASE);
