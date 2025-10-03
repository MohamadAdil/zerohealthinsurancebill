'use client';

import Image from 'next/image';
import { scrollToSection } from '@/utils/helpers';
import parse from 'html-react-parser';

export default function HeroBanner({ pageData }) {
  if (!pageData) return null;

  const {
    hero_mini_heading,
    hero_heading,
    hero_description,
    hero_cta_text,
    hero_cta_link,
    hero_image
  } = pageData;

  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-20 md:py-32 bg-[#e8f8f2]"
      style={{ backgroundImage: "url('/images/background-img.png')" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">

          {/* Left Text Column */}
          <div className="w-full md:w-1/2 px-4 mb-10 md:mb-0">
            <div className="max-w-xl">
              {/* Mini Heading (plain text) */}
              <span className="text-sm md:text-base font-semibold text-[#051a6f] mb-2 block">
                {hero_mini_heading}
              </span>

              {/* Hero Heading with <br> support */}
              <h1 className="text-3xl md:text-5xl font-bold text-[#051a6f] leading-tight mb-4">
                {hero_heading ? parse(hero_heading) : null}
              </h1>

              <p className="text-base md:text-lg text-[#666] leading-relaxed mb-6">
                {hero_description}
              </p>

              <div>
                <button
                  onClick={() => scrollToSection('how-works')}
                  className="inline-block bg-[#051a6f] text-white text-sm md:text-base font-semibold px-8 py-4 rounded-lg hover:bg-[#031353] transition-all duration-300"
                >
                  {hero_cta_text}
                </button>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="w-full md:w-1/2 px-4">
            <div className="rounded-2xl overflow-hidden h-[300px] md:h-[480px] relative">
              {hero_image && (
                <Image
                  src={hero_image.url}
                  alt={hero_image.alt || 'Hero Image'}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}