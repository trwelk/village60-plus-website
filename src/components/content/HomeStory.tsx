export function HomeStory() {
  return (
    <section id="home-story" aria-labelledby="home-story-title" className="bg-ivory text-charcoal">
      <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-24 lg:pr-10 lg:pl-[max(2rem,calc((100vw-1520px)/2+2rem))]">
          <div className="max-w-[40rem]">
            <h2 id="home-story-title" className="font-display text-[clamp(2.6rem,4.2vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              A More <span className="block md:whitespace-nowrap">Meaningful Tomorrow.</span>
            </h2>
            <div className="mt-8 max-w-[46ch] space-y-5 text-[17px] leading-relaxed md:text-[18px]">
              <p>
                For nearly two decades, Village 60 Plus has been creating places where people can feel safe, supported and, most importantly, at home.
              </p>
              <p>
                But getting older is changing.
                <br />
                And so are we.
              </p>
              <p>
                Today, Village 60 Plus is more than residential care.
                <br />
                We are building a connected way of living that brings together independent living, personalised care, beautiful homes, recovery support, lifestyle services and intelligent technology.
              </p>
              <p>All built around one person.</p>
            </div>
            <p className="mt-6 font-display text-[clamp(3.2rem,5vw,4.6rem)] leading-none font-medium text-gold italic">You.</p>
            <div className="mt-4 h-px w-16 bg-gold" />
          </div>
        </div>
        <div className="relative min-h-[70vw] lg:min-h-[760px]">
          <img
            src="/home/living-room.jpg"
            alt="A living room opening onto a tropical garden"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
