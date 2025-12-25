"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BlogCom from '@/components/BlogCom';
import { CreateBtn } from "@/components/CreateBtn";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from "next/navigation";

const Blog = () => {
  const router = useRouter();
  const [posts, setPosts] = useState({ data: [], meta: { total: 0, page: 1, totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(JSON.parse(userData));
    fetchPosts();
  }, [router]);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}post/user-posts?page=${page}&limit=6`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
          cache: 'no-store'
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to load user posts", res.status, text);
        toast.error("Failed to load user blogs");
        setPosts({ data: [], meta: { total: 0, page: 1, totalPages: 1 } });
        return;
      }

      const data = await res.json();
      setPosts(data);
      setCurrentPage(page);
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const blogs = posts.data.map((post) => ({
    id: post._id,
    title: post.title,
    content: post.content,
    author: post.author_id?.name || post.author || "You",
    date: post.createdAt
      ? new Date(post.createdAt).toLocaleDateString()
      : "",
    owner: currentUser && post.author_id?._id === currentUser.id
  }));



  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Your Blogs</h1>
          <p className="text-xl text-white/80">Manage and view your posts</p>
          <div className="w-24 h-1 bg-white/30 mx-auto mt-6 rounded-full"></div>
        </div>
         <CreateBtn/>
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {blogs.length === 0 && !loading ? (
            <div className="col-span-full text-center text-white/80">
              No posts found.
            </div>
          ) : loading ? (
            <div className="col-span-full">
              <LoadingSpinner text="Loading your posts..." />
            </div>
          ) : (
            blogs.map((blog) => (
                <BlogCom blog={blog} key={blog.id}/>
            ))
          )}
        </div>
        
         {posts.meta.totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => fetchPosts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50"
                >
                  Previous
                </button>
                
                <span className="text-white/80 px-4">
                  Page {currentPage} of {posts.meta.totalPages}
                </span>
                
                <button
                  onClick={() => fetchPosts(currentPage + 1)}
                  disabled={currentPage === posts.meta.totalPages}
                  className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50"
                >
                  Next
                </button>
              </div>
            )}
      </div>
    </div>
  );
};

export default Blog;
