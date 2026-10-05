import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Contexts/authContext";

const AdminLayout = () => {
  const { user } = useAuth();
  const emails = (process.env.REACT_APP_ADMIN_EMAILS || "admin@gmail.com").split(",").map((email) => email.trim().toLowerCase());
  if (!emails.includes(user?.email?.toLowerCase())) return <Navigate to="/profile" replace />;

  return <div className="py-8">
    <header className="border-b pb-5 mb-4"><h1 className="text-3xl font-bold">Admin</h1><p className="text-gray-600 mt-1">Manage orders and products</p></header>
    <nav aria-label="Admin navigation" className="flex flex-wrap gap-2 border-b pb-4">
      {[["/admin/orders", "Orders"], ["/admin/products", "Products"], ["/admin/products/new", "Create product"]].map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `px-4 py-3 rounded border ${isActive ? "bg-gray-900 text-white" : "bg-white text-gray-800 hover:bg-gray-50"}`}>{label}</NavLink>)}
    </nav>
    <Outlet />
  </div>;
};

export default AdminLayout;
