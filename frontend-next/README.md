# TensorTrade — Frontend Dashboard

Next.js App Router dashboard for the TensorTrade multi-agent trading psychology platform.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- Brutalist black/white design system — no rounded corners, heavy black borders, no colors

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The backend must be running on port 8000. See the root `README.md` for backend setup.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/login` | Login |
| `/auth/signup` | Sign up |
| `/dashboard` | Portfolio overview |
| `/dashboard/analyze` | Multi-agent AI analysis |
| `/dashboard/trading` | Stock trading, watchlist, IPOs |
| `/dashboard/wallet` | Wallet and transactions |
| `/dashboard/policies` | Trading policies CRUD |
| `/dashboard/investments` | Shariah screener and curated portfolios |
| `/dashboard/voice` | Voice agent (ElevenLabs / Twilio) |
| `/dashboard/calling-agent` | Scheduled AI calling |

## Environment Variables

Create `.env.local` in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── app/                  # App Router pages
│   ├── dashboard/        # Dashboard pages
│   └── auth/             # Auth pages
├── components/
│   └── ui/               # Reusable UI components (Card, Button, Input)
└── lib/
    ├── api.ts            # Typed API client — all backend calls go through apiFetch()
    ├── auth.ts           # localStorage-based auth
    └── utils.ts          # cn() and other utilities
```

## Design System

All UI follows a brutalist black/white aesthetic:
- White backgrounds, `border-4 border-black` containers
- No `rounded-*` classes — sharp corners everywhere
- UPPERCASE labels, bold weights
- Buttons: `bg-black text-white` with hover invert
- No dark mode, no gradients, no accent colors
