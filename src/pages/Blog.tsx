import { useGetAllBlogsQuery } from "@/redux/features/blog/blog.api";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const { data: blogs = [], isLoading } = useGetAllBlogsQuery(undefined);

  return (
    <PageWrapper className="min-h-screen">
      <div className="pb-24" style={{ background: "linear-gradient(180deg,#0f0c29 0%,#1a1740 55%,#0d0d1a 100%)" }}>
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-20 pb-16 px-4">
        {/* Glow blobs */}
        <div
          className="absolute -top-24 left-1/3 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#6c63ff,transparent)" }}
        />
        <div
          className="absolute -bottom-10 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#f093fb,transparent)" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#a5b4fc",
              backdropFilter: "blur(10px)",
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Travel Insights & Guides
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
            style={{
              background: "linear-gradient(135deg,#fff 0%,#a5b4fc 50%,#f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Stories From
            <br />
            The Road
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg"
            style={{ color: "rgba(165,180,252,0.75)" }}
          >
            Discover tips, destination guides, and stories from our expert travelers.
          </motion.p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-6xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogs.length === 0 ? (
              <div
                className="col-span-full text-center p-16 rounded-3xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <BookOpen className="w-14 h-14 mx-auto mb-4" style={{ color: "rgba(165,180,252,0.3)" }} />
                <h3 className="text-2xl font-extrabold text-white mb-2">No articles yet</h3>
                <p style={{ color: "rgba(165,180,252,0.5)" }}>Check back soon for exciting travel stories!</p>
              </div>
            ) : (
              blogs.map((blog: any, idx: number) => (
                <motion.article
                  key={blog._id}
                  variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -8 }}
                  className="group rounded-3xl overflow-hidden flex flex-col transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Image */}
                  {blog.image ? (
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Number badge */}
                      <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                        style={{ background: "rgba(108,99,255,0.8)", backdropFilter: "blur(8px)" }}
                      >
                        {idx + 1}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="aspect-[16/10] flex items-center justify-center relative"
                      style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
                    >
                      <BookOpen className="w-10 h-10" style={{ color: "rgba(165,180,252,0.3)" }} />
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "rgba(165,180,252,0.55)" }}
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "rgba(165,180,252,0.55)" }}
                      >
                        <User className="w-3 h-3" />
                        {blog.author || "Admin"}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      className="text-lg font-extrabold text-white mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300"
                    >
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                      className="text-sm mb-5 line-clamp-3 flex-1"
                      style={{ color: "rgba(165,180,252,0.65)" }}
                    >
                      {blog.content}
                    </p>

                    {/* CTA */}
                    <Button
                      variant="outline"
                      className="w-full rounded-xl font-bold text-sm flex items-center gap-2 justify-center transition-all duration-300 group-hover:scale-[1.02]"
                      style={{
                        background: "rgba(108,99,255,0.1)",
                        border: "1px solid rgba(108,99,255,0.25)",
                        color: "#a5b4fc",
                      }}
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>

                  {/* Bottom glow on hover */}
                  <div
                    className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg,#6c63ff,#a855f7,#f093fb)" }}
                  />
                </motion.article>
              ))
            )}
          </motion.div>
        )}
      </div>
      </div>
    </PageWrapper>
  );
}
