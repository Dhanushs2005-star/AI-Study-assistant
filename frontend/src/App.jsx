import { useState, useEffect } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import Dashboard from "./Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    if (hash === "#register" || hash === "#create-account") return "register";
    if (hash === "#dashboard") return "dashboard";
    return "login";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#register" || hash === "#create-account") {
        setCurrentPage("register");
      } else if (hash === "#dashboard") {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("login");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page === "register" ? "register" : page === "dashboard" ? "dashboard" : "login";
  };

  if (currentPage === "dashboard") {
    return <Dashboard onNavigate={navigateTo} />;
  }

  if (currentPage === "register") {
    return <CreateAccount onNavigate={navigateTo} />;
  }

  return <Login onNavigate={navigateTo} />;
}

export default App;