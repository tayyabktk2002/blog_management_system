"use client"
import React, { useState, useEffect } from 'react'
import createDOMPurify from "isomorphic-dompurify";
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from "next/navigation";

const decodeHtmlEntities = (html) => {
  if (!html) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

const sanitizeHtml = (html) => {
  if (!html) return '';
  try {
    // First decode HTML entities
    const decoded = decodeHtmlEntities(html);
    
    if (typeof window !== 'undefined') {
      const DOMPurify = createDOMPurify(window);
      return DOMPurify.sanitize(decoded);
    }

    let safe = String(decoded).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    safe = safe.replace(/\son\w+\s*=\s*(["'])[\s\S]*?\1/gi, '');
    safe = safe.replace(/href\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, 'href="#"');
    return safe;
  } catch (e) {
    console.warn('Sanitizer failed, falling back to stripping scripts', e);
    return String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }
};
const BlogDetail = () => {
  const { removeBlog } = useAuth();
  const params = useParams();
  const { id } = params;
  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);
    const router = useRouter();


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userData = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        const currentUser = userData && token ? JSON.parse(userData) : null;
        
        const response = await fetch(`http://72.60.104.179:5000/api/v1/post/details/${id}`, {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const post = await response.json();
          setPostDetails({
            title: post.data.title,
            content: post.data.content,
            author: post.data.author_id?.name || post.author || 'Unknown',
            date: post.data.createdAt ? new Date(post.data.createdAt).toLocaleDateString() : '',
            owner: currentUser && post.data.author_id?._id === currentUser.id
          });
        }
      } catch (error) {
        console.log('API error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const deleteBlog = async (blogId) => {
    await removeBlog(blogId);
    router.push('/blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner text="Loading post..." />
        </div>
      </div>
    );
  }
    
  if (!postDetails) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/80">Post not found or failed to load.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="mb-6">
            <div className="flex items-center text-sm text-white/70 mb-4">
              <span>{postDetails.author}</span>
              <span className="mx-2">•</span>
              <span>{postDetails.date}</span>
              <span className="mx-2">•</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-6">
              {postDetails.title}
            </h1>
          </div>
          
            <div
              className="text-white mb-4 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(postDetails?.content || '') }}
            />
       {postDetails.owner && (
          <div className="flex justify-end flex-row gap-3">
            <div className="">
              <button onClick={() => deleteBlog(id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
            <div className="flex justify-end">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Edit
              </button>
            </div>
          </div>
        )}
        </article>
      </div>
    </div>
  )
}

export default BlogDetail