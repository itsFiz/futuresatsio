# FutureSats.io - BTC Retirement Planner

A comprehensive Bitcoin retirement planning platform that helps users visualize, plan, and execute personalized BTC accumulation strategies through DCA, dip buys, and halving cycle projections.

## Features

- **BTC Retirement Simulator**: Set target years, DCA schedules, and growth projections
- **Real-time Bitcoin Data**: Fetches current BTC prices from CoinGecko API
- **Automated Data Updates**: Daily cron job to keep Bitcoin data fresh
- **Dip Buy Planner**: Strategic bear market purchases every 4 years
- **Results Dashboard**: Interactive charts and performance metrics
- **PDF Export**: Generate retirement blueprints
- **User Management**: Save and manage multiple retirement plans

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Database**: NeonDB (PostgreSQL) with Prisma ORM
- **Authentication**: Clerk.dev
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- NeonDB account (or any PostgreSQL database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd futuresats-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

### Using NeonDB

1. Create a NeonDB account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local` file
4. Run the Prisma migrations

### Using Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your database connection string
3. Update the `DATABASE_URL` in your `.env.local` file

## Authentication Setup

### Using Clerk

1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Copy your publishable and secret keys to `.env.local`

## Bitcoin Data System

The application includes a real-time Bitcoin data fetching system that:

- **Fetches data from CoinGecko API**: Gets current BTC price, market cap, and volume using the official CoinGecko API v3
- **Accurate pricing**: Uses direct price data (not calculated from market cap)
- **Stores data locally**: Saves data in JSON format for fast access
- **Updates automatically**: Daily cron job keeps data fresh
- **Integrates with models**: Updates CAGR models with real-time prices

### API Endpoints

- `GET /api/btc-data` - Retrieve current Bitcoin data
- `POST /api/btc-data` - Manually update Bitcoin data
- `GET /api/cron/update-btc-data` - Cron job endpoint (requires authentication)

### Manual Data Update

To manually update Bitcoin data:

```bash
# Using curl
curl -X POST http://localhost:3000/api/btc-data

# Using npm scripts
npm run init-btc    # Initialize Bitcoin data
npm run test-btc    # Test API and compare with CoinGecko
```

### Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=your_secret_key_for_cron_authentication
```

For production deployment on Vercel, the cron job will automatically run daily at midnight UTC.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── BTCRetirementSimulator.tsx
│   ├── DipBuyPlanner.tsx
│   └── ResultsDashboard.tsx
└── lib/               # Utility functions
    └── db.ts          # Database configuration
```

## Key Components

### BTCRetirementSimulator
- Input forms for retirement parameters
- Real-time calculation updates
- Yearly breakdown tables

### DipBuyPlanner
- Strategic dip buy planning
- Bear market timing suggestions
- Investment allocation tracking

### ResultsDashboard
- Interactive charts with Recharts
- Performance metrics
- Portfolio visualization

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway

1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@futuresats.io or create an issue in the repository.

---

Built with ❤️ by Fiz @ F12.GG
