import logo from "@public/logo/logo-black.svg";
import Image from "next/image";

const HeaderAuth = () => {
  return (
    <header className="flex h-20 items-center border-b">
      <div className="flex items-center gap-6">
        <div className="relative ml-17 size-14">
          <Image
            alt="Urban Realty"
            className="object-contain"
            fill
            src={logo}
          />
        </div>
        <span className="text-lg">Urban Realty</span>
      </div>
    </header>
  );
};

export default HeaderAuth;
