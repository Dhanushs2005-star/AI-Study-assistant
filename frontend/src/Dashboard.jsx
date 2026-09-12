import { useState, useEffect } from "react";
import axios from "axios";
import {
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Upload,
  ArrowRight,
  FileText,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ask-ai", label: "Ask AI", icon: MessageSquare },
  { id: "generate-quiz", label: "Generate Quiz", icon: ClipboardCheck },
  { id: "study-plan", label: "Study Plan", icon: CalendarDays },
  { id: "progress", label: "Progress", icon: BarChart3 },
];

const recentMaterials = [
  {
    name: "Data Structures and Algorithms.pdf",
    time: "Uploaded 2 days ago",
    type: "pdf",
  },
  {
    name: "Operating Systems Notes.pdf",
    time: "Uploaded 4 days ago",
    type: "pdf",
  },
  {
    name: "DBMS Lecture Slides.pptx",
    time: "Uploaded 1 week ago",
    type: "pptx",
  },
  {
    name: "Computer Networks.pdf",
    time: "Uploaded 1 week ago",
    type: "pdf",
  },
  {
    name: "Machine Learning Notes.pdf",
    time: "Uploaded 2 weeks ago",
    type: "pdf",
  },
];

const stats = [
  { value: "12", label: "Study Materials", icon: FileText },
  { value: "48", label: "Questions Asked", icon: MessageCircle },
  { value: "5", label: "Quizzes Completed", icon: CheckCircle2 },
  { value: "85%", label: "Average Score", icon: TrendingUp },
];

const weeklyBars = [
  { day: "Sep 1", h: 55 },
  { day: "Sep 7", h: 72 },
  { day: "Sep 14", h: 40 },
  { day: "Sep 21", h: 88 },
  { day: "Sep 28", h: 65 },
];

function Dashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Get the currently logged-in user using the JWT
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // No token means the user is not logged in
        if (!token) {
          onNavigate?.("login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Logged-in user:", response.data.user);

        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Failed to fetch user:",
          error.response?.data || error.message
        );

        // Remove invalid/expired authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Send user back to login
        onNavigate?.("login");
      }
    };

    fetchUser();
  }, [onNavigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    onNavigate?.("login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">

      {/* ───────────────── SIDEBAR ───────────────── */}

      <aside className="hidden w-[220px] flex-col border-r border-gray-200 bg-white md:flex">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
            <GraduationCap
              size={20}
              strokeWidth={2.2}
              className="text-white"
            />
          </div>

          <div>
            <p className="text-[15px] font-bold leading-tight tracking-tight text-black">
              StudyAI
            </p>

            <p className="text-[10px] leading-tight text-gray-400">
              Your Personal Study Assistant
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-1 flex-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  group mb-0.5 flex w-full items-center gap-3 rounded-xl
                  px-3 py-2.5 text-[13px] font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-100 px-3 py-3">

          <button
            className="
              group flex w-full items-center gap-3 rounded-xl
              px-3 py-2.5 text-[13px] font-medium text-gray-600
              transition-all duration-200
              hover:bg-gray-100 hover:text-black
            "
          >
            <Settings size={18} strokeWidth={1.8} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="
              group flex w-full items-center gap-3 rounded-xl
              px-3 py-2.5 text-[13px] font-medium text-gray-600
              transition-all duration-200
              hover:bg-red-50 hover:text-red-600
            "
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>

        </div>
      </aside>


      {/* ───────────────── MAIN AREA ───────────────── */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ───────────────── TOP BAR ───────────────── */}

        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 md:hidden">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
              <GraduationCap
                size={17}
                className="text-white"
              />
            </div>

            <span className="font-bold text-black">
              StudyAI
            </span>

          </div>


          {/* Search */}
          <div
            className="
              hidden w-full max-w-[420px] items-center gap-2.5
              rounded-xl border border-gray-200 bg-[#fafafa]
              px-4 py-2 transition-all duration-300
              focus-within:border-gray-400 focus-within:bg-white
              md:flex
            "
          >
            <Search
              size={16}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search your materials, notes, or ask anything..."
              className="
                w-full bg-transparent text-sm text-black
                outline-none placeholder:text-gray-400
              "
            />
          </div>


          {/* Right Actions */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              className="
                relative rounded-xl p-2 text-gray-500
                transition-colors hover:bg-gray-100 hover:text-black
              "
            >
              <Bell size={19} />

              <span
                className="
                  absolute right-1.5 top-1.5 h-2 w-2
                  rounded-full bg-red-500
                "
              />
            </button>


            {/* Profile */}
            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="
                  flex items-center gap-2 rounded-xl px-2 py-1.5
                  transition-colors hover:bg-gray-100
                "
              >

                {/* User Avatar */}
                <div
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-full bg-black text-sm font-semibold text-white
                  "
                >
                  {user?.fullName?.charAt(0).toUpperCase() || "S"}
                </div>


                {/* User Name */}
                <span
                  className="
                    hidden text-sm font-medium text-gray-700 sm:inline
                  "
                >
                  Hello, {user?.fullName || "Student"}
                </span>


                <ChevronDown
                  size={14}
                  className="text-gray-400"
                />

              </button>


              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="
                    absolute right-0 top-12 z-50 w-44
                    rounded-xl border border-gray-200
                    bg-white py-1.5 shadow-lg
                  "
                >

                  <button
                    className="
                      flex w-full items-center gap-2.5
                      px-4 py-2 text-sm text-gray-700
                      hover:bg-gray-50
                    "
                  >
                    <Settings size={15} />
                    Settings
                  </button>


                  <button
                    onClick={handleLogout}
                    className="
                      flex w-full items-center gap-2.5
                      px-4 py-2 text-sm text-red-600
                      hover:bg-red-50
                    "
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>

                </div>
              )}

            </div>

          </div>
        </header>


        {/* ───────────────── SCROLLABLE CONTENT ───────────────── */}

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">

          {/* Welcome */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Welcome back, {user?.fullName || "Student"}! 👋
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Ready to learn something new today?
              </p>

            </div>


            <p
              className="
                hidden max-w-[220px] text-right
                text-sm italic leading-relaxed text-gray-400 lg:block
              "
            >
              " Small progress each day leads to big results. "
            </p>

          </div>


          {/* Quick Action Cards */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                title: "Upload Material",
                desc: "Add PDFs, notes or PPTs",
                icon: Upload,
              },
              {
                title: "Ask AI",
                desc: "Get answers from your study material",
                icon: MessageSquare,
              },
              {
                title: "Generate Quiz",
                desc: "Create practice questions",
                icon: ClipboardCheck,
              },
            ].map((card) => (

              <button
                key={card.title}
                className="
                  group flex items-start justify-between
                  rounded-2xl border border-gray-200 bg-white p-5
                  text-left transition-all duration-300
                  hover:-translate-y-0.5 hover:border-gray-300
                  hover:shadow-md
                "
              >

                <div>

                  <div
                    className="
                      mb-3 flex h-10 w-10 items-center
                      justify-center rounded-xl bg-gray-100
                      text-gray-700 transition-colors
                      group-hover:bg-black group-hover:text-white
                    "
                  >
                    <card.icon
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="text-sm font-semibold text-black">
                    {card.title}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {card.desc}
                  </p>

                </div>


                <ArrowRight
                  size={16}
                  className="
                    mt-1 text-gray-300 transition-all
                    duration-300 group-hover:translate-x-1
                    group-hover:text-black
                  "
                />

              </button>

            ))}

          </div>


          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

            {stats.map((stat) => (

              <div
                key={stat.label}
                className="
                  group flex cursor-default items-center gap-3
                  rounded-2xl border border-gray-200 bg-white
                  px-4 py-4 transition-all duration-300
                  hover:border-gray-300 hover:shadow-sm
                "
              >

                <div
                  className="
                    flex h-10 w-10 items-center
                    justify-center rounded-xl bg-gray-100
                    text-gray-600
                  "
                >
                  <stat.icon
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>


                <div className="min-w-0 flex-1">

                  <p className="text-xl font-bold leading-tight text-black">
                    {stat.value}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    {stat.label}
                  </p>

                </div>


                <ChevronRight
                  size={14}
                  className="text-gray-300"
                />

              </div>

            ))}

          </div>


          {/* Bottom Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">

            {/* Recent Study Materials */}
            <div
              className="
                rounded-2xl border border-gray-200
                bg-white p-5 lg:col-span-3
              "
            >

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-[15px] font-bold text-black">
                  Recent Study Materials
                </h2>

                <button
                  className="
                    text-xs font-medium text-gray-400
                    transition-colors hover:text-black
                  "
                >
                  View All
                </button>

              </div>


              <div className="space-y-1">

                {recentMaterials.map((file, i) => (

                  <div
                    key={i}
                    className="
                      group flex items-center justify-between
                      rounded-xl px-3 py-3 transition-colors
                      hover:bg-gray-50
                    "
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={`
                          flex h-9 w-9 shrink-0 items-center
                          justify-center rounded-lg text-xs
                          font-bold text-white
                          ${
                            file.type === "pptx"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }
                        `}
                      >
                        {file.type === "pptx" ? "PPT" : "PDF"}
                      </div>


                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-black">
                          {file.name}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {file.time}
                        </p>

                      </div>

                    </div>


                    <button
                      className="
                        rounded-lg p-1.5 text-gray-300
                        opacity-0 transition-all
                        group-hover:opacity-100
                        hover:bg-gray-100 hover:text-gray-600
                      "
                    >
                      <MoreHorizontal size={16} />
                    </button>

                  </div>

                ))}

              </div>

            </div>


            {/* Right Column */}
            <div className="flex flex-col gap-4 lg:col-span-2">

              {/* Continue Learning */}
              <div
                className="
                  rounded-2xl border border-gray-200
                  bg-white p-5
                "
              >

                <div className="mb-4 flex items-center justify-between">

                  <h2 className="text-[15px] font-bold text-black">
                    Continue Learning
                  </h2>

                  <button
                    className="
                      text-xs font-medium text-gray-400
                      transition-colors hover:text-black
                    "
                  >
                    View All
                  </button>

                </div>


                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex h-16 w-16 shrink-0
                      items-center justify-center
                      rounded-xl bg-gray-900 p-2
                    "
                  >
                    <p
                      className="
                        text-center text-[9px]
                        font-bold leading-tight text-white
                      "
                    >
                      Data
                      <br />
                      Structures
                      <br />
                      and Algorithms
                    </p>
                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-black">
                      Data Structures and Algorithms
                    </p>


                    <div className="mt-2 flex items-center gap-3">

                      <div
                        className="
                          h-2 flex-1 overflow-hidden
                          rounded-full bg-gray-100
                        "
                      >
                        <div
                          className="
                            h-full rounded-full bg-black
                            transition-all duration-500
                          "
                          style={{ width: "60%" }}
                        />
                      </div>

                      <span className="text-xs font-medium text-gray-500">
                        60%
                      </span>

                    </div>


                    <button
                      className="
                        mt-3 rounded-xl bg-black
                        px-4 py-1.5 text-xs font-semibold
                        text-white transition-all duration-200
                        hover:bg-gray-800
                      "
                    >
                      Continue
                    </button>

                  </div>

                </div>

              </div>


              {/* Progress */}
              <div
                className="
                  flex-1 rounded-2xl border
                  border-gray-200 bg-white p-5
                "
              >

                <div className="mb-4 flex items-center justify-between">

                  <h2 className="text-[15px] font-bold text-black">
                    Your Progress
                  </h2>

                  <button
                    className="
                      flex items-center gap-1
                      rounded-lg border border-gray-200
                      px-2.5 py-1 text-xs text-gray-500
                      transition-colors hover:border-gray-400
                    "
                  >
                    This Month
                    <ChevronDown size={12} />
                  </button>

                </div>


                <div className="flex items-center gap-5">

                  {/* Circular Gauge */}
                  <div
                    className="
                      relative flex h-20 w-20
                      shrink-0 items-center justify-center
                    "
                  >

                    <svg
                      className="h-full w-full -rotate-90"
                      viewBox="0 0 80 80"
                    >

                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="7"
                      />

                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#111"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`
                          ${0.75 * 2 * Math.PI * 34}
                          ${2 * Math.PI * 34}
                        `}
                      />

                    </svg>


                    <span
                      className="
                        absolute text-sm font-bold text-black
                      "
                    >
                      75%
                    </span>

                    <span
                      className="
                        absolute top-[52px]
                        text-[9px] text-gray-400
                      "
                    >
                      Study Goal
                    </span>

                  </div>


                  {/* Weekly Bars */}
                  <div
                    className="
                      flex h-20 flex-1
                      items-end justify-between gap-1
                    "
                  >

                    {weeklyBars.map((bar) => (

                      <div
                        key={bar.day}
                        className="
                          flex flex-1 flex-col
                          items-center gap-1
                        "
                      >

                        <div
                          className="
                            w-full max-w-[18px]
                            rounded-t-md bg-gray-800
                            transition-all duration-300
                            hover:bg-black
                          "
                          style={{
                            height: `${bar.h}%`,
                          }}
                        />

                        <span
                          className="
                            whitespace-nowrap
                            text-[8px] text-gray-400
                          "
                        >
                          {bar.day}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Motivational Bar */}
          <div
            className="
              flex flex-wrap items-center
              justify-between gap-4
              rounded-2xl border border-gray-200
              bg-white px-6 py-4
            "
          >

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <Sparkles
                size={16}
                className="text-gray-400"
              />

              <span className="italic">
                Learning is not a destination, it's a journey. Keep going!
              </span>

            </div>


            <button
              className="
                group flex items-center gap-2
                rounded-xl bg-black
                px-5 py-2.5 text-sm font-semibold
                text-white shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-gray-800
                hover:shadow-md active:translate-y-0
              "
            >
              Upload New Material

              <ArrowRight
                size={16}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

          </div>

        </main>

      </div>


      {/* Close profile dropdown */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}

    </div>
  );
}

export default Dashboard;