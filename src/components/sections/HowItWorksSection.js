// src/components/sections/HowItWorksSection.js
'use client';

import HowItWorksCard from "@/components/common/HowItWorksCard";

export default function HowItWorksSection({ pageData, onOpenModal, onOpenModal2, onOpenModal3 }) {
  if (!pageData) return null;

  const {
    hiws_mini_heading,
    hiws_heading,
    hiws_description,
    hiws_card,
    section_bar_text,
  } = pageData;

  return (
    <section className="mt-[-30px] pb-24 bg-center bg-no-repeat bg-cover" id="how-works">
      <div className="container mx-auto px-4">
        <div className="mb-14 bg-[#051a6f] text-white text-center text-[18px] font-medium px-10 py-5 max-w-3xl mx-auto rounded-full">
           {section_bar_text}
        </div>
        {hiws_heading && (
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] leading-[38px] sm:leading-[44px] md:leading-[52px] lg:leading-[60px] font-semibold font-manrope text-black text-center mb-10">
            {hiws_heading.split(' ').slice(0, -1).join(' ')}{" "}
            <span className="text-[#051a6f]">
              {hiws_heading.split(' ').slice(-1)}
            </span>
          </h2>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {hiws_card?.map((step, index) => (
            <HowItWorksCard
              key={index}
              step={step.hiws_card_number}
              title={step.hiws_card_heading}
              description={step.hiws_card_description || step.hiws_card_} // fallback for old key
              linkText={step.hiws_card_cta_text}
              linkUrl={step.hiws_card_cta_link}
              onOpenModal={onOpenModal} // Changed from handleOpenInfoModal to onOpenModal
              onOpenModal2={onOpenModal2}
              onOpenModal3={onOpenModal3}
              bgClass={index % 2 === 0
                ? "bg-[url('/images/background-img.png')] bg-cover bg-center bg-[#F8F9FA]"
                : "bg-[#f6f7f8]"
              }
              linkColor={index % 2 === 0 ? "text-[#051a6f]" : "text-gray-800"}
            />
          ))}
        </div>


      </div>
    </section>
  );
}