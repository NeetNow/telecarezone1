import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBackendUrl() {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'https://dev.telecarezone.com';
    }
  }

  return (
    (typeof window !== 'undefined' ? window.location.origin : '')
  );
}

export function getApiBaseUrl() {
  const backendUrl = getBackendUrl();
  return backendUrl ? `${backendUrl}/api` : '/api';
}
