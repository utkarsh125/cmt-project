"use client"

import { EnvelopeIcon, PhoneCallIcon } from '@phosphor-icons/react'

import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <>
    <nav className='w-full bg-blue-400 items-center text-white flex justify-between py-6'>

        <div>
            {/* company name + logo */}
            {/* todo: add image placeholder later */}
            AutoMob-Mechanic 
        </div>

        <div className='flex gap-3'>
            {/* nav-group */}
            {/* home */}
            <Link href={`/`}>Home</Link>
            <Link href={`/auth/login`}>Login</Link>
            <span className='flex gap-1 items-center'>
                <EnvelopeIcon size={16}/>
                <Link href={`mailto:somemail@abc.com`}>contact@automob.co.in</Link>
            </span>
            <span className='flex gap-1 items-center'>
                <PhoneCallIcon size={16}/>
                <Link href={``}>+12 123456789</Link>
            </span>
            {/* todo: add hl for phone number as well */}
            {/* auth (signup/login) */}
            {/* email (can include mailto: href) */}
            {/* contact details */}

        </div>
    </nav>
    </>
  )
}

export default Navbar