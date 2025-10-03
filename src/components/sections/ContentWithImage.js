'use client';

import Image from 'next/image';

export default function ContentWithImage({ pageData }) {
  if (!pageData) return null;

  const {
    abt_quote_heading,
    abt_quote_description,
    about_quote_cta_text,
    about_quote_cta_link,
    abt_quote_img, // ACF image URL
  } = pageData;

  return (
    <section className="py-16 px-4 bg-[#F8F8F9]">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10">
        {/* Image */}
        <div className="w-full lg:w-1/2">
          {abt_quote_img && (
            <div className="relative w-full h-[300px] sm:h-[360px] md:h-[400px] lg:h-[460px] rounded-xl overflow-hidden">
              <Image
                src={abt_quote_img.url}
                alt="Why Zero Insurance"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
        {/* Text Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-[22px] sm:text-[26px] md:text-[30px] lg:text-[36px] font-semibold text-[#001c58] mb-4 leading-tight">
            {abt_quote_heading}
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-line">
            {abt_quote_description}
          </p>

          {about_quote_cta_text && (
            <a
              href={about_quote_cta_link || '#'}
              className="inline-block bg-[#001c58] text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-all duration-300 text-sm sm:text-base"
            >
              {about_quote_cta_text}
            </a>
          )}
        </div>


      </div>
    </section>

  );
}
