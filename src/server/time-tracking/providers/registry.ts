import type { TimeTrackingProvider } from "./types";

const providers = new Map<string, TimeTrackingProvider>();

export function registerProvider(provider: TimeTrackingProvider) {
  providers.set(provider.id, provider);
}

export function getProvider(id: string): TimeTrackingProvider {
  const provider = providers.get(id);

  if (!provider) {
    throw new Error(`Time tracking provider "${id}" is not registered`);
  }

  return provider;
}

export function getAllProviders(): TimeTrackingProvider[] {
  return Array.from(providers.values());
}
