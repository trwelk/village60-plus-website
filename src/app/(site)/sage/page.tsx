import { OfferingRoute, offeringMetadata } from '../offering-route';

export function generateMetadata() {
  return offeringMetadata('sage');
}

export default function SagePage() {
  return <OfferingRoute slug="sage" />;
}
