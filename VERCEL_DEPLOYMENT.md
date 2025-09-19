# Smart Dustbin - Vercel Serverless Deployment Guide

## ✅ What's been done

### 🔧 Converted to Serverless Architecture
- **Express server → Vercel API routes**: All `/api/*` endpoints now work as serverless functions
- **WebSocket → Polling**: Real-time updates now use HTTP polling (every 2 seconds)
- **Same-origin API**: No need for `VITE_API_BASE_URL` - everything runs on same domain
- **Auto-simulation**: Polling automatically triggers simulation updates when running

### 📁 New Structure
```
api/
  bins.ts                    # GET /api/bins
  bins/[binId]/readings.ts   # GET /api/bins/{id}/readings  
  simulation/
    config.ts                # GET/PATCH /api/simulation/config
    start.ts                 # POST /api/simulation/start
    stop.ts                  # POST /api/simulation/stop
    reset.ts                 # POST /api/simulation/reset
    trigger.ts               # POST /api/simulation/trigger (internal)
```

## 🚀 Deploy to Vercel

### Option 1: Quick Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harsh067899/SmartDustbin)

### Option 2: Manual Deploy
1. **Push your changes**:
   ```bash
   git add .
   git commit -m "Convert to Vercel serverless deployment"
   git push
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel auto-detects settings from `vercel.json`

3. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app will be live at `https://your-project.vercel.app`

## 🧪 Test Your Deployment

1. **Visit your Vercel URL**
2. **You should see**: "Smart Dustbin Monitor - SIH Project" page title
3. **Dashboard should load**: With dustbin animation and controls
4. **Test simulation**: 
   - Click "Start Simulation"
   - Watch fill levels update every 2 seconds
   - Try "Reset" and "Stop" buttons

## 🔄 How It Works Now

### Real-time Updates (Serverless Style)
- **Frontend polls** `/api/simulation/config` every 2 seconds
- **If simulation running**: Frontend triggers `/api/simulation/trigger`
- **Simulation updates**: Bin levels, status, readings stored in memory
- **Frontend polls** `/api/bins` for latest data
- **Simulates WebSocket**: Via polling + state comparison

### Data Persistence
- **Development**: In-memory storage (resets on redeploy)
- **Production**: Add `DATABASE_URL` environment variable for Neon/Postgres

## ⚙️ Environment Variables (Optional)

None required! Everything works out of the box.

**Optional for production database**:
```
DATABASE_URL=your_neon_postgres_url
```

## 🐛 Troubleshooting

### "API Connection Issue" error
- **Cause**: Serverless functions not deploying properly
- **Fix**: Check Vercel dashboard → Functions tab for errors

### Simulation not updating
- **Cause**: JavaScript disabled or network issues
- **Fix**: Enable JavaScript, check browser console for errors

### Build fails
- **Cause**: TypeScript errors in API routes
- **Fix**: Run `npm run check` locally to debug

## 🎯 Key Benefits of Serverless

✅ **No server maintenance**  
✅ **Auto-scaling**  
✅ **Free tier generous**  
✅ **Fast global CDN**  
✅ **One-click deployment**  
✅ **Automatic HTTPS**  
✅ **Git-based deployments**

## 📊 Performance Notes

- **Polling interval**: 2 seconds (adjustable in `useWebSocket.ts`)
- **Serverless cold starts**: ~200-500ms first request
- **Memory storage**: Resets on deployment (use DATABASE_URL for persistence)

Your Smart Dustbin Monitor is now ready for production! 🎉