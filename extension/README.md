# 📧 Mailed Gmail Tracker Extension

**Auto-inject tracking pixels into your Gmail messages for real-time email analytics**

## 🚀 Features

- ✅ **Automatic Tracking**: Automatically injects invisible tracking pixels into your Gmail messages
- ✅ **Real-time Analytics**: See when emails are opened, device types, and location data
- ✅ **Seamless Integration**: Works directly within Gmail's interface
- ✅ **Privacy-Focused**: Only tracks emails you send, not received ones
- ✅ **Professional Analytics**: View detailed reports in your Mailed dashboard

## 📥 Installation

### Option 1: Direct Install (Recommended)
1. Download the extension from [mailed.netlify.app](https://mailed.netlify.app)
2. Extract the ZIP file to a folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked" and select the extracted folder

### Option 2: From Source
```bash
git clone https://github.com/divyanshkhurana06/mailed0.git
cd mailed0/extension
# Load the extension folder in Chrome
```

## 🔧 How It Works

1. **Compose Email**: Write your email in Gmail as usual
2. **Auto-Injection**: Extension automatically injects a 1x1 tracking pixel
3. **Send Email**: Send your email normally
4. **Track Opens**: View analytics in your [Mailed dashboard](https://mailed.netlify.app)

## 📊 Analytics Available

- **Open Count**: Number of times email was opened
- **Device Detection**: Desktop vs Mobile opens
- **Location Data**: IP-based location tracking
- **Time Stamps**: When emails were opened
- **Engagement Patterns**: Opening behavior analysis

## 🛡️ Privacy & Security

- ✅ Only works with emails you send
- ✅ No access to received emails or sensitive data
- ✅ Minimal permissions required
- ✅ Open-source and transparent
- ✅ Secure HTTPS communication

## 🔗 Requirements

- Chrome browser (latest version)
- Gmail account
- Free Mailed account at [mailed.netlify.app](https://mailed.netlify.app)

## 📞 Support

If you encounter any issues:

1. Make sure Developer mode is enabled in Chrome extensions
2. Verify you're using Gmail in the browser (not the app)  
3. Check that the extension is enabled in `chrome://extensions/`
4. Sign into your Mailed account to view analytics

## 🏗️ Technical Details

- **Manifest Version**: 3
- **Permissions**: `scripting`, `storage`, `activeTab`
- **Host Permissions**: `https://mail.google.com/*`
- **Backend**: Connects to Mailed API for analytics

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details

## 🌟 Built With

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Gmail DOM Manipulation
- Mailed Analytics API

---

**Made with ❤️ by [Divyansh Khurana](https://github.com/divyanshkhurana06)**

*Part of the Mailed ecosystem - AI-powered email tracking and analytics* 