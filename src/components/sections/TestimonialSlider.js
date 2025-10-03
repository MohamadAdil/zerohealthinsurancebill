'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa6';

export default function TestimonialSlider({ reviews }) {
  return (
    <section className="py-[100px] bg-[#F8F8F9]">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] leading-[38px] sm:leading-[44px] md:leading-[52px] lg:leading-[60px] font-semibold font-manrope text-black text-center mb-10">
          What Our Members Say
        </h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 1, 
            },
            991: {
              slidesPerView: 2, 
            },
            1024: {
              slidesPerView: 2, 
            },
          }}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="testimonial-swiper"
        >
          {reviews.flatMap(item => item.review).map((review, reviewIndex) => (
            <SwiperSlide key={reviewIndex}>
              <div className="border border-[#E0E6F7] bg-white p-6 rounded-[16px] h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[81px] h-[81px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {review.userId.first_name ? (
                      <div className="text-2xl font-semibold text-gray-600">
                        {review.userId.first_name.charAt(0)}
                        {review.userId.last_name?.charAt(0) || ''}
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-600">U</div>
                    )}
                  </div>
                  <div>
                    <h6 className="text-[16px] font-semibold text-[#333333] mb-2">
                      {review.userId.first_name} {review.userId.last_name}
                    </h6>
                    <div className="flex items-center gap-[5px]">
                      {[...Array(parseInt(review.star))].map((_, i) => (
                        <FaStar key={i} className="text-[#FFCA40] text-[14px]" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-[#707070] font-regular leading-[1.6] line-clamp-5 mb-2">
                  {review.description}
                </p>
                <a href="#" className="text-[14px] font-semibold text-[#051a6f] underline">
                  Read More
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}