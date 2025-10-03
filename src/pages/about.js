import { useState, useEffect } from "react";
import { wordpressApi } from "@/lib/api";
import ContentWithImage from "@/components/sections/ContentWithImage";
import FaqSection from "@/components/sections/FaqSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import LogoSlider from "@/components/sections/LogoSlider";
import PageBanner from "@/components/sections/PageBanner";
import Head from 'next/head';

export default function About() {
  const [pageData, setPageData] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("pageData::", pageData);
  console.log("seoData::", seoData);
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await wordpressApi.get('/pages/96');
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
      <PageBanner pageData={pageData} />
      {/* <LogoSlider pageData={pageData} /> */}
      <ContentWithImage pageData={pageData} />
      {/* <HowItWorksSection pageData={pageData} /> */}
      {/* <FaqSection pageData={pageData} /> */}
    </>
  );
}
