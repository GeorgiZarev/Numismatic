import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../api/orders";
import { useAuth } from "../Contexts/authContext";
import OrderList from "../components/orders/OrderList";
import ProfileForm from "../components/profile/ProfileForm";
import AddressManager from "../components/profile/AddressManager";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { data: orders = [], isError, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });

  return (
    <div className="py-10">
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg font-semibold">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{user?.email}</p>
          </div>
        </div>
        <ProfileForm user={user} onSave={updateProfile} />
        <AddressManager />
        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/all-products" className="bg-orange-500 text-white px-5 py-3 rounded">
            Continue shopping
          </Link>
          <Link to="/cart" className="border px-5 py-3 rounded">
            View cart
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-5">My orders</h2>
        {isLoading && <p>Loading orders...</p>}
        {isError && <p className="text-red-500">Could not load orders.</p>}
        {!isLoading && !isError && <OrderList orders={orders} />}
      </div>
    </div>
  );
};

export default Profile;
