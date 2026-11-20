# Shop-it

Find, book and pay trusted local service providers near you — cleaners, tutors, electricians, plumbers and more. Shop-it is a two-sided services marketplace for Nigeria: customers discover nearby providers by category and distance, book a time, pay securely through Paystack, and only release payment when the job is done. Providers receive requests, accept or decline, complete the job, get paid, and build a rating from real reviews.

One app, two roles. At sign-up a user chooses **customer** or **provider** and the app adapts.

## How it works

1. **Sign up** and pick your role. Providers complete a profile with bio, category, services, prices and a service area (approximate pin + radius).
2. **Discover.** A customer searches by category — a PostGIS query orders nearby providers by distance from the customer's location.
3. **Request.** The customer picks a service, date, time and address. The booking starts as `requested`.
4. **Accept or decline.** The provider reviews the request. Accepting moves it to `accepted` and prompts the customer to pay.
5. **Pay.** Payment goes through Paystack and is held (`paid`). A database function enforces every booking state transition, so no client can skip a step.
6. **Complete.** The provider marks the job `completed`. The customer confirms — only then is the payout marked as released.
7. **Review.** The customer leaves a rating and review (`reviewed`). A trigger recalculates the provider's average rating. Push notifications fire on every state change.

### Booking state machine

```
requested → accepted → paid → completed → reviewed
    ↓           ↓
declined    cancelled
```

Enforced server-side in a database function (`transition_booking`) with an audit trail (`booking_status_events`). `paid` is only reachable via the Paystack webhook; `reviewed` only via `submit_review`. Cancellation is allowed from `requested`/`accepted` only — paid cancellations go through support (refunds are post-MVP).

## Features (MVP)

- Role-based onboarding and provider profiles (services, prices, service area, availability)
- Nearby search with category filter (PostGIS distance ordering)
- Booking request, accept, decline and cancel — with status timeline per booking
- Payment through Paystack with escrow-style `held` → `released` payout status
- Reviews and ratings (one review per booking, average recalculated by trigger)
- Push notifications on every booking state change (requires a development build, not Expo Go)

**Out of scope for MVP:** real provider payouts (Paystack Transfers), provider KYC/verification, in-app messaging, calendar availability, in-app refunds, map view, disputes. Payout is a bookkeeping status, not money movement.

## Tech stack

- **Expo SDK 54** (React Native 0.81) with **Expo Router v6** — typed routes, file-based navigation, `Stack.Protected` auth guards
- **Supabase** — Postgres with **RLS** everywhere, Auth (email + password, SecureStore session), PostGIS, Edge Functions (payment webhook, push sender), Database Webhooks
- **Paystack** — Nigerian payments in naira (NGN); checkout via in-app WebView, payment confirmed by a signature-verified webhook, never by the client redirect
- **NativeWind v4** (Tailwind classes) + custom **Shop-it design system** (amethyst/violet brand palette, Plus Jakarta Sans)
- **TypeScript strict**, Zod-validated env, feature-module structure, ESLint (eslint-config-expo)

## Architecture

```
app/                    # Thin Expo Router routes only
  (auth)/               # Public: sign-in, sign-up, forgot-password
  (app)/                # Protected: home, profile (role-based tabs land here)
components/
  ui/                   # Button, Card, TextField, PasswordField, Avatar, Spinner,
                        # StatusBadge, RatingStars, CategoryChip
  marketplace/          # ProviderCard, ServiceRow, BookingTimeline, EmptyState
  layout/               # Screen, KeyboardScroll
features/               # One module per domain (auth, profile, …)
  auth/                 # AuthProvider, use-auth, sign-in/up/forgot forms, AuthHeader
  profile/              # useProfile, ProfileForm, ProfileHeader
lib/
  supabase.ts           # Typed client singleton (SecureStore session, AppState refresh)
  secure-storage.ts     # Chunked SecureStore adapter (2 KB limit)
  env.ts                # Zod-validated EXPO_PUBLIC_* vars (fails fast with clear errors)
  format.ts             # formatNaira, formatDistance, formatDateTime/formatTime
  cn.ts, validation.ts
supabase/
  migrations/           # Postgres migrations (profiles today; marketplace schema lands in M1)
  functions/            # Edge Functions: paystack-initialize, paystack-webhook, send-push
types/                  # database.types.ts (generated) + booking.types.ts
```

Screen files never contain business logic: hooks live in `features/<domain>/use-*.ts`, presentational pieces in `features/<domain>/components/`. Import with the `@/` alias. Keep files under ~700 lines — split first.

### Data model (target schema)

