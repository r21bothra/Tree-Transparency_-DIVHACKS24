import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  IconMenu2,
  IconMoon,
  IconSun,
  IconTrees,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import clsx from "clsx";
import Link from "next/link";
import { useUserStore } from "@/store/user";
import { useUserContext } from "@/services/userContext";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { IconQrcodeOff } from "@tabler/icons-react";
import { IconScan } from "@tabler/icons-react";

const navigation = [
  { name: "Adopt", href: "/tree/adopt" },
  { name: "Donations", href: "/donations" },
  { name: "Growth Track", href: "/tree/growth-track" }
  // { name: "IOT Track", href: "/sensors" },
];

const commonProfileOptions = [
  { name: "Profile", href: "/profile" },
  { name: "My Trees", href: "/profile/adopted" },
];

const ngoProfileOptions = [{ name: "Add Tree", href: "/tree/add" }];

const volunteerProfileOptions = [{ name: "Verify Tree", href: "/tree/verify" }];

const companiesProfileOptions = [{ name: "Donate", href: "/donate" }];

const individualProfileOptions = [{ name: "Donate", href: "/donate" }];

export default function Navbar() {
  const router = useRouter();
  const { userStore } = useUserStore();

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 blur-filter backdrop-blur-lg bg-base-100/50 z-10 shadow-sm"
    >
      {({ open }) => (
        <>
          <div className="container px-2 mx-auto sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 duration-300 rounded-md text-base-content hover:bg-primary hover:text-base-content focus:outline-none focus:ring-2 focus:ring-inset focus:ring-base-content">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <IconX className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <IconMenu2 className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <Link href="/" className="flex items-center flex-shrink-0">
                  <IconTrees size={30} className="text-primary" />
                </Link>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {userStore &&
                      userStore.type &&
                      navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            item.href === router.pathname
                              ? "bg-primary text-primary-content"
                              : "hover:bg-primary hover:text-primary-content",
                            "rounded-md px-3 py-2 text-sm font-medium duration-200"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    {userStore &&
                      userStore?.type === "Private Companies" &&
                      companiesProfileOptions.map((item) => (
                        <Link
                          href={item.href}
                          className={clsx(
                            item.href === router.pathname
                              ? "bg-primary text-primary-content"
                              : "hover:bg-primary hover:text-primary-content",
                            "rounded-md px-3 py-2 text-sm font-medium duration-200"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    {userStore &&
                      userStore?.type === "Individual" &&
                      individualProfileOptions.map((item) => (
                        <Link
                          href={item.href}
                          className={clsx(
                            item.href === router.pathname
                              ? "bg-primary text-primary-content"
                              : "hover:bg-primary hover:text-primary-content",
                            "rounded-md px-3 py-2 text-sm font-medium duration-200"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <ProfileDropdown />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={clsx(
                    item.href === router.pathname
                      ? "bg-primary text-primary-content"
                      : "hover:bg-primary hover:text-primary-content",
                    "duration-200 block rounded-md px-3 py-3 text-base font-medium"
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function ProfileDropdown() {
  const { theme, setTheme } = useTheme();
  const { userStore, clear } = useUserStore();
  const router = useRouter();
  const { logOutUser, user } = useUserContext();

  const handleSignOut = async () => {
    try {
      await logOutUser(user);
      clear();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return !userStore.email ? (
    <Link href="/login" className="btn btn-primary">
      Login
    </Link>
  ) : (
    <Menu as="div" className="relative ml-3">
      <div className="flex items-center gap-1">
        <button
          className="btn btn-ghost btn-circle btn-sm"
          onClick={() => setTheme(theme === "emerald" ? "forest" : "emerald")}
        >
          {theme === "emerald" ? <IconMoon /> : <IconSun />}
        </button>
        <a href="/qr-scanner" className="btn btn-ghost btn-circle btn-sm">
          <IconScan />
        </a>
        <Menu.Button className="gap-2 btn btn-ghost btn-sm btn-circle">
          <span className="sr-only">Open user menu</span>
          {userStore.photoURL ? (
            <img
              className="w-8 h-8 rounded-full"
              src={userStore.photoURL}
              alt=""
            />
          ) : (
            <IconUser />
          )}
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
        <Menu.Items className="absolute right-0 z-10 w-48 pb-1 mt-2 text-sm origin-top-right rounded-md shadow-lg bg-base-300 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <div className="py-3 text-center bg-base-200">
              <span className="text-primary">{userStore.username}</span>
            </div>
          </Menu.Item>
          {userStore?.type === "NGOs" &&
            ngoProfileOptions.map((item) => (
              <Menu.Item key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 duration-200 hover:bg-base-100"
                >
                  {item.name}
                </Link>
              </Menu.Item>
            ))}
          {userStore?.type === "Volunteers" &&
            volunteerProfileOptions.map((item) => (
              <Menu.Item key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 duration-200 hover:bg-base-100"
                >
                  {item.name}
                </Link>
              </Menu.Item>
            ))}

          {commonProfileOptions.map((item) => (
            <Menu.Item key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-2 duration-200 hover:bg-base-100"
              >
                {item.name}
              </Link>
            </Menu.Item>
          ))}
          <Menu.Item>
            <div
              onClick={() => handleSignOut()}
              className="block px-4 py-2 duration-200 hover:bg-base-100"
            >
              Sign out
            </div>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
