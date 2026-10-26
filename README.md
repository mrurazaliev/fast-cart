# FastCart

Initial React + Vite foundation in TypeScript/TSX.

## Run locally

Requires Node.js 24 LTS and npm 11.

```sh
npm ci
npm run dev
```

On Windows PowerShell use `npm.cmd` if script execution is restricted.
Copy `.env.example` to `.env.local` to override the public API URL. Never put secrets in VITE_ variables.

## Checks

```sh
npm run typecheck
npm run build
npm run lint
npm run format:check
```

## Structure

- `src/app`: router and Redux store
- `src/pages`: initial screen and route error handling
- `src/features`: Redux request state
- `src/shared/api`: Axios client with timeout and error handling
- `src/shared/components`: reusable request states
- `src/components/ui`: shadcn/ui components

Tailwind CSS uses the Vite plugin. shadcn/ui generates TypeScript components with `tsx: true` in `components.json`.

Only `/` is implemented. Store pages, authentication and admin UI are later tasks. API authentication and business contracts still need verification. No token storage or guessed authorization response is implemented.

The home hero loads categories from the public API with Redux Toolkit. Category links and Shop Now target the future catalog route; the catalog itself is not implemented yet.

The local iPhone hero photograph comes from [Apple Newsroom](https://www.apple.com/ie/newsroom/2022/09/apple-debuts-iphone-14-pro-and-iphone-14-pro-max/). The banner copy follows the supplied design; voucher redemption is not implemented.

The `marketplace` and `admin` branches start from the same setup commit. Continue buyer storefront work in `marketplace`.
