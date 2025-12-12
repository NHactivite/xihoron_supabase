import ForgotPassword from "@/components/password/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px]">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
         Forgot password
        </h2>
          <ForgotPassword />
        </section>
      </div>
    </>
  );
}