| Table | Key columns |
|---|---|
| `profiles` | `id`, `role`, `full_name`, `phone`, `avatar_url` |
| `providers` | `user_id`, `bio`, `category`, `location geography(Point)`, `service_radius_km`, `rating_avg`, `rating_count`, `is_available` |
| `services` | `id`, `provider_id`, `title`, `description`, `price`, `is_active` |
| `bookings` | `id`, `customer_id`, `provider_id`, `service_id`, `status`, `scheduled_at`, `address`, `decline_reason` |
| `booking_status_events` | `id`, `booking_id`, `from_status`, `to_status`, `actor_id`, `created_at` |
| `payments` | `id`, `booking_id`, `reference` (unique), `amount`, `status`, `payout_status` (`held`/`released`), `paid_at`, `released_at` |
| `reviews` | `id`, `booking_id` (unique), `rating` 1–5, `comment` |
| `push_tokens` | `user_id`, `token`, `platform` |
| `notification_log` | `id`, `user_id`, `title`, `body`, `data`, `read_at` |

Row Level Security: customers see their bookings, providers see theirs; provider coordinates are never exposed (distance comes from an RPC, likewise search results); payments can only be created/updated by service-role functions (initialize + webhook); reviews can only be written after a completed booking, one per booking.

## Getting started

Prerequisites: **Node ≥ 20**, the **Expo Go** app on your phone (or a simulator), a **Supabase** account, and a **Paystack** test account.

1. Install dependencies
   ```sh
   npm install
   ```
2. Create a Supabase project at https://supabase.com, then enable **PostGIS** (Dashboard → Database → Extensions → postgis).
3. Apply the database migration in `supabase/migrations/20261117000000_profiles.sql`:
   - Supabase dashboard → SQL editor → paste and run, **or**
   - `npx supabase link --project-ref <ref> && npx supabase db push`
4. Create `.env` from `.env.example` and fill in your values (Dashboard → Project Settings → API):
   ```sh
   cp .env.example .env
   ```
5. (Development) Disable "Confirm email" under Authentication → Sign In / Providers → Email, or wire deep-link handling for the confirmation link.
6. Run
   ```sh
   npm start
   ```

### Paystack (for payment milestone, M5)

- Use **test** keys. Set `PAYSTACK_SECRET_KEY` as a Supabase Edge Function secret (`npx supabase secrets set PAYSTACK_SECRET_KEY=sk_test_…`); it never ships in the app.
- Webhook URL to paste into the Paystack dashboard: `https://<project-ref>.supabase.co/functions/v1/paystack-webhook`
- Test card: `4084084084084081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`.

> **Expo Go limitation:** remote push notifications cannot be delivered in Expo Go (SDK 53+). Everything except push delivery works in Expo Go; M8 builds the push pipeline and M9 verifies it on a free **EAS development build**.

## Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm start`         | Start the Expo dev server         |
| `npm run android`   | Start and open on Android         |
| `npm run ios`       | Start and open on iOS             |
| `npm run web`       | Start on web                      |
| `npm run lint`      | ESLint (eslint-config-expo)       |
| `npm run typecheck` | `tsc --noEmit`                    |

CI (`.github/workflows/ci.yml`) runs lint and typecheck on every push and PR.

## Regenerating database types

```sh
npx supabase gen types typescript --project-id <project-ref> > types/database.types.ts
```

## Roadmap

Milestones are built one at a time, each ending green (`lint` + `typecheck`):

- **M0** Identity & design system (this milestone)
- **M1** Database core — schema, RLS, PostGIS search RPC, booking state machine, reviews trigger, SQL smoke tests
- **M2** Role onboarding & provider setup (profile, services, service area)
- **M3** Discovery — category chips, distance-ordered provider list, provider detail
- **M4** Booking flow — request, accept/decline, booking detail timeline
- **M5** Payments — Paystack initialize + webhook, pay from accepted bookings
- **M6** Completion & payout — mark completed, customer confirms, payout released
- **M7** Reviews & ratings
- **M8** Push notifications — registration, webhook-triggered sender, in-app inbox
- **M9** Hardening & release — EAS development build, store prep

## Security notes

- All secrets stay server-side: `PAYSTACK_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live only in Edge Function secrets. The app ships with the anon key, which is safe **because** RLS is enforced on every table.
- Payment status is confirmed server-side via the webhook (HMAC-SHA512 signature on the raw body + `transaction/verify`), never via the client-side WebView redirect.
- Booking `status` cannot be set directly by any client — transitions go through `transition_booking()` with a legal-move map and row lock.
- Provider coordinates are stored for distance math but never returned to clients.

## License

MIT — see [LICENSE](./LICENSE).
