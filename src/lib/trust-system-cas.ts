import { getCACertificates, setDefaultCACertificates } from 'node:tls';

let applied = false;

/**
 * Node trusts its bundled certificate authorities. On networks that inspect TLS,
 * the extra authority is in the OS store, and Sanity fetches fail with
 * SELF_SIGNED_CERT_IN_CHAIN until it is trusted too.
 */
export function trustSystemCertificateAuthorities(): void {
  if (applied) return;
  try {
    const system = getCACertificates('system');
    if (system.length === 0) {
      applied = true;
      return;
    }
    const certificates = new Set(getCACertificates('default'));
    for (const certificate of system) certificates.add(certificate);
    setDefaultCACertificates([...certificates]);
    applied = true;
  } catch {
    applied = false;
  }
}
