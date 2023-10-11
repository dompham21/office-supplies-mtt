import React, { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '@utils/routes';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import Input from '@components/ui/input';
import PasswordInput from '@components/ui/password-input';
import { useTranslation } from 'next-i18next';
import { setAuthCredentials } from '@utils/auth-utils';
import { useRegisterMutation } from 'src/query/user/use-register.mutation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { MESSAGE_ERROR_MAP } from '@utils/message-error-map';

const registrationFormSchema = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGE_ERROR_MAP.NAME_NOT_BLANK)
    .trim()
    .max(50, MESSAGE_ERROR_MAP.NAME_MAX_LENGTH),
  email: yup
    .string()
    .email(MESSAGE_ERROR_MAP.EMAIL_INVALID_FORMAT)
    .required(MESSAGE_ERROR_MAP.EMAIL_NOT_BLANK)
    .trim()
    .max(64, MESSAGE_ERROR_MAP.EMAIL_MAX_LENGTH),
  password: yup
    .string()
    .required(MESSAGE_ERROR_MAP.PASSWORD_NOT_BLANK)
    .trim()
    .min(3, MESSAGE_ERROR_MAP.PASSWORD_MIN_LENGTH)
    .max(100, MESSAGE_ERROR_MAP.PASSWORD_MAX_LENGTH),
  phone: yup
    .string()
    .required(MESSAGE_ERROR_MAP.PHONE_NOT_BLANK)
    .trim()
    .max(11, MESSAGE_ERROR_MAP.PHONE_MAX_LENGTH),
});

const defaultValues = {
  email: '',
  phone: '',
  name: '',
  password: '',
};

function RegistrationForm() {
  const [errorMessage, setErrorMessage] = useState(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registrationFormSchema),
    defaultValues,
    mode: 'all',
  });
  const router = useRouter();
  const { t } = useTranslation();

  async function onSubmit({ name, phone, email, password }) {
    registerUser(
      {
        variables: {
          name,
          email,
          phone,
          password,
        },
      },

      {
        onSuccess: (value) => {
          const response = value.data;

          if (response) {
            const {
              result,
              data,
              code,
              status,
              msg,
              refreshToken,
              accessToken,
            } = response;
            if (result == 1) {
              const roles = data?.role; // List roles of user
              setAuthCredentials(accessToken, roles);
              toast.success('Đăng ký thành công!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              });

              router.push(ROUTES.DASHBOARD);
            } else if (result == 0) {
              setErrorMessage(msg);
              return;
            }
          } else {
            toast.error('Đăng ký thất bại!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          }
        },
        onError: (error) => {
          if (error?.response?.status == 400) {
            if (error?.response?.data?.msg) {
              setErrorMessage(error?.response?.data?.msg);

              toast.error(error?.response?.data?.msg, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              });
            }
          } else {
            toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          }
        },
      }
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errorMessage ? (
          <Alert
            message={errorMessage}
            variant="error"
            closeable={true}
            className="mb-5"
            onClose={() => setErrorMessage(null)}
          />
        ) : null}
        <Input
          label={'Họ và tên'}
          {...register('name')}
          variant="outline"
          capitalize={true}
          className="mb-4"
          error={errors?.name?.message}
        />
        <Input
          label={'Email'}
          {...register('email')}
          type="email"
          variant="outline"
          className="mb-4"
          error={errors?.email?.message}
        />
        <Input
          label={'Số điện thoại'}
          {...register('phone')}
          type="number"
          variant="outline"
          className="mb-4"
          error={errors?.phone?.message}
        />
        <PasswordInput
          label={'Password'}
          {...register('password')}
          error={errors?.password?.message}
          variant="outline"
          className="mb-4"
        />
        <Button className="w-full" loading={loading} disabled={loading}>
          Đăng ký
        </Button>
        <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
          <hr className="w-full" />
          <span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
            Or
          </span>
        </div>
        <div className="text-sm sm:text-base text-body text-center">
          <span>Đã có tài khoản </span>
          <Link
            href={ROUTES.LOGIN}
            scroll={false}
            className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-700 hover:no-underline focus:no-underline"
          >
            đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
