"use client";

// import { UserButton ,SignOutButton} from "@clerk/nextjs";
import { AlignJustify, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Input } from "../ui/input";
import { SignOutButton } from "@clerk/nextjs";

function Header({ user, role, isAdmin }) {
    const [open, setOpen] = useState(false);
  
  const menuItems = [
    {
      label: "Home",
      path: "/",
      show: true,
    },
    {
      label: "Login",
      path: "/sign-in",
      show: !user,
    },
    {
      label: "Register",
      path: "/sign-up",
      show: !user,
    },
    {
      label: "cart",
      path: "/cart",
      show: user,
    },
    {
      label: "wishlist",
      path: "/wishList",
      show: user,
    },

    {
      label: "Admin",
      path: "/admin/newProduct",
      show: role==="admin",
    },
    {
      label: "Account",
      path: "/account",
      show: user,
    },
   
  ];
  

  
  return (
    <header className="flex h-16 w-full shrink-0 items-center sticky top-0 bg-white z-50 p-4  mb-3 shadow">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden flex items-center gap-2 p-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/20 transition"
          >
            <AlignJustify className="h-6 w-6  text-white" />
            <span className="sr-only">Toggle Navigation Menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 bg-[#0F172A] text-white border-r border-white/10 shadow-xl"
        >
          <Link href="/" className="flex items-center mb-6">
            <SheetTitle className="text-2xl font-bold text-white">
              Flower Store
            </SheetTitle>
          </Link>
          <div className="grid gap-4">
            {menuItems.map((item, idx) =>
              item.show ? (
                <Link
                  key={idx}
                  href={item.path}
                  onClick={() => {
                    setOpen(false); 
                    sessionStorage.removeItem("filterParams")
                }}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition text-lg font-medium"
                >
                  {item.label}
                </Link>
              ) : null
            )}
            <div className="mt-4 border-t border-white/20 pt-4 z-50 flex justify-around">
            {isAdmin && <Link href="/admin" className="group inline-flex h-9 w-max items-center bg-white text-black  rounded-md  px-4 py-2 text-sm font-medium active:bg-black active:text-white">Admin</Link>}
            {user && <SignOutButton className="group inline-flex h-9 w-max items-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium active:bg-black active:text-white">Logout</SignOutButton>}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Link
        className="hidden  lg:flex mr-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-400 "
        href={"/"}
      >
        Flower Store
      </Link>
        <div className="flex gap-2 ml-45">
                <Input
                  placeholder="find the best choice..."
                  className="flex-1 text-sm"
                //   value={query}
                //   onChange={(e) => {
                //     setJobResult({});
                //     setQuery(e.target.value);
                //     setShowBox(false)
                //   }}
                />
                <Button
                  size="icon"
                  className="bg-violet-600 hover:bg-violet-700"
                //   onClick={handleSearch}
                //   disabled={isPending}
                >
                  <Search className="h-4 w-4" />
                </Button>
        </div>
      <nav className="ml-auto hidden lg:flex gap-6">
        {menuItems.map((item, idx) =>
          item.show ? (
            <Link
              key={idx}
              onClick={() => sessionStorage.removeItem("filterParams")}
              href={item.path}
              className="group inline-flex h-9 w-max items-center rounded-md bg-white px-4 py-2 text-sm font-medium active:bg-black active:text-white"
            >
              {item.label}
            </Link>
          ) : null
        )}
        {isAdmin && <Link href="/admin" className="group inline-flex h-9 w-max items-center rounded-md bg-white px-4 py-2 text-sm font-medium active:bg-black active:text-white">Admin</Link>}
        {user && <SignOutButton className="group inline-flex h-9 w-max items-center rounded-md bg-white px-4 py-2 text-sm font-medium active:bg-black active:text-white">Logout</SignOutButton>}
      </nav>
    </header>
  );
}

export default Header;
