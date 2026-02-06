"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PiggyBank, Settings, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "funds", label: "Fondos", icon: PiggyBank, path: "/funds" },
    { id: "config", label: "Config", icon: Settings, path: "/config" },
  ];

  const activeTab = pathname === "/" ? "dashboard" : pathname.split("/")[1];

  const handleTabClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 pb-20 md:pb-8">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mis Finanzas
                </h1>
              </div>
              <nav className="hidden md:flex items-center gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.path)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl ring-2 ring-indigo-400 ring-offset-2" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200/50 animate-in slide-in-from-top-2 duration-300">
              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.path)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-50 shadow-lg shadow-gray-200/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-around py-2 px-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 relative ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200"
                      : "hover:bg-gray-100"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
