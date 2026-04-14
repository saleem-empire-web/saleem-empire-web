import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, LayoutGrid, ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/products", label: "المنتجات", icon: Package },
  { href: "/categories", label: "الفئات", icon: LayoutGrid },
];

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={`bg-sidebar border-l border-sidebar-border flex flex-col h-full transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`} dir="rtl">
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && (
          <div>
            <div className="font-bold text-primary text-sm">Cloud Nine</div>
            <div className="text-xs text-sidebar-foreground/60">لوحة التحكم</div>
          </div>
        )}
        {collapsed && <div className="w-2 h-2 rounded-full bg-primary" />}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm ${collapsed ? "justify-center" : ""}`}
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>فتح المتجر</span>}
        </a>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" dir="rtl">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-sidebar border-l border-sidebar-border flex flex-col">
            <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
              <div>
                <div className="font-bold text-primary text-sm">Cloud Nine</div>
                <div className="text-xs text-sidebar-foreground/60">لوحة التحكم</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-2 space-y-1">
              {links.map(({ href, label, icon: Icon }) => {
                const isActive = location === href || (href !== "/" && location.startsWith(href));
                return (
                  <Link key={href} href={href}>
                    <div
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer
                        ${isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
