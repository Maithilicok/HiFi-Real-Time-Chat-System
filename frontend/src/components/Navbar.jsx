import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import HiFiIcon from "./HiFiIcon";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { pathname } = useLocation();

  return (
    <header
      className="fixed w-full top-0 z-40 bg-base-100/80 border-b border-base-300"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="transition-transform group-hover:scale-105">
            <HiFiIcon size={36} />
          </div>
          <span
            className="text-xl font-bold tracking-tight text-base-content"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            HiFi
          </span>
        </Link>

        {/* Nav actions */}
        <div className="flex items-center gap-2">

          <Link
            to="/settings"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
              ${pathname === "/settings"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-base-content/50 hover:bg-base-200 border border-transparent"
              }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
                  ${pathname === "/profile"
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-base-content/50 hover:bg-base-200 border border-transparent"
                  }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
                  text-base-content/50 hover:bg-error/10 hover:text-error border border-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;