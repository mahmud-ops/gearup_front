"use client"
import { Spinner } from '@/components/ui/spinner'
import React from 'react'
const Loading = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner className='size-8'/>
    </div>
  )
}

export default Loading