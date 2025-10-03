import { useState, useEffect } from "react";
import { wordpressApi } from "@/lib/api";
import PageBanner from "@/components/sections/PageBanner";
import { FaCalendarAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from "next/image";
import Link from "next/link";
import Head from 'next/head';
export default function Blog() {
  const [blogData, setBlogData] = useState([]);
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const blogsPerPage = 9;
  console.log("seoData::", seoData);
  console.log("blogData::", blogData);
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [pageResponse, blogsResponse] = await Promise.all([
          wordpressApi.get('/pages?slug=blog'),
          wordpressApi.get('/posts?_embed&per_page=100')
        ]);

        setPageData(pageResponse[0]?.acf);
        setBlogData(blogsResponse);
        //   setSeoData({
        //   yoast_head_json: data.yoast_head_json,
        //   yoast_head: data.yoast_head,
        // });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogData.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogData.length / blogsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

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

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
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

      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* <div className="px-4 text-center mb-10">
            <h3 className="text-sm font-semibold text-[#051a6f] uppercase mb-2">Our News</h3>
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] leading-[38px] sm:leading-[44px] md:leading-[52px] lg:leading-[60px] font-semibold font-manrope text-black text-center mb-10 capitalize">
              Here is our blog&apos;s latest company news.
            </h2>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {currentBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="block bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
              >
                <div className="relative h-60">
                  {blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                    <Image
                      src={blog._embedded['wp:featuredmedia'][0].source_url}
                      alt={blog.title.rendered}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-sm font-medium text-[#051a6f]">
                    {blog._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized'}
                  </span>
                  <h3
                    className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition"
                    dangerouslySetInnerHTML={{ __html: blog.title.rendered }}
                  />
                  <p
                    className="text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.excerpt.rendered }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>{formatDate(blog.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye />
                    <span>0</span> {/* Replace with actual view count if available */}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {blogData.length > blogsPerPage && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <FaChevronRight />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}