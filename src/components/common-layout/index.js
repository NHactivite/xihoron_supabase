import { currentUser } from "@clerk/nextjs/server";
import { Toaster } from "react-hot-toast";
import Footer from "../footer";
import Header from "../header";
import { checkRole } from "@/auth/checkRole";
export async function CommonLayout({ children }) {
  const user = await currentUser();
  const role= await checkRole()
  
  
  return (
    <div
      className="mx-auto max-w-full  bg-gradient-to-br from-blue-100 via-white to-blue-100

"
    >
      {/* header section */}

      <Header user={JSON.parse(JSON.stringify(user))} role={role} />

      {/* main content section */}
      <main className="lg:px-8 min-h-screen">{children}</main>

      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
    </div>
  );
}
