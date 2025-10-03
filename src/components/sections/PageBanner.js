'use client';

export default function PageBanner({ pageData }) {
  if (!pageData) return null;

  const {
    hero_mini_heading,
    hero_heading,
    hero_description,
  } = pageData;

  return (
    <section
      className="hero-banner bg-cover bg-center bg-no-repeat py-[60px] md:py-[120px] bg-[#e8f8f2]"
      style={{ backgroundImage: "url('/images/background-img.png')" }}
    >
      <div className="container mx-auto px-4">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          {hero_mini_heading && (
            <span className="text-sm text-green-600 uppercase tracking-wide mb-2 block">
              {hero_mini_heading}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-4">
            {hero_heading}
          </h1>
          {/* <p className="text-base md:text-lg text-gray-700">
            {hero_description}
          </p> */}
        </div>
      </div>
    </section>
  );
}
