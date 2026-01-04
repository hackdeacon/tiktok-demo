# TikTok Video Downloader 🎵

A modern, web-based TikTok video downloader that allows you to download TikTok videos without watermarks. Built with pure HTML, CSS, and JavaScript - no frameworks, no backend required!

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://github.com/yourusername/tiktok-downloader)

## ✨ Features

- 🎬 Download TikTok videos without watermark
- 🎵 Extract audio from TikTok videos
- 🚀 Fast and free to use
- 📱 Responsive design - works on all devices
- 🔒 Privacy-focused - no data stored
- 🎨 Beautiful, modern UI with gradient background
- ⚡ Pure frontend - no server needed!

## 🚀 Quick Start

### Local Development

Simply open `index.html` in your browser - that's it! No build tools or dependencies needed.

Or use a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx serve
```

Then open http://localhost:8000 in your browser.

## 📦 Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. Fork or clone this repository
2. Go to your repository settings on GitHub
3. Navigate to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Push to the `main` branch - the site will auto-deploy!

Your site will be available at: `https://yourusername.github.io/tiktok-downloader`

### Manual Deployment

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **main** branch and **/ (root)** folder
4. Click **Save**

Wait a few minutes and your site will be live!

## 🛠️ Project Structure

```
tiktok-downloader/
├── index.html              # Main HTML file
├── style.css              # Styles
├── script.js              # Frontend JavaScript (calls TikTok API directly)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow
├── .gitignore
└── README.md              # Documentation
```

## 🔧 How It Works

1. **Frontend**: User enters a TikTok video URL
2. **API Call**: JavaScript directly calls free TikTok API (TikWM)
3. **Processing**: API fetches video data without watermark
4. **Response**: Video information and download links are returned
5. **Download**: User can download video or audio

No backend server needed - everything runs in the browser!

## 📝 Usage Instructions

1. Open the TikTok app or website
2. Find the video you want to download
3. Tap the **Share** button
4. Copy the link
5. Paste it in the downloader
6. Click **Download**
7. Choose to download video or audio

## 🌐 Supported TikTok URL Formats

- `https://www.tiktok.com/@username/video/1234567890`
- `https://vm.tiktok.com/xxxxx`
- `https://vt.tiktok.com/xxxxx`
- `https://tiktok.com/t/xxxxx`

## ⚠️ Important Notes

- This tool is for **personal use only**
- Please respect content creators' rights
- Don't use downloaded content for commercial purposes
- Some videos may not be downloadable due to privacy settings
- The tool uses third-party API (TikWM) which may have rate limits

## 🔒 Privacy

- ✅ No user data is collected or stored
- ✅ URLs are processed in real-time
- ✅ No tracking or analytics
- ✅ 100% client-side processing
- ✅ No server logs or databases

## 🛡️ Legal Disclaimer

This tool is provided for educational purposes only. Users are responsible for complying with TikTok's Terms of Service and respecting intellectual property rights. The developers are not responsible for any misuse of this tool.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Troubleshooting

**Video won't download:**
- Check if the URL is correct and properly formatted
- Make sure the video is public
- Try copying the URL again
- Some private or age-restricted videos cannot be downloaded
- Check browser console for errors (F12)

**CORS errors:**
- The free API has CORS enabled, but some browsers may block requests
- Try using a different browser
- Make sure you're accessing via HTTP/HTTPS (not file://)

**API errors:**
- The third-party API (TikWM) may be temporarily down
- Rate limits may have been reached
- Try again after a few minutes
- Check if the TikTok video still exists

**Download not starting:**
- Some browsers block automatic downloads
- Check if pop-ups/downloads are blocked
- Try right-click → "Save link as..."

## 🔗 Links

- [TikTok](https://www.tiktok.com)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Report Issues](https://github.com/yourusername/tiktok-downloader/issues)

## 💡 Credits

- Uses [TikWM API](https://www.tikwm.com) for video processing
- Built with vanilla JavaScript - no frameworks needed!
- Free third-party API with CORS support
- Deployed on GitHub Pages - 100% free hosting

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

Made with ❤️ | Please use responsibly
