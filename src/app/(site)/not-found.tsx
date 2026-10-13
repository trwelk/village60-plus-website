import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <main id="main">
      <Section tone="ivory" className="clear-header">
        <h1 id="page-title">Page not found</h1>
        <p className="mt-4 max-w-prose-site">That page is not on the Village 60 Plus site.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/">Back to the home page</Button>
          <Button href="/contact" variant="secondary">Contact</Button>
        </div>
      </Section>
    </main>
  );
}
