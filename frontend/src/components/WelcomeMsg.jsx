import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function WelcomeMsg() {
  useEffect(() => {
    const shouldShow = localStorage.getItem("showWelcomeMsg");

    if (shouldShow === "true") {
      toast.dismiss();

      const timer = setTimeout(() => {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-base-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-base-content ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-base-content">
                      Welcome back!
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                      Logged in successfully 🎉
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="flex border-l border-base-content/20">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary-focus focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Close
                </button>
              </div> */}
            </div>
          ),
          {
            duration: 9000,
            position: "top-right",
          }
        );

        localStorage.removeItem("showWelcomeMsg");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
