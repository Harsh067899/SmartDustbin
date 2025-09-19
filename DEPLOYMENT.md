# Smart Dustbin Monitor - Deployment Guide

## Issues Fixed
✅ Added proper HTML title: "Smart Dustbin Monitor - SIH Project"  
✅ Moved `cors` from devDependencies to dependencies  
✅ Added better error handling for API connectivity issues  
✅ Added environment configuration examples  

## Quick Deployment Steps

### 1. Frontend (Vercel)
1. Push your changes to GitHub
2. Connect your GitHub repo to Vercel
3. Set these Environment Variables in Vercel:
   ```
   VITE_API_BASE_URL=https://your-api-server.com
   VITE_WS_URL=wss://your-api-server.com/ws
   ```
4. Deploy (Vercel auto-detects build settings from vercel.json)

### 2. Backend (Render/Railway/Fly.io)
1. Create a new Web Service
2. Connect your GitHub repo 
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Set Environment Variables:
   ```
   PORT=10000
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   DATABASE_URL=your_postgres_url (optional)
   ```

## Local Testing
```bash
npm run build  # Test build works
npm run check  # Verify TypeScript
```

## Common Issues & Solutions

### "Loading dashboard..." forever
- **Cause**: Frontend can't reach API server
- **Fix**: Set `VITE_API_BASE_URL` environment variable on Vercel

### CORS errors in browser console  
- **Cause**: API server not allowing Vercel origin
- **Fix**: Set `ALLOWED_ORIGINS=https://your-app.vercel.app` on API server

### API server won't start
- **Cause**: Missing dependencies or port issues
- **Fix**: Ensure `cors` is in dependencies (not devDependencies)

## Test Your Deployment
1. Visit your Vercel URL
2. You should see "Smart Dustbin Monitor - SIH Project" in the browser tab
3. If API is connected: dashboard with dustbin animation
4. If API is disconnected: error message with troubleshooting tips

## Environment Variables Summary

**Vercel (Frontend):**
- `VITE_API_BASE_URL`: Your API server URL
- `VITE_WS_URL`: WebSocket URL (optional)

**API Server:**  
- `PORT`: Server port (e.g., 10000)
- `ALLOWED_ORIGINS`: Your Vercel app URL
- `DATABASE_URL`: Database connection (optional - uses memory if unset)