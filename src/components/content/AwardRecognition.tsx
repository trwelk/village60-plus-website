import { SplitAction, SplitFeature } from '@/components/content/SplitFeature';

export function AwardRecognition() {
  return (
    <SplitFeature
      headingId="home-recognition"
      eyebrow="Global recognition"
      imageSide="right"
      title={
        <>
          Excellence <span className="block">in Elder Care</span>
        </>
      }
      image={{
        src: '/home/excellence-award.jpg',
        webp: '/home/excellence-award.webp',
        alt: 'The Global Business Excellence Awards 2026 trophy for Excellence in Elder Care, presented to Village 60 Plus.',
        position: 'center 42%',
      }}
      action={<SplitAction href="/living-and-care">Living and care</SplitAction>}
    >
      <p>
        We are honoured to have received the Global Business Excellence Awards 2026 for Excellence in Elder Care, recognising our commitment to providing exceptional care, dignity and quality of life for our residents.
      </p>
    </SplitFeature>
  );
}
