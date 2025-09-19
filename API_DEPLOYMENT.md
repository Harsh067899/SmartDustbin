# Smart Dustbin API Server - Render Deployment

## Quick Deploy to Render.com (Free)

1. **Create Render Account**: Go to https://render.com and sign up
2. **Connect GitHub**: Link your GitHub account
3. **Create Web Service**: 
   - Click "New +" → "Web Service"
   - Connect your `SmartDustbin` repository
   - Use these settings:

### Render Configuration
```
Name: smart-dustbin-api
Environment: Node
Region: Any (closest to you)
Branch: main
Build Command: npm run build
Start Command: npm start
```

### Environment Variables on Render
```
PORT=10000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
DATABASE_URL=(optional - leave blank for memory mode)
```

4. **Deploy**: Click "Create Web Service" 
5. **Copy URL**: After deployment, copy your service URL (e.g., `https://smart-dustbin-api.onrender.com`)

## Alternative: Railway.app
```
Build Command: npm run build  
Start Command: npm start
Environment Variables:
- PORT: $PORT (auto-set by Railway)
- ALLOWED_ORIGINS: https://your-vercel-app.vercel.app
```

## Alternative: Fly.io
```bash
flyctl launch  # Follow prompts
flyctl deploy
```

## Then Configure Vercel
Once your API is deployed, set these environment variables on Vercel:
```
VITE_API_BASE_URL=https://your-api-server-url.com
VITE_WS_URL=wss://your-api-server-url.com/ws
```