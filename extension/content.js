// == Mailed Gmail Tracker Content Script ==
// This script runs on mail.google.com, detects when an email is sent, injects a tracking pixel, and reports to backend.

const BACKEND_URL = 'http://localhost:3000/api/extension/email-sent';
const TRACKING_PIXEL_BASE = 'http://localhost:3000/api/open?id=';

let lastComposeData = null;

// Utility to generate a unique tracking ID
function generateTrackingId() {
  return 'track_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Observe DOM for sent emails
function observeGmailSend() {
  console.log('[Mailed Extension] Setting up MutationObserver for Gmail send events');
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const text = node.textContent?.trim();
          if (text && text.toLowerCase().includes('message sent')) {
            console.log('[Mailed Extension] Detected "Message sent" node:', text);
            // Use the data we captured on send-click
            setTimeout(processLastSentDraft, 200);
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function observeAndCaptureSendClick() {
  console.log('[Mailed Extension] Setting up general click listener to find Send button.');
  document.body.addEventListener('click', (event) => {
    let target = event.target;
    // Traverse up the DOM to find the button element, as the click might be on an icon inside it
    for (let i = 0; i < 5 && target; i++) {
       const ariaLabel = target.getAttribute('aria-label');
       const dataTooltip = target.getAttribute('data-tooltip');
       const text = target.textContent?.trim().toLowerCase();

       // Log details of the element path to help debug
       console.log(`[Mailed Extension] Click Path [${i}]:`, {
         tag: target.tagName,
         ariaLabel: ariaLabel,
         dataTooltip: dataTooltip,
         text: text.slice(0, 50),
       });

      // Check if the element is the send button
      if (
        (ariaLabel && ariaLabel.toLowerCase() === 'send') ||
        (dataTooltip && dataTooltip.toLowerCase() === 'send') ||
        (text === 'send')
      ) {
        console.log('[Mailed Extension] "Send" button clicked!');
        const composeWin = target.closest('div[role="dialog"]');
        if (composeWin) {
          const bodyElem = composeWin.querySelector('[aria-label="Message Body"]');
          const toElem = composeWin.querySelector('textarea[name="to"]');
          const subjectElem = composeWin.querySelector('input[name="subjectbox"]');
          if (bodyElem && toElem && subjectElem) {
            // Save the compose data globally
            lastComposeData = {
              body: bodyElem.innerHTML,
              to: toElem.value,
              subject: subjectElem.value
            };
            console.log('[Mailed Extension] Successfully captured compose data:', lastComposeData);
          } else {
            console.error('[Mailed Extension] Could not find all compose fields (to, subject, body).');
          }
        } else {
            console.error('[Mailed Extension] Could not find parent compose window for Send button.');
        }
        return; // Stop after finding the button
      }
      target = target.parentElement;
    }
  }, true); // Use capture phase to catch the click early
}

// Find the last sent draft and inject tracking pixel
function processLastSentDraft() {
  if (!lastComposeData) {
    console.log('[Mailed Extension] No pre-captured compose data found. Something was missed.');
    return;
  }
  let { body, to, subject } = lastComposeData;
  lastComposeData = null; // Clear after use

  let trackingId = generateTrackingId();
  const pixelTag = `<img src="${TRACKING_PIXEL_BASE}${trackingId}" width="1" height="1" style="display:none;" alt="" />`;

  // Inject pixel into the captured body
  body += pixelTag;
  console.log('[Mailed Extension] Injected tracking pixel into captured body.');

  // Send to backend
  console.log('[Mailed Extension] Sending captured email data to backend:', {
    to,
    subject,
    trackingId
  });
  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body, trackingId })
  })
    .then(res => res.json())
    .then(data => console.log('[Mailed Extension] Backend response:', data))
    .catch(err => console.error('[Mailed Extension] Error sending to backend:', err));
}

// Start observing when Gmail is ready
function waitForGmail() {
  if (document.querySelector('div[role="main"]')) {
    console.log('[Mailed Extension] Gmail detected, starting all observers.');
    observeGmailSend();
    observeAndCaptureSendClick();
  } else {
    setTimeout(waitForGmail, 1000);
  }
}

waitForGmail(); 