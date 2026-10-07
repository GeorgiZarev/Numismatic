import { useTranslation } from "react-i18next";
import { FiMail, FiPackage, FiTruck } from "react-icons/fi";
import { contactEmail, contactPhones } from "../utils/contactDetails";

const Delivery = () => {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl py-10 font-sans sm:py-16">
      <header className="border-b border-[#dfe6e1] pb-8">
        <p className="text-sm font-semibold uppercase text-[#9b7041]">Zarev Gold & Coins</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#203730] sm:text-4xl">{t("delivery.title")}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#53655b]">{t("delivery.intro")}</p>
      </header>
      <div className="grid gap-8 py-10 md:grid-cols-2">
        <section className="border-b border-[#dfe6e1] pb-8 md:border-0">
          <FiTruck className="text-[#235b50]" size={27} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-[#203730]">{t("delivery.shippingTitle")}</h2>
          <p className="mt-3 leading-7 text-[#53655b]">{t("delivery.shippingText")}</p>
        </section>
        <section className="border-b border-[#dfe6e1] pb-8 md:border-0">
          <FiPackage className="text-[#235b50]" size={27} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-[#203730]">{t("delivery.costTitle")}</h2>
          <p className="mt-3 leading-7 text-[#53655b]">{t("delivery.costText")}</p>
        </section>
      </div>
      <section className="border-t border-[#dfe6e1] py-8">
        <h2 className="text-xl font-semibold text-[#203730]">{t("delivery.questionsTitle")}</h2>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-[#235b50]">
          <a href={contactPhones[0].href} className="underline-offset-4 hover:underline">{contactPhones[0].label}</a>
          <a href={contactEmail.href} className="inline-flex items-center gap-2 underline-offset-4 hover:underline"><FiMail size={17} aria-hidden="true" />{contactEmail.label}</a>
        </div>
      </section>
    </main>
  );
};

export default Delivery;
