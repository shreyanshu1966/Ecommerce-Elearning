import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  User,
  Share2,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { Link } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data);
        generateToc(data.content);
      } catch (error) {
        console.error("Error fetching blog:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const generateToc = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    const tocItems = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent,
      level: heading.tagName.toLowerCase()
    }));
    setToc(tocItems);
  };

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl inline-block">
          Blog post not found
        </div>
        <Link
          to="/blogs"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="inline mr-2" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/blogs"
        className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        All Articles
      </Link>

      {/* Hero Section */}
      <div className="relative mb-12 rounded-2xl overflow-hidden">
        <div className="relative h-96">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4 max-w-3xl">{blog.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {blog.author}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {blog.category && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {blog.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-12">
        {/* Article Content */}
        {/* 
            Center the text column a bit more by limiting width 
            and using mx-auto so it doesn't stretch across the page.
        */}
        <div className="prose prose-lg max-w-3xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-gray-600 hover:text-blue-600 transition-colors ${
                      item.level === 'h3' ? 'pl-4 text-sm' : 'font-medium'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Social Sharing */}
          {/* 
              Center the heading and the buttons with text-center + justify-center.
              You can also style these buttons further (e.g., remove border, 
              add hover effects, etc.) to make them stand out more.
          */}
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={shareBlog}
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  blog.title
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Twitter className="h-5 w-5 text-blue-400" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  window.location.href
                )}&title=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-blue-700" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {blog.relatedPosts && blog.relatedPosts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blog.relatedPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blogs/${post._id}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetail;
