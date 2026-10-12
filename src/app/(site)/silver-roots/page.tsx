import { OfferingRoute, offeringMetadata } from '../offering-route';

export function generateMetadata() {
  return offeringMetadata('silver-roots');
}

export default function SilverRootsPage() {
  return <OfferingRoute slug="silver-roots" />;
}
