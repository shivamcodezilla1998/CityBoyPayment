import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-subtle">
      {/* Left Side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 p-12 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">CityBoyPayment</h1>
          <p className="text-xl text-primary-100 max-w-md mx-auto">
            The premier Payment Potal for managing rewards, members, and operations effortlessly.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-bold text-primary-600">CityBoyPayment</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
