import { useEffect, useRef } from "react";
import axios from "axios";

function GoogleLoginButton({ onNavigate }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google) {
        console.error(
          "Google Identity Services has not loaded."
        );
        return;
      }

      if (!buttonRef.current) {
        console.error(
          "Google button container was not found."
        );
        return;
      }

      const clientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          "VITE_GOOGLE_CLIENT_ID is missing from frontend/.env"
        );
        return;
      }

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: clientId,

        callback: async (response) => {
          try {
            console.log(
              "Google credential received."
            );

            const result = await axios.post(
              "http://localhost:5000/api/auth/google",
              {
                credential: response.credential,
              }
            );

            console.log(
              "Google login successful:",
              result.data
            );

            localStorage.setItem(
              "token",
              result.data.token
            );

            localStorage.setItem(
              "user",
              JSON.stringify(result.data.user)
            );

            onNavigate?.("dashboard");
          } catch (error) {
            console.error(
              "Google login failed:",
              error.response?.data || error.message
            );

            alert(
              error.response?.data?.message ||
                "Google login failed. Please try again."
            );
          }
        },
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 350,
          text: "continue_with",
          shape: "rect",
          logo_alignment: "left",
        }
      );
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        initializeGoogle();
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [onNavigate]);

  return (
    <div
      ref={buttonRef}
      className="flex w-full justify-center"
    />
  );
}

export default GoogleLoginButton;