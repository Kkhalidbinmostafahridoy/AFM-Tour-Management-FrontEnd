import TravelReg from "@/assets/images/download (2).jpg";
import Logo from "@/assets/icons/Logo";
import { RegistrationFrom } from "@/components/Modules/Authentications/RegistrationFrom";
function Register() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center  ">
              <Logo />
            </div>
            AFM ToUr.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegistrationFrom />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={TravelReg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-110"
        />
      </div>
    </div>
  );
}

export default Register;
