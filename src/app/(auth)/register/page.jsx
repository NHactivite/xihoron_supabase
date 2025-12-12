import SignUpForm from "@/components/authFroms/SignUpForm";
import Link from "next/link";
import React from "react";

const SignUp = async () => {
  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <SignUpForm />
        <div className="mt-2 flex items-center justify-center">
          <h1>Already have an account?</h1>
          <Link className="font-bold ml-2" href="/login">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
