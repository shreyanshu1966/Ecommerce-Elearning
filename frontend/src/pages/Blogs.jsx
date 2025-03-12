import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Clock, Tag } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/blogs")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Latest Insights</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover expert articles, tutorials, and industry news in robotics and STEM education
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <article 
            key={blog._id}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <Link to={`/blogs/${blog._id}`} className="block">
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {blog.category && (
                  <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    {blog.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                <div className="prose prose-gray line-clamp-3 mb-4">
                  {blog.content}
                </div>
                <div className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No articles found</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
