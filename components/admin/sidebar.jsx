"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  HeartHandshake,
  IdCard,
  Users,
  Building2,
  FileText,
  Image as ImageIcon,
  FileBarChart,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  HandHeart,
} from "lucide-react";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Donations", href: "/admin/donations", icon: HeartHandshake },
  { label: "Members", href: "/admin/members", icon: IdCard },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "CSR Inquiries", href: "/admin/csr", icon: Building2 },
  { label: "Contacts", href: "/admin/contacts", icon: Building2 },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "User Management", href: "/admin/users", icon: ShieldCheck },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href);
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-blue-800 text-white shadow-md" : "text-slate-700 hover:bg-slate-100"}`}
      >
        <Icon className='w-4 h-4' />
        {item.label}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className='flex flex-col h-full'>
      <div className='px-5 py-5 border-b'>
        <Link href='/admin' className='flex items-center gap-2.5'>
          <div className='w-10 h-10 rounded-xl gradient-trust flex items-center justify-center'>
            <HandHeart className='w-5 h-5 text-white' />
          </div>
          <div className='leading-tight'>
            <div className='font-bold text-slate-900 text-sm'>MKDS Admin</div>
            <div className='text-[11px] text-slate-500'>
              Sangh Trust dashboard
            </div>
          </div>
        </Link>
      </div>

      <nav className='flex-1 overflow-y-auto px-3 py-4 space-y-1'>
        {NAV.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <div className='border-t p-3 space-y-2'>
        <Link
          href='/'
          target='_blank'
          className='flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-blue-800'
        >
          <ExternalLink className='w-3.5 h-3.5' /> View public site
        </Link>
        <div className='flex items-center gap-3 px-3 pt-2 border-t'>
          <div className='w-9 h-9 rounded-full gradient-trust text-white flex items-center justify-center text-sm font-bold'>
            {(user?.name || "A")[0]}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-semibold text-slate-900 truncate'>
              {user?.name || "Admin"}
            </div>
            <div className='text-[10px] text-slate-500 capitalize'>
              {(user?.role || "super_admin").replace("_", " ")}
            </div>
          </div>
          <button
            onClick={logout}
            className='p-2 rounded-md hover:bg-slate-100 text-slate-600'
            title='Sign out'
          >
            <LogOut className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className='hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30'>
        <div className='w-full'>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className='lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b flex items-center justify-between px-4 py-3'>
        <Link href='/admin' className='flex items-center gap-2'>
          <div className='w-9 h-9 rounded-lg gradient-trust flex items-center justify-center'>
            <HandHeart className='w-4 h-4 text-white' />
          </div>
          <span className='font-bold text-slate-900 text-sm'>MKDS Admin</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className='p-2'
          aria-label='Open menu'
        >
          <Menu className='w-5 h-5' />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className='lg:hidden fixed inset-0 z-50 bg-black/40'
          onClick={() => setOpen(false)}
        >
          <div
            className='absolute inset-y-0 left-0 w-72 bg-white shadow-xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-end p-3'>
              <button onClick={() => setOpen(false)} className='p-2'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
