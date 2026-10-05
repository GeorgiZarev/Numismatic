import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Contexts/authContext";

const AdminLayout = () => {
  const { user } = useAuth();
  const emails = (process.env.REACT_APP_ADMIN_EMAILS || "admin@gmail.com").split(",").map((email) => email.trim().toLowerCase());
  if (!emails.includes(user?.email?.toLowerCase())) return <Navigate to="/profile" replace />;

  return <div className="admin-workspace py-8">
    <header className="mb-5 border-b border-[#e7ece8] pb-5"><h1 className="text-2xl font-semibold text-[#203730]">Admin</h1></header>
    <nav aria-label="Admin navigation" className="flex flex-wrap gap-1 border-b border-[#e7ece8] pb-2">
      {[["/admin/orders", "Orders"], ["/admin/products", "Products"], ["/admin/products/new", "Create product"]].map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-[#edf3f0] text-[#235b50]" : "text-[#596960] hover:bg-[#f6f8f6] hover:text-[#203730]"}`}>{label}</NavLink>)}
    </nav>
    <Outlet />
  </div>;
};

export default AdminLayout;
