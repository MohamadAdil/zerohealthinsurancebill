'use client';

import HealthCard from "@/components/common/HealthCard";
import Image from 'next/image';

export default function HealthInsuranceSection({ pageData }) {
  if (!pageData) return null;

  const {
    gqs_mini_heading,
    gqs_heading,
    gqs_description,
    gqs_stats,
  } = pageData;

  return (
    <section className="bg-[#f8f8f9] py-24 bg-center bg-no-repeat bg-cover">
      <div className="max-w-7xl mx-auto px-4">

        {/* Text */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          {gqs_mini_heading && (
            <span className="text-sm text-green-600 font-medium block mb-2">{gqs_mini_heading}</span>
          )}
          {gqs_heading && (
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] leading-[38px] sm:leading-[44px] md:leading-[52px] lg:leading-[60px] font-semibold font-manrope text-black text-center mb-10 mb-4">
              {gqs_heading.split(' ').slice(0, -1).join(' ')}{" "}
              <span className="text-[#051a6f]">{gqs_heading.split(' ').slice(-1)}</span>
            </h2>
          )}
          {gqs_description && (
            <p className="text-base md:text-lg text-[#666666] leading-relaxed whitespace-pre-line">
              {gqs_description}
            </p>
          )}
        </div>

        {/* Dynamic Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {gqs_stats?.map((stat, index) => (
            <HealthCard
              key={index}
              icon={stat.gqs_icon?.url}
              value={stat.gqs_num}
              label={stat.gqs_text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
