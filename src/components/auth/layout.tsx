import AuthBg from "@/images/auth-bg.png";
import AuthLogo from "@/components/icons/auth/authLogo";
import Image from "next/image";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen">
      <div className="flex ">
        <div className="w-1/2 p-6 flex flex-col justify-center items-center">
            {children}
        </div>
        <div className="w-1/2 relative h-screen">
          <Image
            aria-hidden
            priority
            className="w-full h-full"
            src={AuthBg}
            alt="auth bg"
            width={0}
            height={0}
          /> 
          <AuthLogo className="absolute top-0 bottom-0 left-0 right-0 m-auto max-md:w-[150px] max-md:h-[150px]" />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout