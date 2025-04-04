"use client"; // Ensure client-side rendering

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated, signOut } from "@/lib/actions/auth.action";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsUserAuthenticated(auth);

      if (auth && pathname === "/") {
        router.replace("/dashboard");
      } 
      // Allow access to sign-in and sign-up pages
      else if (!auth && pathname !== "/" && pathname !== "/sign-in" && pathname !== "/sign-up"&& pathname !== "/interviewnosign") {
        router.replace("/");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsUserAuthenticated(false);
    setIsSigningOut(false);
    router.push("/");
  };

  if (isUserAuthenticated === null) return null; // Prevent UI flicker

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
    {/* Navbar for Sign Up Page*/}
{pathname === "/sign-up" && !isUserAuthenticated && (
  <nav className="fixed top-2 left-2 flex items-center justify-between bg-transparent shadow-lg px-6 py-2 w-full max-w-[400px]">
    <ul className="flex gap-4">
      <button onClick={() => handleNavigate("/")} className="btn-primary">
        Home
      </button>
    </ul>
  </nav>
)}

{/* Navbar for Sign In Page */}
{pathname === "/sign-in" && !isUserAuthenticated && (
  <nav className="fixed top-2 left-2 flex items-center justify-between bg-transparent shadow-lg px-6 py-2 w-full max-w-[400px]">
    <ul className="flex gap-4">
    <button onClick={() => handleNavigate("/")} className="btn-primary">
        Home
      </button>
    </ul>
  </nav>
)}

      {/* Show the logo only on the homepage */}
      {pathname === "/" && (
        <div className="mt-7 ml-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={25} height={25} />
          </Link>
        </div>
      )}

      {/* Navbar for the homepage (Sign In/Sign Up) */}
      {pathname === "/" && (
        <nav className="fixed top-2 -right-35 flex items-center justify-between bg-transparent shadow-lg px-6 py-2 w-full max-w-[400px]">
          <ul className="flex gap-4">
            <button onClick={() => handleNavigate("/sign-in")} className="btn-primary">
              Sign In
            </button>
            <button onClick={() => handleNavigate("/sign-up")} className="btn-primary">
              Sign Up
            </button>
          </ul>
        </nav>
      )}

      {/* Navbar for the dashboard (Start New Interview / Sign Out) */}
      {pathname === "/dashboard" && isUserAuthenticated && (
        <nav className="fixed top-2 -right-20 flex items-center justify-between bg-transparent shadow-lg px-6 py-2 w-full max-w-[400px]">
          <ul className="flex gap-4">
            <button onClick={() => handleNavigate("/interview")} className="btn-primary">
              New Interview
            </button>
            <button onClick={handleSignOut} className="btn-primary">
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </ul>
        </nav>
      )}

       {/* Navbar for the Interview -AuthUsers (Dashboard ) */}
       {pathname === "/interview" && isUserAuthenticated && (
        <nav className="fixed top-2 -right-50 flex items-center justify-between bg-transparent shadow-lg px-6 py-2 w-full max-w-[400px]">
          <ul className="flex gap-4">
            <button onClick={() => handleNavigate("/dashboard")} className="btn-primary">
             Dashboard
            </button>
          </ul>
        </nav>
      )}

{/* Navbar for Unauthorized Users */}
{pathname === "/interviewnosign" && !isUserAuthenticated && (
  <nav className="fixed top-2 -right-40 flex items-center justify-between bg-transparent shadow-lg px-6 py-2 w-full max-w-[400px]">
    <ul className="flex gap-4">
      <button onClick={() => handleNavigate("/")} className="btn-primary">
        Back
      </button>
      <button onClick={() => handleNavigate("/sign-up")} className="btn-primary">
        Sign Up
      </button>
    </ul>
  </nav>
)}


    </>
  );
};

export default Navbar;

