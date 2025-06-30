# Adding Your Photo to the About Page

To add your photo to the About page, please follow these steps:

1. **Create the images directory** (if it doesn't exist):
   ```bash
   mkdir -p public/images
   ```

2. **Add your photo**:
   - Save your photo as `divyansh-photo.jpg` in the `public/images/` directory
   - The photo should be square (1:1 aspect ratio) for best results
   - Recommended size: 512x512 pixels or larger
   - Supported formats: JPG, PNG, WebP

3. **File path**:
   ```
   public/images/divyansh-photo.jpg
   ```

4. **Alternative**: If you want to use a different filename or format, update the path in:
   ```
   src/components/About.tsx (line ~103)
   ```

The About page will automatically display your photo with a beautiful animated border. If the image fails to load, it will show a stylized "DK" placeholder with a gradient background.

## Current Status
- ✅ About page component created
- ✅ Animated UI with interactive features
- ✅ Responsive design
- ✅ Fallback handling for missing photo
- ⏳ Waiting for photo to be added to `public/images/divyansh-photo.jpg` 