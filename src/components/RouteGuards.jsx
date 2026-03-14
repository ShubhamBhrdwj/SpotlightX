import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ role }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-300">
        Loading your account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={user?.role === "artist" ? "/artist" : "/organiser"}
        replace
      />
    );
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-300">
        Loading your account...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === "artist" ? "/artist" : "/organiser"}
        replace
      />
    );
  }

  return <Outlet />;
}
