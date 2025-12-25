'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import BlogCom from '@/components/BlogCom';
import { CreateBtn } from '@/components/CreateBtn';
import LoadingSpinner from '@/components/LoadingSpinner';
import api from '@/services/api';

const Blog = () => {
  const [posts, setPosts] = useState({ data: [], meta: { total: 0, page: 1, totalPages: 1 } })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentUser, setCurrentUser] = useState(null)

  const fetchPosts = async (page = 1) => {
    setLoading(true)
    try {
      const response = await api.get(`post/list?page=${page}&limit=6`);
      setPosts(response.data)
      setCurrentPage(page)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (userData && token) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  const blogs = posts.data.map(post => ({
    id: post._id,
    title: post.title,
    content: post.content,
    author: post.author_id?.name || 'Unknown',
    date: new Date(post.createdAt).toLocaleDateString(),
    category: 'Blog',
    owner: currentUser && post.author_id?._id === currentUser.id
  }))
  

  if (blogs.length === 0 && !loading) return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Blogs</h1>
          <p className="text-xl text-white/80 mb-8">No blogs found. Create your first blog!</p>
          <Link href="/create-blog" className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50">
            Create Your First Blog ✨
          </Link>
        </div>
      </div>
    </div>
  )
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Blogs</h1>
          <p className="text-xl text-white/80">Discover amazing stories and insights</p>
          <div className="w-24 h-1 bg-white/30 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <CreateBtn/>
        
        {loading ? (
          <LoadingSpinner text="Loading blogs..." />
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {blogs.map(blog => (
                  <BlogCom blog={blog} key={blog.id} />
              ))}
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
          </>
        )}
      </div>
    </div>
  )
}

export default Blog