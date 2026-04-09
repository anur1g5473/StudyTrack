# 📱 PWA Setup Guide for StudyTrack

Your StudyTrack app is now ready to be installed as a Progressive Web App (PWA) on phones and tablets!

## What is a PWA?

A Progressive Web App is a web application that can be installed on your home screen like a native app, with features like:
- 📱 **Installable** - Add to home screen on Any device
- 🔋 **Offline Support** - Works even without internet
- 🔔 **Push Notifications** - Get alerts for study reminders
- ⚡ **Fast Loading** - Cached assets load instantly
- 🎨 **App-like Experience** - No browser address bar

## Setup Instructions

### Step 1: Convert Icons to PNG

The app includes SVG icon files that need to be converted to PNG format. Choose one method:

#### Method 1: Automatic (Recommended)
```bash
# Install the image conversion library
npm install sharp

# Run the conversion script
node convert-icons.js
```

#### Method 2: Online Converter
1. Visit https://convertio.co/svg-png/
2. Upload `public/icons/icon-192x192.svg`
3. Download the PNG file
4. Save as `public/icons/icon-192x192.png`
5. Repeat for `public/icons/icon-512x512.svg`

#### Method 3: Browser Converter
Open the included `icon-converter.html` file in your browser for an interactive conversion tool.

### Step 2: Verify File Structure

Make sure these files exist:
```
public/
├── manifest.json          ✅ (created)
├── favicon.svg            ✅ (created)
├── sw.js                  ✅ (created)
├── icons/
│   ├── icon-192x192.svg   ✅ (created)
│   ├── icon-192x192.png   ⚠️  (NEEDS conversion)
│   ├── icon-512x512.svg   ✅ (created)
│   └── icon-512x512.png   ⚠️  (NEEDS conversion)
```

### Step 3: Test the PWA

1. Run your development server:
```bash
npm run dev
```

2. Open in Chrome/Edge:
   - Look for "Install" button in address bar
   - Or: Chrome Menu → Install app

3. Open in Firefox:
   - Long press home icon → Install

### Step 4: Install on Your Phone

#### iPhone (iOS 16.4+)
1. Open Safari
2. Visit your StudyTrack URL
3. Tap Share icon (⬆️)
4. Tap "Add to Home Screen"
5. Confirm and select location

#### Android
1. Open Chrome/Firefox
2. Visit your StudyTrack URL
3. Tap Menu (⋮)
4. Tap "Install app"
5. Confirm installation

## Features After Installation

### ✅ Offline Support
- Service worker caches essential assets
- App loads even without internet connection
- Supabase API calls require internet (expected)

### 📱 App-Like Experience
- Full screen application (no browser UI)
- Runs from home screen
- Splash screen on launch
- Custom app icon

### 🔔 Push Notifications (Coming Soon)
- Get alerted for study reminders
- Streak milestone notifications
- Subject completion alerts

### ⚡ Performance
- Instant loading from cache
- Network-first strategy for fresh data
- Fallback to cached content offline

## Troubleshooting

### "Install button not showing"
- Install button only appears in Chromium browsers (Chrome, Edge)
- Use "Add to Home Screen" on Safari/Firefox
- Ensure manifest.json exists and is linked in index.html

### "Icon not displaying correctly"
- Make sure PNG files are in `public/icons/`
- Check that filenames match manifest.json exactly
- Try clearing cache: DevTools → Application → Clear storage

### "Service Worker not registering"
- Check browser console for errors
- Ensure sw.js is in the public folder
- HTTPS is required for PWAs (localhost works for testing)

### "Offline page showing but I have internet"
- This might be a caching issue
- Try: DevTools → Application → Clear storage → Reload

## Files Created/Modified

### New Files
- `public/manifest.json` - App metadata
- `public/sw.js` - Service worker for offline support
- `public/favicon.svg` - App favicon
- `public/icons/icon-192x192.svg` - 192x192 icon (needs PNG conversion)
- `public/icons/icon-512x512.svg` - 512x512 icon (needs PNG conversion)
- `convert-icons.js` - Script to convert SVG to PNG
- `icon-converter.html` - Browser-based converter tool

### Modified Files
- `index.html` - Added manifest link, viewport adjustments, service worker registration

## Next Steps

1. ✅ Convert icons using one of the three methods
2. ✅ Test the app in development (npm run dev)
3. ✅ Install on your phone/tablet
4. ✅ Test offline functionality
5. ✅ Deploy to production

## Production Deployment

For production deployment ensure:
- ✅ App is served over HTTPS
- ✅ All PNG icons are included
- ✅ Manifest.json is accessible
- ✅ Service worker is registered
- ✅ index.html has correct viewport meta tags

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/)
- [Web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Manifest.json Reference](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Check Application tab for service worker status
3. Ensure all files are in correct locations
4. Clear cache and reload

---

**Happy studying! 📚** Your StudyTrack PWA is ready to install and use offline.
