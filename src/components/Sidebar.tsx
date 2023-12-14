"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  FeatherIcon,
  LayoutDashboard,
  LayoutIcon,
  LucideIcon,
  SettingsIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { Button } from "./ui/Button";
import { logoutUser } from "@/services/UserService";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { parseJwt } from "@/utils/auth";
import logo from "../../public/images/logo-notext.svg";
import { useEffect, useState } from "react";
const poppins = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },

  {
    label: "Content Manager",
    icon: FeatherIcon,
    href: "/content-manager",
    color: "text-green-500",
  },
  {
    label: "Content-Type Builder",
    icon: LayoutIcon,
    href: "/content-type-builder",
    color: "text-violet-500",
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    href: "/settings",
    color: "text-grey-500",
  },
];
interface Route {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [accessibleRoutes, setAccessibleRoutes] = useState<Route[]>([]);
  const [userRole, setUserRole] = useState("DEFAULT");

  const handleLogout = () => {
    logoutUser();
    router.push("/sign-in");
  };
  useEffect(() => {
    const token = Cookies.get("token");
    const payload = token ? parseJwt(token) : null;
    setUserRole(payload ? payload._userRole : "DEFAULT");
  }, []);

  useEffect(() => {
    const newAccessibleRoutes = routes.filter((route) => {
      if (userRole === "ADMIN") {
        return true; // Admin has access to all routes
      } else if (userRole === "EDITOR") {
        return !["/content-type-builder", "/settings"].includes(route.href); // Exclude some routes for Editor
      } else if (userRole === "DEFAULT") {
        return route.href === "/dashboard"; // Only dashboard for Default
      }

      return false;
    });

    setAccessibleRoutes(newAccessibleRoutes);
  }, [userRole]);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-white">
      {/* Top section for logo and links */}
      <div className="px-3 py-2 flex-1 flex flex-col justify-between">
        {/* Logo and Links */}
        <div>
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <div className="relative h-8 w-8 mr-4">
              <Image fill alt="Logo" src={logo} />
            </div>
            <h1
              className={cn(
                "text-2xl text-gray-900 font-bold",
                poppins.className
              )}
            >
              WebEase
            </h1>
          </Link>
          <div className="space-y-1">
            {accessibleRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-blue-400 hover:bg-white/10 rounded-lg transition",
                  pathname.includes(route.href) ? "text-black" : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Logout Button */}
        <div>
          <Button
            variant="secondary"
            className="text-red-500 text-lg"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
