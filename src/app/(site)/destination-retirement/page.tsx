import { OfferingRoute, offeringMetadata } from '../offering-route';

export function generateMetadata() {
  return offeringMetadata('destination-retirement');
}

export default function DestinationRetirementPage() {
  return <OfferingRoute slug="destination-retirement" />;
}
