export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">

      <div className="mb-12">
        <p className="text-green-700 uppercase tracking-widest text-xs font-semibold mb-3">Our Story</p>
        <h1 className="text-5xl font-black uppercase italic leading-tight mb-6">
          Since 1977.
        </h1>
        <div className="h-1 w-16 bg-green-700 rounded-full" />
      </div>

      <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
        <p>
          The rustic red brick floors, the wooden benches and, most importantly, the subs haven't
          changed since David Grumbach opened his shop on Coventry in June 1977.
        </p>

        <p>
          The laid-back vibe reminded self-proclaimed hippie Ilene MacLellan of times she'd spent
          in the neighborhood when she was younger. It's also one of the reasons she bought Grum's
          Sub Shoppe in March 2006 after taking a look at the place a few months earlier.
        </p>

        <blockquote className="border-l-4 border-green-700 pl-6 py-2 italic text-gray-600">
          "It took me back&hellip; and it just felt really homey."
        </blockquote>

        <p>
          MacLellan says owning a restaurant seemed logical after waiting tables for 28 years. It
          also allowed her to make her own schedule and spend more time with her five kids. She'd
          been eyeing another restaurant, but Grum's was a carryout joint — no liquor license to
          contend with, and she could handle payroll, ordering and invoices herself.
        </p>

        <p>
          And unlike some new restaurant owners, MacLellan knew she'd be changing very little about
          the shop after taking over. So you can still grab the restaurant's namesake — the Grum: an
          Italian sub stuffed with smoked ham, capicola, Genoa salami, provolone, banana peppers,
          lettuce, tomato, onion, and the shop's secret blend of signature spices.
        </p>

        <blockquote className="border-l-4 border-green-700 pl-6 py-2 italic text-gray-600">
          "People know when they walk in they're going to get the same thing."
        </blockquote>

        <p>
          Even with the arrival of new competitors over the years, Grum's is still going strong.
        </p>

        <blockquote className="border-l-4 border-green-700 pl-6 py-2 italic text-gray-600">
          "I have had customers come in here, bring a sub and say, 'Throw this away and make me a
          real sub.'"
        </blockquote>
      </div>

      <p className="mt-12 text-xs text-gray-400">
        Story originally published in{' '}
        <a
          href="https://clevelandmagazine.com/articles/that-70s-shop/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 transition-colors"
        >
          Cleveland Magazine
        </a>
        .
      </p>
    </main>
  );
}
