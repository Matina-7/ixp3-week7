# WINDOW - Deployment Guide

This document explains how to deploy the WINDOW interactive narrative experience to GitHub Pages.

## Quick Start

The project is configured for automatic deployment to GitHub Pages. Two deployment methods are available:

### Method 1: Static Deployment (Recommended)
**Best for:** Pure JavaScript applications (like WINDOW)

This method bypasses Jekyll and serves files as-is.

**Configuration:**
- `.nojekyll` file is present (tells GitHub Pages to skip Jekyll)
- GitHub Actions workflow: `.github/workflows/static.yml`

**How it works:**
1. Push to `main`, `master`, or any `claude/*` branch
2. GitHub Actions automatically deploys the site
3. No build process - files are served directly

### Method 2: Jekyll Deployment
**Best for:** Sites using Jekyll features (themes, templates, etc.)

This method processes files through Jekyll before deployment.

**Configuration:**
- `_config.yml` file configures Jekyll settings
- GitHub Actions workflow: `.github/workflows/pages.yml`

**How it works:**
1. Push to `main` or `master` branch
2. GitHub Actions builds the site with Jekyll
3. Built files are deployed to GitHub Pages

## Choosing the Right Method

**Use Static Deployment if:**
- ✅ You have a pure HTML/CSS/JavaScript site (recommended for WINDOW)
- ✅ You use ES6 modules (`import`/`export`)
- ✅ You don't need Jekyll's templating features
- ✅ You want faster deployments

**Use Jekyll Deployment if:**
- ✅ You need Jekyll's templating system
- ✅ You want to use Jekyll themes
- ✅ You need Markdown-to-HTML conversion
- ✅ You use Jekyll plugins

## GitHub Pages Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
4. Save the settings

### 2. Choose Workflow

**For Static Deployment (Recommended):**
- Keep `.nojekyll` file
- Use `.github/workflows/static.yml`
- Delete or disable `.github/workflows/pages.yml`

**For Jekyll Deployment:**
- Remove `.nojekyll` file
- Use `.github/workflows/pages.yml`
- Delete or disable `.github/workflows/static.yml`

### 3. Push to Deploy

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The site will be available at:
```
https://<username>.github.io/<repository>/
```

## Configuration Files

### `.nojekyll`
```
# Tells GitHub Pages to bypass Jekyll processing
# Use for static sites
```

### `_config.yml`
```yaml
# Jekyll configuration
# Defines build settings, exclusions, and plugins
```

### `.gitattributes`
```
# Ensures proper line ending handling
# Important for cross-platform compatibility
```

### `.gitignore`
```
# Excludes build artifacts and temporary files
# Keeps repository clean
```

## GitHub Actions Workflows

### Static Workflow (`.github/workflows/static.yml`)

**Triggers:**
- Push to `main`, `master`, or `claude/*` branches
- Manual trigger via Actions tab

**Steps:**
1. Checkout code
2. Setup Pages
3. Upload entire repository as artifact
4. Deploy to Pages

**Deployment time:** ~30 seconds

### Jekyll Workflow (`.github/workflows/pages.yml`)

**Triggers:**
- Push to `main` or `master` branch
- Manual trigger via Actions tab

**Steps:**
1. Checkout code
2. Setup Pages
3. Build with Jekyll
4. Upload built site as artifact
5. Deploy to Pages

**Deployment time:** ~1-2 minutes

## Troubleshooting

### Issue: 404 Error on Deployment

**Cause:** `index.html` not in root directory
**Solution:** Ensure `index.html` is at the repository root

### Issue: ES6 Modules Not Working

**Cause:** Jekyll processing JavaScript files
**Solution:**
1. Add `.nojekyll` file
2. Use static deployment workflow
3. Add to `_config.yml` if using Jekyll:
   ```yaml
   exclude:
     - js/
     - scripts/
   ```

### Issue: Videos Not Loading

**Cause:** Large files or incorrect paths
**Solution:**
1. Check file paths are relative (e.g., `videos/feed1.webm`)
2. Ensure videos are committed to repository
3. Consider using Git LFS for large files

