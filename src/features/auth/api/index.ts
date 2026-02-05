import { fetchApi } from "@app/shared/api/base";
import type { SignUpInput } from "@app/shared/schemas";

export const authApi = {
  signUp: (data: SignUpInput) =>
    fetchApi<{ message: string }>("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
