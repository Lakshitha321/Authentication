import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="flex justify-center h-[100vh]">
      <div className="sm:w-[448px] w-[100%] px-10 pt-20">
        <Outlet />
      </div>
    </div>
  );
};
export default AuthLayout;