import { offeringMetadata } from '../offering-route';
import { DestinationRetirementView } from './view';

export function generateMetadata() {
  return offeringMetadata('destination-retirement');
}

export default function DestinationRetirementPage() {
  return <DestinationRetirementView />;
}
