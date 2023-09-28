import Logo from "@components/ui/logo";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import RegistrationForm from "@components/auth/registration-form";
import { useRouter } from "next/router";
import { getAuthCredentials, isAuthenticated } from "@utils/auth-utils";
import { ROUTES } from "@utils/routes";



export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-white sm:bg-gray-100">
      <div className="m-auto max-w-md w-full bg-white sm:shadow p-5 sm:p-8 rounded">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <h3 className="text-center text-base italic text-gray-500 mb-6 mt-4">
          Đăng ký
        </h3>
        <RegistrationForm />
      </div>
    </div>
  );
}
