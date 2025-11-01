"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabBar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex flex-col items-center justify-end gap-1 px-4 py-1 ${
      pathname.startsWith(path)
        ? "text-primary"
        : "text-[#617c89] dark:text-[#a0b3bd]"
    }`;

  return (
    <footer className="sticky bottom-0 backdrop-blur-sm bg-background-light/80 dark:bg-background-dark/80">
      <div className="flex justify-around border-t border-primary/10 px-4 pt-2 pb-5 dark:border-primary/20">
        <Link href="/library" className={linkClass("/library")}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </div>
          <p className="text-xs font-medium">Library</p>
        </Link>
        <Link href="/engagement" className={linkClass("/engagement")}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <p className="text-xs font-medium">Engagement</p>
        </Link>
        <Link href="/profile" className={linkClass("/profile")}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
          <p className="text-xs font-medium">Profile</p>
        </Link>
      </div>
    </footer>
  );
}


