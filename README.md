# Overview

This is a smart item scanning application built with React, Express.js, and TypeScript. The app allows users to scan and track essential items based on different modes (Daily Essentials, College Mode, Gym Mode, Trip Mode) and provides a history of scan results. It simulates hardware scanning functionality and helps users ensure they haven't forgotten important items when leaving.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture  
- **Framework**: Express.js with TypeScript in ESM module format
- **API Design**: RESTful API with endpoints for scanning items and managing scan history
- **Data Storage**: In-memory storage using Map data structure for development/demo purposes
- **Request/Response Handling**: JSON-based API with comprehensive error handling middleware

## Data Storage Solutions
- **Development Storage**: MemStorage class implementing IStorage interface for in-memory data persistence
- **Database Schema**: Drizzle ORM configured for PostgreSQL with tables for scan history
- **Data Validation**: Zod schemas for type-safe data validation across client and server

## Key Features
- **Mode-Based Scanning**: Predefined item sets for different use cases (Daily, College, Gym, Trip)
- **Scan Simulation**: Mock hardware scanning with random detection results
- **History Tracking**: Persistent storage of scan results with timestamps
- **Responsive Design**: Mobile-first UI with proper accessibility features

## External Dependencies

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icon set via CDN

### Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment optimizations and error handling

### Database and ORM
- **Drizzle ORM**: Type-safe database operations and migrations
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Drizzle Kit**: Database migration and schema management tools

### State and Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **Zod**: Schema validation for type-safe data handling
- **React Hook Form**: Form state management with validation integration
