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

The five standalone home promo images in `src/assets/home` come from the [EcommerceFigma reference assets](https://github.com/M-Subhan-Ali/EcommerceFigma/tree/6983d80593646fc51c6af60bd96bd715ac68cf24/src/Components): `MusicEnhance/image/jbl.png` and `Arrival/Images/{ps5,girl,speaker,gucci}.png`. No reference application code was copied. These are editorial campaign images; they do not assert product availability or arrival dates. Promo links use existing category IDs from Redux. Electronics is used for music, gaming and speakers; fashion and beauty use their respective catalog categories. If category data is unavailable, links open the catalog without inventing an ID.

Flash Sales shows up to 12 discounted products from the first 100 catalog records. It uses the API's `hasDiscount` and a positive `discountPrice` below `price`. Images use the verified `/images/{filename}` endpoint. Prices have no currency symbol until the API currency is confirmed. Ratings, review counts, campaign deadlines and discount percentages are omitted. Cart and wishlist actions are visibly unavailable.

The `marketplace` and `admin` branches start from the same setup commit. Continue buyer storefront work in `marketplace`.
