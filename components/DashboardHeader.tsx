"use client";

import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon, MenuIcon, XIcon } from '@heroicons/react/solid';
import { createClient } from '@/utils/supabase/client';

const DashboardHeader = () => {
  const [session, setSession] = useState<any>(null); // Use 'any' to accommodate the session object from Supabase
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
      }
    };

    fetchSession();
  }, [router, supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    } else {
      console.error('Error signing out:', error);
    }
  };

  const handleChangePassword = () => {
    router.push('/auth/reset-password');
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Defined Recipe</div>
        <div className="hidden md:flex space-x-4">
          <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
          <a href="/blog" className="text-gray-700 hover:text-gray-900">Blog</a>
          <a href="/cookbooks" className="text-gray-700 hover:text-gray-900">Cookbooks</a>
          <a href="/how-it-works" className="text-gray-700 hover:text-gray-900">How it Works</a>
        </div>
        <div className="flex items-center space-x-4">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center items-center rounded-full border border-gray-300 shadow-sm p-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                {session.user?.user_metadata?.avatar_url ? (
                  <img src={session.user.user_metadata.avatar_url} alt="Profile" className="h-10 w-10 rounded-full mr-2" />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-700 mr-2" />
                )}
                <span className="mr-2">My Profile</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-700" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleChangePassword}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } group flex items-center px-4 py-2 text-sm w-full text-left`}
                      >
                        Change Password
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } group flex items-center px-4 py-2 text-sm w-full text-left`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block text-gray-700 hover:text-gray-900">Home</a>
            <a href="/blog" className="block text-gray-700 hover:text-gray-900">Blog</a>
            <a href="/cookbooks" className="block text-gray-700 hover:text-gray-900">Cookbooks</a>
            <a href="/how-it-works" className="block text-gray-700 hover:text-gray-900">How it Works</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;