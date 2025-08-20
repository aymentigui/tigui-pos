import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: any }) => {
  const { user } = useAuth();
  console.log("--------------------",user)
  if (!user) return <Navigate to="/login" replace />;
  return children;
};