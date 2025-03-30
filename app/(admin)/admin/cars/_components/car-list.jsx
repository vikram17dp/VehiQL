"use client"
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const CarsList = () => {
    const router = useRouter()
    const[search,setSearch] = useState("")
    const handleSearchSubmit = (e)=>{
        e.preventDefault();
    }
  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
      <Button
        onClick={()=>router.push("/admin/cars/create")}
        className='flex items-center'
      >
        <Plus className='h-4 w-4'/> Add Car
      </Button>
      <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              placeholder="Search cars..."
              type="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
    </div>
    </div>

  )
}

export default CarsList
