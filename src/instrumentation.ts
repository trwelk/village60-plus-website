export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { trustSystemCertificateAuthorities } = await import('@/lib/trust-system-cas');
  trustSystemCertificateAuthorities();
}
