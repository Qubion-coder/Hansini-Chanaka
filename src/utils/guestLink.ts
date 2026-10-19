// Short guest links: ?g=<prefix digit><base64url of the UTF-8 name>
// Sinhala names percent-encode to 9 chars per letter; base64url needs about 4.

export const PREFIXES = ['ඔබට', 'ඔබ දෙපලට', 'ඔබ ඇතුලු පවුලේ සැමට'] as const;

export const encodeGuest = (name: string, prefix: string) => {
  const bytes = new TextEncoder().encode(name);
  const b64 = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${Math.max(0, PREFIXES.indexOf(prefix as (typeof PREFIXES)[number]))}${b64}`;
};

export const decodeGuest = (code: string) => {
  try {
    const prefix = PREFIXES[Number(code[0])] ?? '';
    const b64 = code.slice(1).replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return { name: new TextDecoder().decode(bytes), prefix };
  } catch {
    return null;
  }
};
