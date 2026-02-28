// components/portofolio/Sidebar.tsx
"use client";

import {
  Home,
  User,
  Layers,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight,
  Copyright,
  X,
  Trophy,
  MessageCircle,
  Activity,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Lanyard types (minimal) ──────────────────────────────────────────────────
type DiscordData = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  discord_user: {
    username: string;
    display_name?: string;
    avatar: string;
    id: string;
    avatar_decoration_data?: { asset: string };
  };
  listening_to_spotify: boolean;
  spotify: { song: string; artist: string } | null;
  activities: { name: string; type: number }[];
};

const DISCORD_ID = "770242596945395712";

const STATUS_CONFIG = {
  online:  { color: "bg-green-500",  label: "Online",         glow: "shadow-[0_0_6px_rgba(34,197,94,.6)]"  },
  idle:    { color: "bg-yellow-500", label: "Idle",           glow: "shadow-[0_0_6px_rgba(234,179,8,.6)]"  },
  dnd:     { color: "bg-red-500",    label: "Do Not Disturb", glow: "shadow-[0_0_6px_rgba(239,68,68,.6)]"   },
  offline: { color: "bg-neutral-500",label: "Offline",        glow: ""                                       },
};

// ─── Hook: fetch Discord status ───────────────────────────────────────────────
function useDiscordStatus() {
  const [data, setData] = useState<DiscordData | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
    };
    fetch_();
    const id = setInterval(fetch_, 10_000);
    return () => clearInterval(id);
  }, []);

  return data;
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { icon: Home,         label: "Home",       href: "/"          },
  { icon: User,         label: "About",      href: "/about"     },
  { icon: Layers,       label: "Projects",   href: "/projects"  },
  { icon: Trophy,       label: "Achivement", href: "/achivement"},
  { icon: Activity,     label: "Dashboard",  href: "/dashboard" },
  { icon: MessageCircle,label: "Chat",       href: "/chat"      },
  { icon: Mail,         label: "Contact",    href: "/contact"   },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

interface SidebarContentProps {
  mobile?: boolean;
  pathname: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobile: () => void;
  isMobileOpen?: boolean;
}

