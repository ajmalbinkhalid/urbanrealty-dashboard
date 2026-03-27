import image from "@public/auth/auth-img.png";
import Image from "next/image";
import { ResetPasswordForm } from "../_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full flex-col max-md:items-center max-md:gap-4 md:flex-row md:justify-center">
      <section className="flex w-full flex-col items-center justify-center space-y-2 bg-auth-background px-4 max-md:h-2/5 md:w-1/2">
        <div className="relative mb-12 size-16">
          <Image
            alt="Urban Realty"
            className="object-contain"
            fill
            src={image}
          />
        </div>
        <h1 className="font-medium text-xl">Welcome to Urban Realty!</h1>
        <h3 className="font-medium text-[#6c7278]">Admin portal</h3>
        <p className="max-w-[45ch] text-center text-[#7a7a7a] text-sm">
          Access your dashboard, manage listings, and connect with clients
          seamlessly.
        </p>
      </section>
      <section className="relative flex max-md:h-3/5 md:mx-auto md:items-center">
        <ResetPasswordForm />
        <p className="absolute bottom-5 flex w-full justify-center text-xs">
          Copyright © Urban Realty 2025, All rights reserved.
        </p>
      </section>
    </div>
  );
}
