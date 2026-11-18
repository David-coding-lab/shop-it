# Expo Starter (Expo Go + Supabase)

A production-ready starter for React Native apps using the Expo Router, Supabase (Auth + Postgres with RLS), and NativeWind.

## Using this template

On GitHub, click **Use this template** (or fork). Then rename everything app-specific before your first commit:

1. `app.json`: `name`, `slug`, `scheme` — and add `ios.bundleIdentifier` / `android.package` (e.g. `com.yourcompany.yourapp`) to `ios` / `android`
2. `package.json`: `name`, and replace `YOUR_USERNAME` in `repository.url`
3. `lib/supabase.ts`: the auth `storageKey` (`expo-starter-auth`)
4. `assets/`: icon, splash icon, adaptive icon, favicon
5. `LICENSE`: set your name/entity as the copyright holder

CI (`.github/workflows/ci.yml`) runs lint and typecheck on every push and PR.

## What's included

- **Expo SDK 54** with Expo Router v6, TypeScript (strict), New Architecture, typed routes
- **Supabase auth** (email + password) with the session stored in **SecureStore** (chunked to fit the 2 KB value limit, web falls back to AsyncStorage)
- **Protected routes** via `Stack.Protected` — `(app)` requires a session, `(auth)` requires no session
- **Profiles table** with a signup trigger (`handle_new_user`) that copies `full_name` / `avatar_url` from signup metadata, plus owner-only RLS policies
- **Auth flow**: sign in, sign up (with email-confirmation handling), forgot password, auth splash gating
- **Profile screen** backed by the `profiles` table
- **NativeWind v4** (Tailwind classes in RN) with automatic light/dark palette
- **Component-based structure**: thin routes in `app/`, feature modules in `features/`, shared primitives in `components/`. Keep every file under ~700 lines.

## Getting started

1. Install dependencies
   ```sh
   npm install
   ```
2. Create `.env` from `.env.example` and fill in your Supabase project URL and anon (publishable) key
   ```sh
   cp .env.example .env
   ```
3. Apply the database migration in `supabase/migrations/20261117000000_profiles.sql`:
   - Supabase dashboard → SQL editor → paste and run, **or**
   - `supabase link --project-ref <ref> && supabase db push`
4. (Development) Disable "Confirm email" under Supabase → Authentication → Sign In / Providers → Email, or implement deep-link handling for the confirmation email.
5. Run
   ```sh
   npx expo start
   ```

## Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm start`         | Start the Expo dev server         |
| `npm run lint`      | ESLint (eslint-config-expo)       |
| `npm run typecheck` | `tsc --noEmit`                    |

## Project structure

```
app/                    # Expo Router routes only — screens stay thin
  _layout.tsx           # Providers + Stack.Protected guard wiring
  (auth)/               # Public group: sign-in, sign-up, forgot-password
  (app)/                # Protected group: home, profile
components/
  ui/                   # Button, TextField, PasswordField, Card, Avatar, Spinner
  layout/               # Screen (SafeArea), KeyboardScroll
features/
  auth/                 # AuthProvider, auth-context, use-auth, auth components
  profile/              # useProfile, ProfileHeader, ProfileForm
lib/
  supabase.ts           # Client singleton (+ AppState auto-refresh on native)
  secure-storage.ts     # Chunked SecureStore adapter for the session
  env.ts                # Zod-validated EXPO_PUBLIC_* env vars
  validation.ts, cn.ts
types/database.types.ts # Hand-written Supabase types (regenerate, see below)
supabase/migrations/    # Profiles table, RLS, signup trigger
```

Conventions:

- Import with the `@/` alias (`import { Button } from "@/components/ui/Button"`).
- Screens compose components; they don't contain business logic. Hooks live in `features/<name>/use-*.ts`.
- One responsibility per file; split before a file approaches 700 lines.

## Regenerating database types

```sh
npx supabase gen types typescript --project-id <project-ref> > types/database.types.ts
```

## Notes

- **"SSR" on device:** `@supabase/ssr` targets server-rendered frameworks (it needs a request/cookie context) and cannot run inside Expo Go. This starter applies the same discipline instead — a dedicated client module, explicit storage adapter, session refresh bound to `AppState`, typed Database client, and RLS enforced server-side. If you add Expo Router API routes or a web admin later, use `@supabase/ssr` there.
- **Session storage:** SecureStore values are limited to ~2 KB, so the session is split into 400-char chunks (well under the limit even with non-ASCII metadata) stored under `<key>.N` plus a `<key>.__count` marker. The supabase `storageKey` is `expo-starter-auth`. Want the official AES variant (key in SecureStore, ciphertext in AsyncStorage)? See the Supabase Expo guide ("LargeSecureStore") and swap `lib/secure-storage.ts`.
- **Password recovery:** `resetPasswordForEmail` sends a recovery email; to land the token inside the app you need deep-link handling (`expo-auth-session` / a `reset-password` route reading `#access_token`). Not wired up by default — add it when you ship recovery UX.
- **RLS:** profiles are owner-read/owner-update only. Widen select policies deliberately when you need public profile display.
- Dark mode follows the system (`userInterfaceStyle: "automatic"`) via NativeWind `dark:` classes.

## License

MIT — see [LICENSE](./LICENSE).