### Issue: Deployment Fails

**Cause:** Various - check workflow logs
**Solution:**
1. Go to **Actions** tab on GitHub
2. Click on the failed workflow run
3. Review error logs
4. Common fixes:
   - Check file permissions
   - Verify workflow syntax
   - Ensure Pages is enabled in Settings

### Issue: CORS Errors

**Cause:** GitHub Pages serves with strict CORS headers
**Solution:**
- ES6 modules require proper MIME types
- GitHub Pages handles this automatically
- If issues persist, verify `<script type="module">` is used

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to repository root:
   ```
   www.yourdomain.com
   ```

2. Configure DNS settings:
   ```
   Type: CNAME
   Name: www
   Value: <username>.github.io
   ```

3. Enable "Enforce HTTPS" in Settings → Pages

## Local Testing

Test the site locally before deploying:

### Using Python
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

### Using Node.js (http-server)
```bash
npx http-server -p 8000
# Visit: http://localhost:8000
```

### Using Jekyll (if using Jekyll deployment)
```bash
bundle install
bundle exec jekyll serve
# Visit: http://localhost:4000
```

## Monitoring Deployments

1. **Actions Tab:**
   - View all workflow runs
   - Check deployment status
   - Review logs for errors

2. **Environments:**
   - Go to repository → **Environments**
   - View deployment history
   - See active deployments

3. **Pages Settings:**
   - Shows current deployment URL
   - Displays last deployment time
   - Shows custom domain status

## Best Practices

1. **Branch Strategy:**
   - Use `main` for production
   - Use `claude/*` branches for development
   - Test before merging to main

2. **File Organization:**
   - Keep HTML files in root
   - Organize assets in subdirectories
   - Use consistent naming

3. **Performance:**
   - Compress images/videos
   - Minify CSS/JavaScript (optional)
   - Use efficient video codecs (WebM)

4. **Version Control:**
   - Commit small, focused changes
   - Write descriptive commit messages
   - Tag releases for major versions

## Environment Variables

GitHub Pages doesn't support server-side environment variables. For client-side configuration:

```javascript
// config.js
const CONFIG = {
    baseURL: window.location.hostname === 'localhost'
        ? '/'
        : '/repository-name/',
    apiEndpoint: 'https://api.example.com'
};
```

## Security Considerations

1. **Sensitive Data:**
   - Never commit API keys or secrets
   - Use `.gitignore` for sensitive files
   - Client-side code is publicly visible

2. **HTTPS:**
   - Always enforce HTTPS in Pages settings
   - Use relative URLs for resources

3. **Dependencies:**
   - Use CDN for external libraries
   - Verify CDN integrity with SRI hashes
   - Keep dependencies updated

## Maintenance

### Regular Tasks

1. **Update Dependencies:**
   - Check CDN library versions
   - Update Typed.js if needed
   - Review security advisories

2. **Monitor Performance:**
   - Check page load times
   - Optimize video files
   - Review console errors

3. **Content Updates:**
   - Update documentation
   - Refresh README files
   - Maintain changelog

## Support

For issues specific to:
- **GitHub Pages:** https://docs.github.com/pages
- **GitHub Actions:** https://docs.github.com/actions
- **Jekyll:** https://jekyllrb.com/docs/

For project-specific issues, check the repository issues page.

---

## Current Configuration

**Deployment Method:** Static (Recommended)

**Active Files:**
- ✅ `.nojekyll` - Bypass Jekyll
- ✅ `.github/workflows/static.yml` - Static deployment
- ✅ `.github/workflows/pages.yml` - Jekyll deployment (alternative)
- ✅ `_config.yml` - Jekyll config (if needed)
- ✅ `.gitattributes` - Line ending handling
- ✅ `.gitignore` - File exclusions

**Status:** Ready for deployment to GitHub Pages

**Next Steps:**
1. Push to `main` or `master` branch
2. Enable GitHub Pages in repository settings
3. Select "GitHub Actions" as source
4. Wait for deployment to complete (~30 seconds)
5. Visit your site at the provided URL

---

**Last Updated:** 2025-11-09
**Version:** 1.0
