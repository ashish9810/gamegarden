# GameHub - Gaming Platform

## Overview

GameHub is a modern web application that serves as a playground for quick and fun games. The platform currently features Word Finder and NPAT (Name, Place, Animal, Thing) games with plans for expansion. Built with a focus on instant accessibility, the application allows users to jump into games without downloads or lengthy loading times, supporting both solo and multiplayer experiences across all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React 18 with TypeScript, utilizing a modern component-based architecture. The application uses Vite as the build tool for fast development and optimized production builds. State management is handled through React Query (@tanstack/react-query) for server state and built-in React hooks for local state.

**UI Framework**: The application leverages shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. Styling is implemented using Tailwind CSS with custom design tokens for consistent theming across the platform.

**Routing**: Client-side routing is managed by Wouter, providing a lightweight alternative to React Router. The current route structure includes home, word-finder, npat, and a 404 page.

**Animation**: Framer Motion is integrated for smooth animations and transitions, enhancing the user experience with engaging visual feedback.

### Backend Architecture
The server is built with Express.js and TypeScript, following a modular architecture pattern. The application uses an in-memory storage implementation that can be easily swapped for database persistence.

**API Design**: RESTful API endpoints are prefixed with `/api` and include comprehensive logging middleware for request monitoring and debugging.

**Development Setup**: The backend uses tsx for TypeScript execution in development and esbuild for production bundling, ensuring fast compilation and minimal bundle sizes.

### Data Storage Strategy
Currently implements an in-memory storage pattern with a clean interface design that allows for easy migration to persistent databases. The storage interface includes methods for user management (CRUD operations) with proper TypeScript typing.

**Database Schema**: Defined using Drizzle ORM with PostgreSQL dialect, featuring a users table with UUID primary keys, unique usernames, and password fields. The schema is type-safe and includes Zod validation schemas for runtime validation.

### Styling and Design System
The application uses a comprehensive design system built on Tailwind CSS with custom CSS variables for theme management. The design includes:

- Custom color palette with electric blue, vibrant pink, neon green, and sunny yellow
- Typography system using Inter for UI text and Poppins for display elements
- Responsive design patterns optimized for mobile, tablet, and desktop
- Dark mode support through CSS variables

### External Dependencies

**Database**: Configured for PostgreSQL using Neon Database serverless driver (@neondatabase/serverless) with Drizzle ORM for type-safe database operations.

**UI Components**: Extensive use of Radix UI primitives for accessible component foundations, including dialog, dropdown, popover, and navigation components.

**Development Tools**: Replit integration for development environment with cartographer plugin for enhanced debugging and runtime error handling.

**Session Management**: PostgreSQL session store (connect-pg-simple) for persistent user sessions across server restarts.

**Build Tools**: Vite for frontend bundling with React plugin, esbuild for backend compilation, and PostCSS for CSS processing with Tailwind and Autoprefixer.

**Type Safety**: Comprehensive TypeScript configuration with strict mode enabled, path mapping for clean imports, and Drizzle-Zod integration for schema validation.