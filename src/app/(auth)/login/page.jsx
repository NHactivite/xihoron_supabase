import LoginForm from "@/components/authFroms/LoginForm";
import LoginGithub from "@/components/authFroms/LoginGithub";
import LoginGoogle from "@/components/authFroms/LoginGoogle";
import Link from "next/link";

export default function LoginPage() {

  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px]">
          <LoginForm />
         <div className="lg:mx-0 mx-5">
         <LoginGithub />
         <LoginGoogle/>
         <div className="mt-2 flex items-center justify-center ">
            <h1>{`Don't have an account?`}</h1>
            <Link className="font-bold ml-2" href="/register">
              Sign Up
            </Link>
          </div>
          <div className="mt-2 flex items-center justify-center">
            <h1>{`Forgot your password?`}</h1>
            <Link className="font-bold ml-2" href="/forgot-password">
              Reset Password
            </Link>
          </div>
         </div>
        </section>
      </div>
    </>
  );
}
