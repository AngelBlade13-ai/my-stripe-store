# My Stripe Store

A small Next.js and TypeScript checkout project that demonstrates how to connect a product page to Stripe payments. The app displays a single product, opens a card payment form, creates a Stripe PaymentIntent through a Next.js API route, and shows a success state after payment confirmation.

This was built as a focused school project for learning Stripe integration, API routes, client/server environment variables, and payment form handling in a React application.

## Features

- Single-product storefront page for "Celestial Coffee Blend"
- Stripe Elements card form
- Next.js API route for creating PaymentIntents
- Client-side payment confirmation with `stripe.confirmCardPayment`
- Success screen after a completed payment
- Test card instructions shown in the UI
- Diagnostic pages for checking API route and Stripe configuration
- TypeScript, Tailwind CSS, and React Icons

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Stripe Node SDK
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`
- Tailwind CSS
- ESLint

## Project Structure

```text
src/
  app/
    api/
      create-payment-intent/
        route.ts       # Creates Stripe PaymentIntents
      tester/
        route.ts       # Simple API test route
    page.tsx           # Product page and checkout state
    test-api/
      page.tsx         # Diagnostic test page
    tester/
      page.tsx         # Additional test page
  components/
    PaymentForm.tsx    # Stripe card form and payment confirmation
    PaymentSuccess.tsx # Success message after payment
```

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Use Stripe test keys only while developing this project. The public key is used by the browser, and the secret key is only used inside the API route.

## How To Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Use Stripe's standard test card:

```text
4242 4242 4242 4242
Any future expiration date
Any 3-digit CVC
```

## Available Scripts

```bash
npm run dev      # Start the local Next.js server
npm run build    # Build the production app
npm run start    # Run the built app
npm run lint     # Run ESLint
```

## How It Works

1. The home page displays a product card and price.
2. Clicking "Buy Now" switches the page into checkout mode.
3. `PaymentForm.tsx` collects card details through Stripe Elements.
4. The form posts the product amount and ID to `/api/create-payment-intent`.
5. The API route uses `STRIPE_SECRET_KEY` to create a PaymentIntent.
6. The client receives the PaymentIntent client secret and confirms the card payment.
7. A success component is shown after Stripe confirms the payment.

## Notes

- This is a learning project, not a production storefront.
- Product data is hard-coded in `src/app/page.tsx`.
- The app does not store orders in a database.
- Real deployments should add stronger validation around product IDs, trusted prices, order records, webhooks, and error handling.

## What I Practiced

- Building a client/server payment flow in Next.js
- Keeping Stripe secret keys on the server
- Using API routes for backend behavior
- Handling loading, error, success, and reset states in React
- Reading payment documentation and testing with Stripe's sandbox cards
