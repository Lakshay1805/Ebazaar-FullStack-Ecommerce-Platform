import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");

        if (
          response.data &&
          !response.data.error &&
          response.data.user.role === "admin"
        ) {
          setAdmin(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}