import Logo from '@components/ui/logo';
import AuthorizedMenu from './menu/authorized-menu-admin';
import { useProfileAdminQuery } from '@data/profile/use-profile-admin.query';
import { Button, Spin } from 'antd';
import { useRouter } from 'next/router';


const Navbar = () => {
  const router = useRouter();

  const { data, isLoading: loading, error } = useProfileAdminQuery();
  const handleRedirectToLogin = () => {
    router.push("/admin/login")
  }

  return (
    <header className="bg-white shadow fixed w-full z-40">
      <nav className="px-5 md:px-8 py-4 flex items-center justify-between">
        <div className="hidden md:flex ms-5 me-auto">
            <Logo className="mx-auto lg:mx-0 inline-flex" />
        </div>

        <div className="flex items-center space-s-8">
        {
          loading ? <Spin/> : data?.user ? 
          
            <AuthorizedMenu admin={data?.user}/>
            :    
            <Button className="w-[130px] h-10" loading={false} type='primary' disabled={false} onClick={handleRedirectToLogin}>Đăng nhập</Button>
        }
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
