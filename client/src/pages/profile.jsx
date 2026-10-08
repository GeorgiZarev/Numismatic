import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchMyOrders } from "../api/orders";
import { useAuth } from "../Contexts/authContext";
import OrderList from "../components/orders/OrderList";
import ProfileForm from "../components/profile/ProfileForm";
import AddressManager from "../components/profile/AddressManager";
import { splitFullName } from "../components/profile/profileFormData";
import { primaryButtonClass, secondaryButtonClass } from "../components/profile/profileStyles";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const { first_name, last_name } = splitFullName(user?.full_name);
  const { data: orders = [], isError, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });

  return (
    <main className="mx-auto max-w-[1340px] pb-20 pt-12 sm:pt-16">
      <header className="pb-9 sm:pb-11">
        <h1 className="font-serif text-[32px] font-semibold leading-tight text-[#142e28] sm:text-[40px]">{t("profile.title")}</h1>
        <div className="mt-7 grid gap-5 sm:grid-cols-3 sm:gap-8">
          <div className="min-w-0">
            <p className="text-sm text-[#62736a]">{t("auth.first_name")}</p>
            <p className="mt-1 break-words text-lg font-semibold text-[#17342c]">{first_name || t("profile.notSet")}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#62736a]">{t("auth.last_name")}</p>
            <p className="mt-1 break-words text-lg font-semibold text-[#17342c]">{last_name || t("profile.notSet")}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#62736a]">{t("profile.email")}</p>
            <p className="mt-1 break-all text-lg font-semibold text-[#17342c]">{user?.email}</p>
          </div>
        </div>
      </header>
      <div>
        <ProfileForm user={user} onSave={updateProfile} />
        <AddressManager />
      </div>
      <section aria-labelledby="profile-orders-title" className="border-t border-[#dce3df] pt-10 sm:pt-12">
        <h2 id="profile-orders-title" className="mb-6 font-serif text-2xl font-semibold text-[#142e28] sm:text-[28px]">{t("profile.myOrders")}</h2>
        {isLoading && <p className="text-sm text-[#62736a]">{t("profile.loadingOrders")}</p>}
        {isError && <p role="alert" className="text-sm text-[#963b33]">{t("profile.loadOrdersError")}</p>}
        {!isLoading && !isError && <OrderList orders={orders} />}
      </section>
      <nav aria-label={t("profile.shoppingLinks")} className="mt-10 flex flex-wrap gap-3 border-t border-[#dce3df] pt-7">
        <Link to="/all-products" className={primaryButtonClass}>{t("profile.continueShopping")}</Link>
        <Link to="/cart" className={secondaryButtonClass}>{t("profile.viewCart")}</Link>
      </nav>
    </main>
  );
};

export default Profile;
