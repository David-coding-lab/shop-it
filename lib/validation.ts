import { z } from "zod";

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;
export const PHONE_MAX_LENGTH = 20;
export const AVATAR_URL_MAX_LENGTH = 2048;

function stripUnsafeChars(value: string): string {
  let result = "";

  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isControl = code <= 0x1f || (code >= 0x7f && code <= 0x9f);
    const isInvisible =
      (code >= 0x200b && code <= 0x200f) ||
      (code >= 0x202a && code <= 0x202e) ||
      (code >= 0x2060 && code <= 0x206f) ||
      code === 0xfeff;

    if (!isControl && !isInvisible) {
      result += char;
    }
  }

  return result;
}

function cleanFullName(value: string): string {
  return stripUnsafeChars(value.replace(/\s+/g, " ")).trim();
}

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  let national: string | null = null;

  if (/^0[789][01]\d{8}$/.test(digits)) {
    national = digits.slice(1);
  } else if (/^234[789][01]\d{8}$/.test(digits)) {
    national = digits.slice(3);
  } else if (/^[789][01]\d{8}$/.test(digits)) {
    national = digits;
  }

  return national ? `+234${national}` : value.trim();
}

const httpsUrlSchema = z
  .string()
  .max(
    AVATAR_URL_MAX_LENGTH,
    `Avatar URL must be ${AVATAR_URL_MAX_LENGTH} characters or fewer.`,
  )
  .pipe(z.url({ protocol: /^https$/, error: "Enter a valid https:// image URL." }))
  .refine(
    (value) => !/^https:\/\/[^/?#]*@/i.test(value),
    "Avatar URL must not include credentials.",
  );

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(EMAIL_MAX_LENGTH, `Email must be ${EMAIL_MAX_LENGTH} characters or fewer.`)
  .pipe(z.email("Enter a valid email address."));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`);

export const signInPasswordSchema = z.string().min(1, "Enter your password.");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Enter your phone number.")
  .max(PHONE_MAX_LENGTH, "Phone number is too long.")
  .regex(/^[0-9+()\s.-]+$/, "Enter a valid phone number.")
  .transform(normalizePhone)
  .pipe(
    z
      .string()
      .regex(/^\+234[789][01]\d{8}$/, "Enter a valid Nigerian phone number (e.g. 0803 123 4567)."),
  );

export const fullNameSchema = z
  .string()
  .transform(cleanFullName)
  .pipe(
    z
      .string()
      .min(1, "Enter your full name.")
      .min(FULL_NAME_MIN_LENGTH, "Full name must be at least 2 characters.")
      .max(FULL_NAME_MAX_LENGTH, `Full name must be ${FULL_NAME_MAX_LENGTH} characters or fewer.`),
  );

export const optionalFullNameSchema = z
  .string()
  .nullable()
  .transform((value) => (value == null ? "" : cleanFullName(value)))
  .refine(
    (value) => value === "" || value.length >= FULL_NAME_MIN_LENGTH,
    "Full name must be at least 2 characters.",
  )
  .refine(
    (value) => value.length <= FULL_NAME_MAX_LENGTH,
    `Full name must be ${FULL_NAME_MAX_LENGTH} characters or fewer.`,
  )
  .transform((value) => (value === "" ? null : value));

export const optionalAvatarUrlSchema = z
  .string()
  .nullable()
  .transform((value) => (value == null ? "" : value.trim()))
  .superRefine((value, ctx) => {
    if (value === "") return;

    const parsed = httpsUrlSchema.safeParse(value);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({ code: "custom", message: issue.message });
      }
    }
  })
  .transform((value) => (value === "" ? null : value));

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function firstErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}
