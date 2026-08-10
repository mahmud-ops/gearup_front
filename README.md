# GearUp Frontend

GearUp is a modern, full-featured web application for renting outdoor and sports gear. The platform connects customers with gear providers, enabling seamless browsing, booking, and management of rental equipment. This repository contains the Next.js 16 frontend application.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.11 | React framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first CSS framework |
| shadcn/ui | 4.16.0 | Accessible UI components |
| Base UI | 1.6.0 | Unstyled component primitives |
| Lucide React | 1.28.0 | Icon library |
| Phosphor Icons | 2.1.10 | Additional icon set |
| js-cookie | 3.0.8 | Cookie management for auth tokens |
| jwt-decode | 4.0.0 | JWT token decoding |
| date-fns | 4.4.0 | Date formatting and manipulation |
| Next Cloudinary | 6.17.5 | Image upload and optimization |

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication stored in cookies
- Route protection via middleware
- Role-based access control (RBAC)

### Public Pages
- **Homepage**: Hero section and featured gear browsing
- **Gear Catalog**: Browse available gear items with search and filtering
- **Gear Details**: View individual gear item information

### Customer Dashboard
- Browse and search available gear
- Place rental orders with date selection
- Complete checkout and payment
- View personal order history and status
- Submit and manage reviews for rented gear

### Provider Dashboard
- Add, edit, and remove gear listings
- Upload gear images via Cloudinary
- Manage gear availability and pricing
- View incoming customer orders
- Track order statuses

### Admin Dashboard
- Manage all users (view, suspend accounts)
- Oversee all gear items across providers
- Monitor and manage all rental orders
- Create and manage gear categories

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm package manager
- A running instance of the [GearUp backend API](https://github.com/your-org/gearup_backend)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/gearup_front.git
   cd gearup_front
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://gearup-backend-api.onrender.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server on http://localhost:3000 |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint on the codebase |

## API Integration

The frontend communicates with the GearUp backend API. The base URL is configured in the service layer:

- **Base URL**: `https://gearup-backend-api.onrender.com/api`
- **Authentication**: Bearer token passed via `Authorization` header
- **Token Storage**: JWT access token stored in HTTP-only cookies via `js-cookie`

### Key API Endpoints Used

| Service | Method | Endpoint |
|---------|--------|----------|
| Auth | POST | `/api/auth/login` |
| Users | GET | `/api/users/me` |
| Users | GET | `/api/users` |
| Users | PATCH | `/api/users/:id` |
| Gear | GET | `/api/gear_items` |
| Gear | GET | `/api/gear_items/:id` |
| Gear | POST | `/api/gear_items` |
| Gear | PATCH | `/api/gear_items/:id` |
| Gear | DELETE | `/api/gear_items/:id` |
| Categories | GET | `/api/categories` |
| Rentals | GET | `/api/rental_orders` |
| Payments | POST | `/api/payments` |
| Reviews | GET/POST | `/api/reviews` |

## Route Protection

The application uses Next.js middleware to protect authenticated routes:

- `/checkout/*` - Requires authentication
- `/dashboard/*` - Requires authentication

Unauthenticated users are redirected to `/login`.

## Role-Based Access

The `RoleGuard` component in `app/(dashboard)/dashboard/role-guard.tsx` enforces role-based access:

- **ADMIN**: Can access `/dashboard/admin/*` for user, gear, order, and category management
- **PROVIDER**: Can access `/dashboard/provider/*` for managing their gear and orders
- **CUSTOMER**: Can access `/dashboard/customer/*` for browsing and orders

## Image Handling

Gear images are managed through Cloudinary:
- Uploads are handled via `next-cloudinary`
- Remote image patterns are configured in `next.config.ts` for:
  - `picsum.photos`
  - `images.unsplash.com`
  - `i.pinimg.com`
  - `res.cloudinary.com`

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the existing code style
3. Run `pnpm lint` to ensure code quality
4. Submit a pull request with a clear description

## Scripts & Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Start production server
pnpm start
```
