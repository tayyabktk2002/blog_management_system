'use client'
import { useParams } from 'next/navigation'
import EditTiptap from '@/components/EditTiptap'
import React from 'react'

const EditBlogPage = () => {
  const params = useParams()
  const { id } = params

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10'>
      <EditTiptap blogId={id} />
    </div>
  )
}

export default EditBlogPage