import { useGetAllBlogsQuery } from "@/redux/features/blog/blog.api";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  const { data: blogs = [], isLoading } = useGetAllBlogsQuery(undefined);

  return (
    <PageWrapper className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Insights & Guides</h1>
          <p className="text-lg text-gray-600">Discover tips, destination guides, and stories from our expert travelers.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-500">Check back soon for exciting travel stories!</p>
              </div>
            ) : (
              blogs.map((blog: any) => (
                <article key={blog._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
                  {blog.image && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author || 'Admin'}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                      {blog.content}
                    </p>
                    <Button variant="outline" className="w-full rounded-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors mt-auto">
                      Read Article
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
