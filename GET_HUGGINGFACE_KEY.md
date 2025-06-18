# How to Get a Free Hugging Face API Key

To fix the email summarization, you need a free Hugging Face API key:

## Steps:

1. **Go to Hugging Face**: Visit https://huggingface.co/
2. **Sign up/Login**: Create an account or log in
3. **Get API Key**: 
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Give it a name like "Mailed Email Summarizer"
   - Select "Read" role
   - Click "Generate token"
4. **Copy the key**: It will look like `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
5. **Add to your .env file**: Replace `your_huggingface_api_key` with your actual key

## Example .env file:
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Why this fixes the issue:
- The demo key (`hf_demo`) has very limited usage
- Your own free key gives you 30,000 requests per month
- This will make the AI summarization work properly

After adding the key, restart your server and the email summaries should work! 