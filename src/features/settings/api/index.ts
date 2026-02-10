import { fetchApi } from "@app/shared/api/base";
import type { SenderProfileInput } from "@app/shared/schemas";
import type { SenderProfile } from "@app/shared/schemas/api";

export interface ReminderSettings {
  enabled: boolean;
  mode: "AFTER_SENT" | "AFTER_DUE";
  delaysDays: number[];
}

export const senderProfileApi = {
  get: () => fetchApi<SenderProfile>("/api/sender-profile"),

  create: (data: SenderProfileInput) =>
    fetchApi<SenderProfile>("/api/sender-profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (data: SenderProfileInput) =>
    fetchApi<SenderProfile>("/api/sender-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const remindersApi = {
  get: () => fetchApi<ReminderSettings>("/api/reminders"),

  update: (data: ReminderSettings) =>
    fetchApi<ReminderSettings>("/api/reminders", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