// ─── SidebarContent ───────────────────────────────────────────────────────────
function SidebarContent({
  mobile = false,
  pathname,
  isCollapsed,
  toggleSidebar,
  closeMobile,
  isMobileOpen = true, // new prop so we know when mobile drawer is open
}: SidebarContentProps) {
  // Discord swap state — lives here so it resets on unmount (fine)
  const [showDiscord, setShowDiscord] = useState(false);
  const discord = useDiscordStatus();

  const discordAvatarUrl = discord
    ? `https://cdn.discordapp.com/avatars/${discord.discord_user.id}/${discord.discord_user.avatar}.png?size=128`
    : null;

  const decorationAsset = discord?.discord_user.avatar_decoration_data?.asset;
  const decorationUrl = decorationAsset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png?size=160&passthrough=true`
    : null;

  const status = discord ? STATUS_CONFIG[discord.discord_status] : null;

  // Current activity for speech bubble
  const activityBubble = (() => {
    // hide bubble if we're on mobile and the drawer is closed
    if (mobile && !isMobileOpen) return null;
    if (!discord || !showDiscord) return null;
    if (discord.listening_to_spotify && discord.spotify)
      return {
        icon: "🎵",
        line1: discord.spotify.song,
        line2: discord.spotify.artist,
      };
    const act = discord.activities.find((a) => a.type === 0);
    if (act) return { icon: "🎮", line1: act.name, line2: null };
    return null;
  })();

  return (
    <>
      {/* Close button — mobile only — UNCHANGED */}
      {mobile && (
        <button
          onClick={closeMobile}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors
            text-neutral-500 hover:text-neutral-900 dark:hover:text-white
            hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X size={18} />
        </button>
      )}

      {/* Toggle button — desktop only — UNCHANGED */}
      {!mobile && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 z-50 p-1 rounded-full shadow-xl transition-all duration-200
            bg-neutral-200 dark:bg-neutral-800
            border border-neutral-300 dark:border-neutral-700
            text-neutral-700 dark:text-white
            hover:bg-neutral-300 dark:hover:bg-neutral-700
            hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}

      {/* ── Profile & CV Section ── */}
      <div
        className={`flex flex-col items-center transition-all duration-300 ease-in-out overflow-visible ${
          !mobile && isCollapsed
            ? "mx-2 mt-4 mb-6 p-2 bg-transparent border-transparent"
            : mobile
            ? "mx-3 mt-16 mb-6"
            : "mx-3 mt-4 mb-6"
        }`}
      >
        {/* ── Expanded state ── */}
        {(mobile || !isCollapsed) && (
          <div className="w-full relative overflow-visible rounded-2xl p-6">
            <div className="relative z-10 flex flex-col items-center overflow-visible">

              {/* ── Avatar area — avatar stays centered, bubble is absolute ── */}
              <div className="relative mb-4 flex justify-center overflow-visible">

                {/* ── DEFAULT view ── */}
                {!showDiscord && (
                  <div className="relative w-24 h-24">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white dark:border-neutral-700 shadow-xl ring-4 ring-primary/10 dark:ring-primary/20">
                      <img
                        src="/assets/profile.png"
                        alt="Leo Satria Anugrah"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* OPEN badge — UNCHANGED */}
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-800 p-1.5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-green-600 dark:text-green-400 leading-none uppercase tracking-wide">
                          Open
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DISCORD view ── */}
                {showDiscord && (
                  <div className="relative w-24 h-24">
                    {/* Avatar */}
                    {discordAvatarUrl ? (
                      <img
                        src={discordAvatarUrl}
                        alt="Discord Avatar"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-white dark:border-neutral-700 shadow-xl ring-4 ring-primary/10 dark:ring-primary/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    )}

                    {/* Decoration frame */}
                    {decorationUrl && (
                      <img
                        src={decorationUrl}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 pointer-events-none select-none"
                        style={{ width: "100%", height: "100%", transform: "scale(1.18)", objectFit: "contain" }}
                      />
                    )}

                    {/* Status dot */}
                    {status && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${status.color} ${status.glow}`} />
                    )}

                    {/* ── Speech bubble — absolute, floats right, above ALL layers ── */}
                    {activityBubble && (
                      <div
                        className="absolute w-max max-w-[130px]"
                        style={{
                          top: mobile ? "40%" : "50%",                    // raise a bit on mobile
                          left: mobile ? "calc(100% + 8px)" : "calc(100% + 12px)",
                          transform: mobile
                            ? "translateY(-40%)"
                            : "translateY(-50%)",
                          zIndex: 9999,
                        }}
                      >
                        {/* Tail border */}
                        <div
                          className="absolute w-0 h-0"
                          style={{
                            left: "-9px",
                            top: mobile ? "40%" : "50%",
                            transform: mobile
                              ? "translateY(-40%) rotate(-25deg)"
                              : "translateY(-50%)",
                            borderTop: "6px solid transparent",
                            borderBottom: "6px solid transparent",
                            borderRight: "9px solid #404040",
                          }}
                        />
                        {/* Tail fill */}
                        <div
                          className="absolute w-0 h-0"
                          style={{
                            left: "-7px",
                            top: mobile ? "40%" : "50%",
                            transform: mobile
                              ? "translateY(-40%) rotate(-25deg)"
                              : "translateY(-50%)",
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderRight: "8px solid #262626",
                          }}
                        />
                        {/* Bubble body */}
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl rounded-tl-sm px-3 py-2.5 shadow-2xl">
                          <p className={`text-[9px] font-bold uppercase tracking-wide mb-1 ${
                            activityBubble.icon === "🎵" ? "text-green-400" : "text-blue-400"
                          }`}>
                            {activityBubble.icon} {activityBubble.icon === "🎵" ? "Listening" : "Playing"}
                          </p>
                          <p className="text-[11px] font-semibold text-white leading-tight line-clamp-2">
                            {activityBubble.line1}
                          </p>
                          {activityBubble.line2 && (
                            <p className="text-[10px] text-neutral-400 leading-tight truncate mt-0.5">
                              {activityBubble.line2}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Name & Title — UNCHANGED structure, content swaps */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white mb-1">
                  {showDiscord && discord?.discord_user.display_name
                    ? discord.discord_user.display_name
                    : "Leo Satria Anugrah"}
                </h3>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {showDiscord && discord
                    ? `@${discord.discord_user.username}`
                    : "Web Developer"}
                  <span className="w-1 h-1 rounded-full bg-primary" />
                </p>


              </div>

              {/* Buttons row */}
              <div className="w-full flex flex-col gap-2">
                {/* Download CV — UNCHANGED, hidden in Discord mode */}
                {!showDiscord && (
                  <button className="group w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-sm font-semibold shadow-md hover:shadow-xl bg-primary hover:bg-primary/90 text-white border border-primary/20">
                    <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
                    <span>Download CV</span>
                  </button>
                )}

                {/* Swap button */}
                <button
                  onClick={() => setShowDiscord((v) => !v)}
                  className="group w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-xs font-semibold
                    border border-neutral-200 dark:border-neutral-700
                    bg-neutral-50 dark:bg-neutral-800
                    text-neutral-600 dark:text-neutral-400
                    hover:bg-neutral-100 dark:hover:bg-neutral-700
                    hover:text-neutral-900 dark:hover:text-white"
                >
                  <RefreshCw size={13} className="transition-transform group-hover:rotate-180 duration-300" />
                  {showDiscord ? "Show Profile" : "Show Discord"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Collapsed state — UNCHANGED, small status dot added ── */}
        {!mobile && isCollapsed && (
          <div className="relative">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
              <img
                src={showDiscord && discordAvatarUrl ? discordAvatarUrl : "/assets/profile.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            {/* status dot: green pulse default, or real discord status */}
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-800
                ${showDiscord && status ? `${status.color} ${status.glow}` : "bg-green-500 animate-pulse"}`}
            />
          </div>
        )}
      </div>

      {/* ── Navigation Links — COMPLETELY UNCHANGED ── */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar">
        {(mobile || !isCollapsed) && (
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
              Navigation
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
          </div>
        )}

        <nav className="flex flex-col gap-1.5 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const collapsed = !mobile && isCollapsed;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={mobile ? closeMobile : undefined}
                className={`group flex items-center relative transition-all duration-200 ${
                  collapsed
                    ? "justify-center w-12 h-12 rounded-xl"
                    : "gap-3 px-4 py-3 w-full rounded-xl"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:text-neutral-900 dark:hover:text-white hover:scale-[1.01]"
                }`}
                title={collapsed ? item.label : ""}
              >
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
                    collapsed ? "" : "w-8 h-8 rounded-lg"
                  } ${
                    isActive
                      ? "bg-white/20"
                      : "bg-transparent group-hover:bg-neutral-200 dark:group-hover:bg-neutral-600/30"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
                    }`}
                  />
                </div>
                {!collapsed && (
                  <>
                    <span className="font-semibold text-sm whitespace-nowrap overflow-hidden flex-1">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Footer — COMPLETELY UNCHANGED ── */}
      <div
        className={`p-4 border-t border-neutral-200 dark:border-neutral-700 ${
          !mobile && isCollapsed ? "flex justify-center" : ""
        }`}
      >
        {!mobile && isCollapsed ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer">
            <Copyright size={18} />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-[10px] font-bold">
                LS
              </div>
              <span>Leo Satria</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 flex items-center gap-1">
              <Copyright size={10} /> 2024 • Built with Next.js
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Sidebar shell — COMPLETELY UNCHANGED ────────────────────────────────────
export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  closeMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out
          bg-white dark:bg-neutral-800
          border-r border-neutral-200 dark:border-neutral-700
          ${isCollapsed ? "w-20" : "w-72"}`}
      >
        <SidebarContent
          mobile={false}
          pathname={pathname}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          closeMobile={closeMobile}
        />
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-white dark:bg-neutral-800
          border-r border-neutral-200 dark:border-neutral-700
          transition-transform duration-300 ease-in-out
          md:hidden
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent
          mobile={true}
          pathname={pathname}
          isCollapsed={false}
          toggleSidebar={toggleSidebar}
          closeMobile={closeMobile}
          isMobileOpen={isMobileOpen}
        />
      </aside>
    </>
  );
}