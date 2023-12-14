"use client";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/utils/utils";
import Link from "next/link";
function SettingsSideBar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Users",
      href: "/settings/users",
    },
    {
      label: "Pending Invitations",
      href: "/settings/pending-invitations",
    },
  ];
  return (
    <div className="h-full md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 border-r border-gray-300">
      <div className="space-y-4  flex flex-col h-full text-white">
        <div className=" flex-1">
          <div className="pt-6 pr-4 pb-2 pl-6">
            <h3 className="  font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight ">
              Settings
            </h3>
            <Separator className="mt-3" />
          </div>
          <div>
            <div className="py-2 pr-4 pl-6">
              <h3 className="text-xs  uppercase text-gray-500">
                Administration Panel
              </h3>
            </div>
            <ul>
              {routes.map((route) => (
                <li
                  key={route.href}
                  className={cn(
                    "text-sm font-medium pt-2 pb-2 pl-8",
                    pathname.includes(route.href)
                      ? "text-black"
                      : "text-customBlue"
                  )}
                >
                  <Link href={route.href}>{route.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSideBar;
