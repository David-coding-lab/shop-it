import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.url("EXPO_PUBLIC_SUPABASE_URL must be a valid URL (e.g. https://xxxx.supabase.co)"),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "EXPO_PUBLIC_SUPABASE_ANON_KEY is required"),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  - ${issue.message}`).join("\n");
  throw new Error(
    `Invalid environment variables. Check your .env file (see .env.example):\n${issues}`,
  );
}

export const env = parsed.data;
