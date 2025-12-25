"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Navber = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userState, setUserState] = useState({ name: "Guest", avatar: null });

  useEffect(() => {
    if (user) {
      setUserState({ name: user.name, avatar: null });
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUserState(JSON.parse(savedUser));
      }
    }
  }, [user]);

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link href="/" className="text-xl font-bold text-white">
              BlogApp
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                For You
              </Link>
              {
                user && (
                  <Link
                    href="/user-blog"
                    className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  >
                    My Blogs
                  </Link>
                ) 
              }
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-sm font-medium">
                      {userState.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {userState.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium transition-colors rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-black bg-white hover:bg-white/90 px-4 py-2 text-sm font-medium transition-colors rounded-full"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-medium transition-colors rounded-full border border-white/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/5 backdrop-blur-sm">
            <Link
              href="/"
              className="text-white/80 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              For You
            </Link>
            <Link
              href="/blog"
              className="text-white/80 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Your Blogs
            </Link>
            
            {user ? (
              <div className="border-t border-white/20 pt-4 pb-3">
                <div className="flex items-center px-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white font-medium">
                      {userState.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {userState.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white bg-red-600 hover:bg-red-700 px-3 py-2 text-base font-medium transition-colors rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-white/20 pt-4 pb-3 space-y-2">
                <Link
                  href="/login"
                  className="block text-black bg-white hover:bg-white/90 px-3 py-2 text-base font-medium transition-colors rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-white bg-white/20 hover:bg-white/30 px-3 py-2 text-base font-medium transition-colors rounded-lg border border-white/30 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navber;
