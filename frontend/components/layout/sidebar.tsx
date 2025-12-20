"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  UserCircle,
  Truck,
  Settings,
  LayoutDashboard,
  Menu,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Resumen general de tu negocio.",
  },
  {
    label: "Productos",
    href: "/dashboard/products",
    icon: Package,
    description: "Listado de productos de la tienda seleccionada.",
  },
  {
    label: "Vender",
    href: "/dashboard/sales",
    icon: ShoppingCart,
    description: "Punto de venta rápido para la tienda activa.",
  },
  {
    label: "Empleados",
    href: "/dashboard/employees",
    icon: Users,
    description: "Administra el equipo de trabajo.",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [movementsOpen, setMovementsOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  const isInSettings = pathname.startsWith("/settings");
  const showSettingsExpanded = settingsOpen || (!collapsed && isInSettings);
  const movementItems = [
    {
      label: "Ventas",
      href: "/dashboard/sales/history",
      icon: FileText,
    },
    {
      label: "Compras",
      href: "/dashboard/purchases",
      icon: Receipt,
    },
    {
      label: "Ingresos",
      href: "/dashboard/incomes",
      icon: TrendingUp,
    },
    {
      label: "Egresos",
      href: "/dashboard/expenses",
      icon: TrendingDown,
    },
  ];
  const isInMovements = movementItems.some((item) =>
    pathname.startsWith(item.href),
  );
  const showMovementsExpanded = movementsOpen || (!collapsed && isInMovements);

  const contactItems = [
    {
      label: "Proveedores",
      href: "/dashboard/suppliers",
      icon: Truck,
    },
    {
      label: "Clientes",
      href: "/dashboard/clients",
      icon: UserCircle,
    },
  ];
  const isInContacts = contactItems.some((item) =>
    pathname.startsWith(item.href),
  );
  const showContactsExpanded = contactsOpen || (!collapsed && isInContacts);

  return (
    <aside
      className={cn(
        "hidden md:block fixed inset-y-0 left-0 z-30 border-r bg-card group transition-all duration-300",
        collapsed ? "w-16 hover:w-64" : "w-64",
      )}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-3 py-4">
          <button
            type="button"
            aria-label="Alternar menú"
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors">
            {collapsed ? (
              <Menu className="h-5 w-5 shrink-0" />
            ) : (
              <ChevronLeft className="h-5 w-5 shrink-0" />
            )}
          </button>
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              collapsed
                ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100"
                : "w-auto opacity-100",
            )}>
            <h2 className="text-2xl font-bold whitespace-nowrap">Kiosco App</h2>
          </div>
        </div>

        <nav className="space-y-1 px-2 pb-6 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  collapsed
                    ? "justify-center group-hover:justify-start"
                    : "justify-start",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}>
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                    collapsed
                      ? "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100"
                      : "max-w-[200px] opacity-100",
                  )}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMovementsOpen((prev) => !prev)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed
                  ? "justify-center group-hover:justify-start"
                  : "justify-start",
                isInMovements
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}>
              <FolderKanban className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                  collapsed
                    ? "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100"
                    : "max-w-[200px] opacity-100",
                )}>
                Movimientos
              </span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 transition-transform",
                  showMovementsExpanded ? "rotate-180" : "",
                  collapsed ? "hidden group-hover:inline-block" : "",
                )}
              />
            </button>
            {showMovementsExpanded && (
              <div
                className={cn(
                  "flex flex-col gap-1 pl-3",
                  collapsed ? "group-hover:flex" : "flex",
                )}>
                {movementItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        collapsed
                          ? "justify-center group-hover:justify-start"
                          : "justify-start",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span
                        className={cn(
                          "block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                          collapsed
                            ? "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100"
                            : "max-w-[200px] opacity-100",
                        )}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setContactsOpen((prev) => !prev)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed
                  ? "justify-center group-hover:justify-start"
                  : "justify-start",
                isInContacts
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}>
              <Users className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                  collapsed
                    ? "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100"
                    : "max-w-[200px] opacity-100",
                )}>
                Contactos
              </span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 transition-transform",
                  showContactsExpanded ? "rotate-180" : "",
                  collapsed ? "hidden group-hover:inline-block" : "",
                )}
              />
            </button>
            {showContactsExpanded && (
              <div
                className={cn(
                  "flex flex-col gap-1 pl-3",
                  collapsed ? "group-hover:flex" : "flex",
                )}>
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        collapsed
                          ? "justify-center group-hover:justify-start"
                          : "justify-start",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span
                        className={cn(
                          "block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                          collapsed
                            ? "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100"
                            : "max-w-[200px] opacity-100",
                        )}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Link
              href="/settings/configuration"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed
                  ? "justify-center group-hover:justify-start"
                  : "justify-start",
                isInSettings
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}>
              <Settings className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200",
                  collapsed
                    ? "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100"
                    : "max-w-[200px] opacity-100",
                )}>
                Ajustes
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
