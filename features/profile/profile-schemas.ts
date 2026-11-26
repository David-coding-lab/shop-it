import { z } from "zod";

import { optionalAvatarUrlSchema, optionalFullNameSchema } from "@/lib/validation";

export const profileUpdateSchema = z.strictObject({
  full_name: optionalFullNameSchema,
  avatar_url: optionalAvatarUrlSchema,
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
