'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

export default function LogoSlider({ pageData }) {
  if (!pageData) return null;

  const {
    logo_sc_mini_heading,
    logo_sc_heading,
    logos,
  } = pageData;

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 text-center">
        {logo_sc_mini_heading && (
          <span className="text-sm font-medium text-green-600 block mb-1">
            {logo_sc_mini_heading}
          </span>
        )}
        {logo_sc_heading && (
          <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-10">
            {logo_sc_heading}
          </h2>
        )}

        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={10000}
          spaceBetween={50}
          grabCursor={false}
          allowTouchMove={false}
        >
          {logos?.map((logoItem, index) => {
            const logo = logoItem.logos_item;
            return (
              <SwiperSlide key={index} style={{ width: 'auto' }}>
                <div className="h-[40px] w-[200px] md:h-[90px] md:w-[180px] flex items-center justify-center">
                  <Image
                    src={logo?.url}
                    alt={logo?.alt || logo?.title || 'Logo'}
                    width={200}
                    height={90}
                    className="object-contain w-[200px] h-[90px] object-contain object-center"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
