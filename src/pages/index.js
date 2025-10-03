// src/pages/index.js
import { useState, useEffect } from "react";
import Head from 'next/head';
import { wordpressApi, api } from "@/lib/api";
import { useUI } from "@/context/UIContext";
import { getReferralId } from "../utils/helpers";
import HeroBanner from "@/components/sections/HeroBanner";
import HealthInsuranceSection from "@/components/sections/HealthInsuranceSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialSlider from "@/components/sections/TestimonialSlider";
import FaqSection from "@/components/sections/FaqSection";
import LogoSlider from "@/components/sections/LogoSlider";
import Button from "@/components/ui/Button";
import MembershipForm from "./admin/create-team";
import GetQuoteForm from "@/components/forms/GetQuoteForm";
import StepTwoForm from "@/components/forms/StepTwoForm";


export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [agentId, setAgentId] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const referralId = getReferralId();
  console.log(referralId);
  console.log("pageData::", pageData);
  console.log("seoData::", seoData);
  const { openModal, showMessage } = useUI();
  const handleOpenInfoModal = () => {
    openModal(
      <div className="modal-box">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{pageData?.step_form_title}</h3>
        <p className="text-gray-700 mb-6">{pageData?.step_form_short_description}</p>
        <GetQuoteForm agentId={agentId} />
      </div>
    );
  };
  const handleOpenInfoModalStepTwo = () => {
    openModal(
      <div className="modal-box">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{pageData?.step_form2_title}</h3>
        <p className="text-gray-700 mb-6">{pageData?.step_form2_short_description} </p>
        <StepTwoForm />
      </div>
    );
  };

  const handleOpenInfoModalStepThree = () => {
    openModal(
      <div className="modal-box">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{pageData?.step_form3_title}</h3>
        <p className="text-gray-700 mb-6">{pageData?.step_form3_short_description} </p>
        {/* <StepThreeForm /> */}
        <h2>Coming Soon...</h2>
      </div>
    );
  };

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await wordpressApi.get('/pages/6');
        console.log("whole page data::", data);
        setPageData(data.acf);
        setSeoData({
          yoast_head_json: data.yoast_head_json,
          yoast_head: data.yoast_head,
        });
      } catch (err) {
        console.error('Failed to fetch WordPress page data:', err);
        setError('Failed to load page data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      // if (!referralId) return;

      setLoadingReviews(true);
      try {
        const response = await api.get(`/get-review/${referralId}`);
        console.log("review response::", response);
        if (response.data) {
          setAgentId(response?.data?.agent?._id);
          setReviews(Array.isArray(response.data) ? response.data : [response.data]);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [referralId]);

  // 👇 Handle scrolling to section if hash exists
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1); // remove #
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 500); // small delay to ensure component is mounted
      }
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        {seoData?.yoast_head && (
          <>
            {/* Render the title */}
            <title>{seoData.yoast_head_json?.title || 'Default Title'}</title>

            {/* Render meta tags */}
            {seoData.yoast_head_json?.description && (
              <meta name="description" content={seoData.yoast_head_json.description} />
            )}

            {/* Render canonical URL */}
            {seoData.yoast_head_json?.canonical && (
              <link rel="canonical" href={seoData.yoast_head_json.canonical} />
            )}

            {/* Render Open Graph tags */}
            {seoData.yoast_head_json?.og_title && (
              <meta property="og:title" content={seoData.yoast_head_json.og_title} />
            )}
            {seoData.yoast_head_json?.og_description && (
              <meta property="og:description" content={seoData.yoast_head_json.og_description} />
            )}
            {seoData.yoast_head_json?.og_image && (
              <meta property="og:image" content={seoData.yoast_head_json.og_image[0]?.url} />
            )}
            {seoData.yoast_head_json?.og_url && (
              <meta property="og:url" content={seoData.yoast_head_json.og_url} />
            )}
            <meta property="og:type" content="website" />

            {/* Render Twitter Card tags */}
            {seoData.yoast_head_json?.twitter_card && (
              <meta name="twitter:card" content={seoData.yoast_head_json.twitter_card} />
            )}
            {seoData.yoast_head_json?.twitter_title && (
              <meta name="twitter:title" content={seoData.yoast_head_json.twitter_title} />
            )}
            {seoData.yoast_head_json?.twitter_description && (
              <meta name="twitter:description" content={seoData.yoast_head_json.twitter_description} />
            )}
            {seoData.yoast_head_json?.twitter_image && (
              <meta name="twitter:image" content={seoData.yoast_head_json.twitter_image} />
            )}

            {/* Render other meta tags from yoast_head */}
            <meta name="robots" content={seoData.yoast_head_json?.robots || 'index, follow'} />
          </>
        )}
      </Head>
      <HeroBanner pageData={pageData} onOpenModal={handleOpenInfoModal} />
      <LogoSlider pageData={pageData} />
      <HealthInsuranceSection pageData={pageData} />
      <HowItWorksSection pageData={pageData} onOpenModal={handleOpenInfoModal} onOpenModal2={handleOpenInfoModalStepTwo} onOpenModal3={handleOpenInfoModalStepThree} />
      <TestimonialSlider pageData={pageData} reviews={reviews} loading={loadingReviews} />
      <FaqSection pageData={pageData} />
    </>
  );
}