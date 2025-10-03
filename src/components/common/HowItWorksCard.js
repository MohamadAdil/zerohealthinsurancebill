// src/components/common/HowItWorksCard.js
'use client';

export default function HowItWorksCard({ step, title, description, linkText, linkUrl, bgClass, linkColor, onOpenModal, onOpenModal2, onOpenModal3 }) {
  return (
    <div className={`rounded-[20px] px-5 md:px-10 py-12 flex flex-col items-center justify-start gap-4 ${bgClass}`}>
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-2xl font-semibold z-10">
        {step}
        <span className="absolute w-[74px] h-[74px] border-2 border-dashed border-green-600 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
      </div>
      <div className="text-center">
        <h4 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold mb-3">{title}</h4>
        <p className="text-[16px] leading-relaxed mb-5 whitespace-pre-line">{description}</p>
        {linkText && (
          <button
          onClick={
            step === "1"
              ? onOpenModal
              : step === "2"
              ? onOpenModal2
              : step === "3"
              ? onOpenModal3
              : undefined
          }
          className={`text-[18px] font-semibold underline ${linkColor}`}
        >
          {linkText}
        </button>
        )}
      </div>
    </div>
  );
}