import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft, CarFront, Heart } from 'lucide-react'

const Header = ({ isAdminPage = false }) => {
  const isAdmin = false;

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link className='flex' href={isAdminPage ? "/admin" : "/"}>
          <Image
            src="/logo.png"
            alt="Vehiql LOGO"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">Admin</span>
          )}
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            {/* If Admin Page, show "Back To App" */}
            {isAdminPage ? (
              <Link href="/">
                <Button variant="default">
                  <ArrowLeft size={18} />
                  <span className="hidden md:inline">Back To App</span>
                </Button>
              </Link>
            ) : (
              <>
                {/* Saved Cars Button */}
                <Link href="/saved-cars">
                  <Button variant="default">
                    <Heart size={18} />
                    <span className="hidden md:inline">Saved Cars</span>
                  </Button>
                </Link>

                {/* Reservations or Admin Panel Button */}
                {!isAdmin ? (
                  <Link href="/reservations">
                    <Button variant="default">
                      <CarFront size={18} />
                      <span className="hidden md:inline cursor-pointer">
                        Reservations
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/admin">
                    <Button variant="default">
                      <CarFront size={18} />
                      <span className="hidden md:inline cursor-pointer">
                        Admin Panel
                      </span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </SignedIn>
          <SignedOut>
            <SignInButton>
                <Button variant={"outline"}>
                    LogIn
                </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
                appearance={{
                    elements:{
                        avatarBox:"w-10 h-10"
                    }
                }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
