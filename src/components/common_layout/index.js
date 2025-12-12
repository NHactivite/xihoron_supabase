import { Toaster } from "react-hot-toast";
import Footer from "../footer";
import Header from "../header";
import checkRole from "@/app/auth/checkRole";

export async function CommonLayout({ children }) {
  
  const {user,role}= await checkRole()
  

  return (
    <div
      className="mx-auto max-w-full "  >
      {/* header section */}

      <Header user={user} role={role} />

      {/* main content section */}
      <main className=" min-h-screen">{children}</main>

      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
    </div>
  );
}