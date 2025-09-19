# Smart Dustbin Simulation

## Overview

This is a Smart Dustbin Simulation application that demonstrates the functionality of an IoT-enabled waste management system. The application simulates real-time sensor data to show dustbin fill levels and provides alerts when bins reach capacity thresholds. Built as a demo-ready solution for waste management teams, facility managers, and stakeholders to visualize the potential of smart dustbin technology.

The system features a React frontend with real-time dashboard capabilities, an Express.js backend with WebSocket support for live updates, and comprehensive simulation controls for different fill patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Vite**: Build tool for fast development and optimized production builds
- **Tailwind CSS + shadcn/ui**: Utility-first CSS framework with pre-built component library for consistent UI design
- **TanStack Query**: Server state management for API calls with automatic caching and background updates
- **Wouter**: Lightweight client-side routing solution
- **WebSocket Integration**: Real-time communication for live data updates using custom useWebSocket hook

### Backend Architecture
- **Express.js**: RESTful API server with middleware for JSON parsing and request logging
- **WebSocket Server**: Real-time bidirectional communication for live dustbin status updates
- **Memory Storage**: In-memory data storage implementation with interface for future database integration
- **Simulation Engine**: Configurable data simulation with multiple patterns (random, linear, realistic)

### Data Layer
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Schema Definition**: Structured data models for bins, readings, and simulation configuration
- **Zod Validation**: Runtime type checking and data validation for API endpoints

### Real-time Communication
- **WebSocket Protocol**: Live updates for bin status changes, alerts, and simulation state
- **Event-driven Architecture**: Pub/sub pattern for broadcasting updates to connected clients
- **Automatic Reconnection**: Client-side reconnection logic with exponential backoff

### UI Components and Features
- **Dashboard Layout**: Responsive design with bin status cards, historical charts, and statistics
- **Simulation Controls**: Interactive controls for starting/stopping simulation and configuring patterns
- **Alert System**: Visual notifications and banners for threshold breaches
- **Historical Visualization**: Line charts showing fill level trends over time using Recharts

### Development and Build
- **TypeScript Configuration**: Strict type checking across frontend, backend, and shared modules
- **Path Aliases**: Clean import paths using @ aliases for better code organization
- **Hot Module Replacement**: Development server with instant updates during development
- **Production Build**: Optimized builds with code splitting and asset optimization

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database for production deployment
- **Drizzle Kit**: Database migration and schema management tool

### UI and Styling
- **Radix UI**: Headless component primitives for accessible UI components
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Charting library for data visualization
- **Embla Carousel**: Touch-friendly carousel components

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **React Hook Form**: Form state management with validation

### Real-time Features
- **ws**: WebSocket library for server-side real-time communication
- **Date-fns**: Date utility library for time formatting and manipulation

### Session and State Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Class Variance Authority**: Utility for building component variants with Tailwind classes