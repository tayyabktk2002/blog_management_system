import React from "react";
import createDOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import ActionBtn from "./ActionBtn";

const decodeHtmlEntities = (html) => {
  if (!html) return '';
  if (typeof window !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }
  return html;
};

const Blog = ({ blog }) => {
  const sanitizeAndDecodeHtml = (html) => {
    if (!html) return '';
    const decoded = decodeHtmlEntities(html);
    if (typeof window !== 'undefined') {
      return createDOMPurify(window).sanitize(decoded);
    }
    return decoded;
  };
 
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{blog.author} {blog.owner && "(Your Blog)"}</span>
          <span className="mx-2">•</span>
          <span>{blog.date}</span>
          <span className="mx-2">•</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h2>

        {/* Render server-provided HTML safely */}
        <div
          className="text-gray-600 line-clamp-3 mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: sanitizeAndDecodeHtml(blog.content || ""),
          }}
        />

      <Link href={`/blog/${blog.id}`} className="group" >
        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
          <span>Read more</span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
        {blog.owner && (
         <ActionBtn blog_id = {blog.id}/>
        )}
      </div>
    </article>
  );
};

export default Blog;
