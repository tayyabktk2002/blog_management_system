import Link from 'next/link'
import React from 'react'

export const CreateBtn = () => {
  return (
   <div className="flex justify-end mb-8"> 
          <Link href="/create-blog" className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Blog
          </Link>
        </div>
    
  )
}
