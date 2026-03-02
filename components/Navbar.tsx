import { SignedIn, UserButton } from '@clerk/nextjs'
import NavbarItems from './NavbarItems'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav className='md:pl-[20vw] lg:pl-[15vw] py-6 fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex justify-between items-center w-full px-4'>
        <div className='md:hidden'>
           <Image 
                src="/logo/logo.svg"
                alt='logo'
                width={34}
                height={34}
                className='object-contain'
            />
        </div>
        
        <div className='flex items-center justify-between gap-4'> {/* This will be on the right with justify-between */}
            <div className='hidden md:block w-0 md:w-[45vw] lg:w-[65vw]'>
            
        </div>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <NavbarItems />
        </div>
    </nav>
  )
}

export default Navbar