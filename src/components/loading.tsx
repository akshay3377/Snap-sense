import React from 'react'
import { Skeleton } from './ui/skeleton'

export default function Loading() {
  return (
<div className="flex flex-col space-y-3 mx-auto h-full   rounded-md  w-[50%] ">
        <Skeleton className="h-[145px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
  )
}



