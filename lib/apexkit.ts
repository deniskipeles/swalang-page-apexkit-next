// lib/apexkit.ts
import { ApexKit } from "@apexkit/sdk";
import { APEX_HUB_TOKEN } from './constants';

// Initialize Instance
export const apex = new ApexKit(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000').tenant('swalang');
if (typeof window !== 'undefined') {
  const getSetApexToken = async () => {
    const token = localStorage.getItem(APEX_HUB_TOKEN);
    if (token) {
      apex.setToken(token);
    } else {
      const { cookies } = await import('next/headers');
      const token = cookies().get(APEX_HUB_TOKEN)?.value;

      if (token) {
        apex.setToken(token);
      }
    }
  };
  getSetApexToken();
}

// Server-side helper (Call this in Server Components/Pages)
export async function getApexServer() {
  const client = new ApexKit(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000').tenant('swalang');

  // Dynamically import cookies to avoid build errors on client
  const { cookies } = await import('next/headers');
  const token = cookies().get(APEX_HUB_TOKEN)?.value;

  if (token) {
    client.setToken(token);
  }
  return client;
}