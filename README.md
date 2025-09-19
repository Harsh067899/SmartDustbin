# 🗑️ Smart Dustbin Simulation

A comprehensive real-time dustbin monitoring and simulation system built for the Smart India Hackathon (SIH). This project provides live monitoring, analytics, and visualization of smart dustbin data with a modern web interface.

![Demo](https://img.shields.io/badge/Demo-Live-green) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue) ![Express](https://img.shields.io/badge/Express-4.21.2-green)

## ✨ Features

- 🎯 **Real-time Monitoring**: Live dustbin fill level tracking with WebSocket updates
- 📊 **Interactive Analytics**: Historical data visualization with charts and statistics  
- 🎨 **Animated Dashboard**: Dynamic 3D dustbin visualization with live data points
- 🌙 **Theme Support**: Light/Dark/System theme switching
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- ⚡ **Live Simulation**: Configurable data simulation with realistic patterns
- 📈 **Statistics & Insights**: Time to full predictions, fill rates, and peak analytics

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh067899/SmartDustbin.git
   cd SmartDustbin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5000`
   - The application will automatically start with sample data

## 🛠️ Development Setup

### Environment Variables (Optional)

The application works out-of-the-box with in-memory storage. For persistent data, create a `.env` file:

```env
# Optional: Database connection for persistent storage
DATABASE_URL=your_database_url_here

# Optional: Port configuration (default: 5000)
PORT=5000
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations (if using external DB)
npm run db:push
```

### Project Structure

```
SmartDustbinSim/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express server
│   ├── db.ts             # Database configuration
│   ├── storage.ts        # Data storage abstraction
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
└── package.json         # Dependencies and scripts
```

## 🎮 Usage Guide

### Dashboard Features

1. **Live Dustbin Monitor**
   - Real-time fill level visualization
   - Animated dustbin with status indicators
   - Live data points showing location, status, and thresholds

2. **Simulation Controls**
   - Start/Stop simulation
   - Reset data
   - Configure simulation patterns (Random/Realistic)
   - Adjust update intervals

3. **Analytics Dashboard**
   - Historical fill level charts
   - Statistics including Time to Full, Average Fill Rate
   - Peak usage analysis
   - Multiple bin overview

4. **Theme Switching**
   - Light/Dark/System theme options
   - Persistent theme selection
   - Automatic system theme detection

### API Endpoints

The application provides RESTful API endpoints:

- `GET /api/bins` - Get all dustbins
- `GET /api/bins/:id/readings` - Get historical data for a bin
- `POST /api/simulation/start` - Start simulation
- `POST /api/simulation/stop` - Stop simulation
- `POST /api/simulation/reset` - Reset simulation data
- `PATCH /api/simulation/config` - Update simulation configuration

## 🔧 Configuration

### Simulation Settings

Modify simulation behavior in the dashboard:
- **Pattern**: Choose between 'random' or 'realistic' fill patterns
- **Update Interval**: Set how frequently data updates (500ms - 5000ms)
- **Alert Thresholds**: Configure when warnings and alerts trigger

### Database Setup (Optional)

For persistent storage, configure a database:

1. **Using Neon (Recommended)**
   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

2. **Using local PostgreSQL**
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/smartdustbin
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🛡️ Troubleshooting

### Common Issues

1. **"NODE_ENV is not recognized" on Windows**
   - Fixed automatically with cross-env package

2. **Server binding issues on Windows**
   - Server automatically binds to localhost instead of 0.0.0.0

3. **Database connection errors**
   - App falls back to in-memory storage automatically
   - Check DATABASE_URL format if using external database

4. **Port already in use**
   - Change port in .env file or kill existing process:
     ```bash
     # Find process using port 5000
     netstat -ano | findstr :5000
     # Kill process by PID
     taskkill /PID <PID> /F
     ```

### Development Tips

- Use browser dev tools to monitor WebSocket connections
- Check browser console for any React warnings
- Monitor terminal output for server logs and API requests
- Use theme toggle to test both light and dark modes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 SIH Project

This project was developed for the Smart India Hackathon, focusing on smart city solutions and IoT-based waste management systems.

---

**Made with ❤️ for Smart India Hackathon**

For questions or issues, please create an issue in the repository or contact the development team.
