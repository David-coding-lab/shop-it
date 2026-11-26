import { z } from "zod";

import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  phoneSchema,
  signInPasswordSchema,
} from "@/lib/validation";

export const signInSchema = z.strictObject({
  email: emailSchema,
  password: signInPasswordSchema,
});

export const signUpPayloadSchema = z.strictObject({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const signUpSchema = signUpPayloadSchema.extend({ confirm: z.string() }).refine(
  (values) => values.confirm === values.password,
  {
    message: "Passwords do not match.",
    path: ["confirm"],
  },
);

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpPayloadSchema>;
