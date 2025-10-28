"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenSquare, Menu, X, LogOut, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, setUser, signOut } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const allNavItems = [
    { href: "/", label: "Home", public: true },
    { href: "/posts", label: "All Posts", public: true },
    { href: "/dashboard/categories", label: "Categories", public: false },
    { href: "/dashboard", label: "Dashboard", public: false },
  ];

  // Filter nav items based on authentication status
  const navItems = user 
    ? allNavItems 
    : allNavItems.filter(item => item.public);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-xl text-foreground">
              Articler
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 relative bg-muted/30 rounded-full p-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="relative">
                {isActive(item.href) && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: '#071f36' }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`
                    relative z-10 px-4 py-2 rounded-full text-sm font-medium font-sans transition-colors
                    ${
                      isActive(item.href)
                        ? "text-white"
                        : "text-foreground/70 hover:text-foreground"
                    }
                  `}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="text-white hover:opacity-90 font-sans"
                    style={{ backgroundColor: '#071f36' }}
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    Write Post
                  </Button>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#071f36' }}>
                      {user.email?.[0].toUpperCase()}
                    </div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 card py-2 shadow-lg"
                      >
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link href="/dashboard">
                          <button
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </button>
                        </Link>
                        <button
                          onClick={async () => {
                            await signOut();
                            setUserMenuOpen(false);
                            router.push("/");
                            router.refresh();
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-muted font-sans"
                    style={{ borderColor: '#071f36', color: '#071f36' }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="text-white hover:opacity-90 font-sans"
                    style={{ backgroundColor: '#071f36' }}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border"
          >
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                      px-4 py-3 rounded-full transition-colors text-sm font-medium font-sans
                      ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-foreground/70 hover:bg-muted"
                      }
                    `}
                    style={isActive(item.href) ? { backgroundColor: '#071f36' } : {}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="sm"
                      className="w-full text-white hover:opacity-90 font-sans"
                      style={{ backgroundColor: '#071f36' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <PenSquare className="h-4 w-4 mr-2" />
                      Write Post
                    </Button>
                  </Link>
                  <div className="px-4 py-2 border-t border-border mt-2 pt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      {user.email}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-50"
                      onClick={async () => {
                        await signOut();
                        setMobileMenuOpen(false);
                        router.push("/");
                        router.refresh();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full hover:bg-muted font-sans"
                      style={{ borderColor: '#071f36', color: '#071f36' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="w-full text-white hover:opacity-90 font-sans"
                      style={{ backgroundColor: '#071f36' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
