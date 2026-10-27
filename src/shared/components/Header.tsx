import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  UserRound,
  UserRoundPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Logo from '@/shared/components/Logo'
import Navigation from '@/shared/components/header/Navigation'
import SearchForm from '@/shared/components/header/SearchForm'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loggedOut } from '@/features/auth/authSlice'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const wishlistCount = useAppSelector((state) => state.wishlist.ids.length)
  const session = useAppSelector((state) => state.auth.session)
  const dispatch = useAppDispatch()

  return (
    <header className="border-b border-border bg-background">
      <div className="container flex flex-wrap items-center justify-between gap-x-2 gap-y-4 sm:gap-x-4 py-5 lg:flex-nowrap lg:gap-6 lg:py-5">
        <Logo />
        <div className="hidden lg:block">
          <Navigation />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          <div className="mr-2 hidden lg:block">
            <SearchForm />
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 sm:size-9 rounded-full [&_svg]:size-6"
          >
            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative"
            >
              <Heart className="size-6" strokeWidth={1.7} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-4 text-white"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 sm:size-9 rounded-full [&_svg]:size-6"
          >
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart
                className="size-6"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account menu"
                className="size-8 sm:size-9 rounded-full data-[state=open]:bg-primary data-[state=open]:text-white [&_svg]:size-6"
              >
                <UserRound
                  className="size-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={16}
              className="w-52 rounded-sm border-0 bg-black/80 p-2 text-white shadow-lg backdrop-blur-md"
            >
              {session ? (
                <>
                  <DropdownMenuLabel className="max-w-48 truncate px-3">
                    {session.userName}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onSelect={() => dispatch(loggedOut())}
                    className="gap-3 px-3 py-3 focus:bg-white/15 focus:text-white"
                  >
                    <LogOut className="size-5 text-white" aria-hidden="true" />
                    Log Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    asChild
                    className="gap-3 px-3 py-3 focus:bg-white/15 focus:text-white"
                  >
                    <Link to="/login">
                      <LogIn className="size-5 text-white" aria-hidden="true" />
                      Log In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="gap-3 px-3 py-3 focus:bg-white/15 focus:text-white"
                  >
                    <Link to="/register">
                      <UserRoundPlus
                        className="size-5 text-white"
                        aria-hidden="true"
                      />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="size-8 sm:size-9 lg:hidden [&_svg]:size-6"
              >
                <Menu className="size-6" strokeWidth={1.7} aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(320px,85vw)]">
              <SheetHeader className="border-b px-6 py-6">
                <SheetTitle>FastCart</SheetTitle>
                <SheetDescription>Explore the store</SheetDescription>
              </SheetHeader>
              <div className="px-6 py-4">
                <Navigation mobile onNavigate={() => setMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="w-full lg:hidden">
          <SearchForm />
        </div>
      </div>
    </header>
  )
}

export default Header
