'use client';

import FaqItem from '@/components/common/FaqItem';

export default function FaqSection({ pageData }) {
  if (!pageData) return null;

  const {
    faq_heading,
    faq_items,
    faq_cta,
    faq_cta_url,
  } = pageData;

  return (
    <section className="py-[60px] md:py-[100px] bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start gap-10 bg-[#F4F7FE] rounded-[20px] md:rounded-[64px] p-5 md:p-10">
          <div className="md:w-1/2">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] leading-[38px] sm:leading-[44px] md:leading-[52px] lg:leading-[60px] font-semibold font-manrope text-black text-start mb-10">
              {faq_heading || (
                <>
                  Frequently Asked <span className="text-[#051a6f]">Questions</span>
                </>
              )}
            </h2>
          </div>
          <div className="md:w-1/2">
            <div className="space-y-6">
              {faq_items?.map((item, index) => (
                <FaqItem
                  key={index}
                  id={`faq-${index}`}
                  question={item.faq_item_heading}
                  answer={item.faq_item_description}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
            {faq_cta && (
              <div className="mt-6">
                <a
                  href={faq_cta_url || "/faq"}
                  className="inline-block bg-[#051a6f] text-white px-6 py-3 rounded-full text-sm font-semibold"
                >
                  {faq_cta}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
