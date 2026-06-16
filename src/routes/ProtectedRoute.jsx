import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please login again.", {
        id: "session-expired-toast",
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;