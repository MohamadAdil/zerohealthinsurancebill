import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { wordpressApi } from "@/lib/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowLeft, FaClock, FaCommentAlt } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingTime, setReadingTime] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch post by slug
        const response = await wordpressApi.get(`/posts?slug=${slug}&_embed`);
        
        if (response.length === 0) {
          throw new Error('Post not found');
        }

        const postData = response[0];
        setPost(postData);

        // Calculate reading time
        const textContent = postData.content.rendered.replace(/<[^>]*>?/gm, '');
        const wordCount = textContent.split(/\s+/).length;
        const time = Math.ceil(wordCount / 200); // 200 words per minute
        setReadingTime(time);

      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/blog" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.['wp:term']?.find(terms => terms[0]?.taxonomy === 'category') || [];
  const tags = post._embedded?.['wp:term']?.find(terms => terms[0]?.taxonomy === 'post_tag') || [];

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title.rendered,
        text: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 100),
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title.rendered)}&url=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <>
      <Head>
        <title>{post.title.rendered} | Your Blog Name</title>
        <meta name="description" content={post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title.rendered} />
        <meta property="og:description" content={post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160)} />
        <meta property="og:url" content={`https://yourdomain.com/blog/${post.slug}`} />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title.rendered} />
        <meta name="twitter:description" content={post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160)} />
        {featuredImage && <meta name="twitter:image" content={featuredImage} />}
      </Head>

      <article className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition">
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-12">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  href={`/blog/category/${category.slug}`}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm md:text-base">
            {author && (
              <div className="flex items-center">
                <FaUser className="mr-2" />
                <span>{author.name}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(post.date)}</span>
            </div>

            {readingTime && (
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>{readingTime} min read</span>
              </div>
            )}

            <button 
              onClick={sharePost}
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <FiShare2 className="mr-2" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Featured image */}
        {featuredImage && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={featuredImage}
                alt={post.title.rendered}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          </div>
        )}

        {/* Article content */}
        <div 
          className="prose prose-lg max-w-none prose-blue prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments section (optional) */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            <FaCommentAlt className="inline mr-2" />
            Comments
          </h3>
          <div id="comments" className="space-y-6">
            {post.comment_count > 0 ? (
              // Render comments here
              <p>Comments will be displayed here</p>
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div> */}
      </article>
    </>
  );
}