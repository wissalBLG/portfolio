# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Vercel deployment

This project is configured to build with Nitro's Vercel preset. In Vercel,
use the repository root as the project root and keep the build command as:

```sh
npm run build
```

Add these variables in Vercel Project Settings → Environment Variables for
the Production environment:

```env
RESEND_API_KEY=re_your_resend_api_key
CONTACT_FROM_EMAIL=Portfolio <noreply@your-verified-domain.com>
CONTACT_TO_EMAIL=wassowissal633@gmail.com
```

`CONTACT_FROM_EMAIL` must use a domain verified in Resend. Keep
`RESEND_API_KEY` server-only; do not prefix it with `VITE_` and do not commit
`.env` files.
