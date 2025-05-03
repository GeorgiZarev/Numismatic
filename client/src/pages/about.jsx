import React from "react";
import Title from "../components/Partial/Title";
import { assets } from "../Assets/ObjFile";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-3xl text-center pt-8">
        <Title text1={t("about.title")} />
        <br /> <br />
        <div className="flex-1 h-[1px] bg-gray-300" />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.aboutus}
          alt="about us img"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <b className="text-gray-800">{t("about.heading")}</b>
          <p>{t("about.intro")}</p>
          <p>{t("about.experience")}</p>
          <b className="text-gray-800">{t("about.business_heading")}</b>
          <p>{t("about.business_info")}</p>
        </div>
      </div>
      <hr /> <br />
      <div className="text-3xl py-4 flex items-center space-x-4">
        <Title text1={t("why_choose_us.title")} />
        <div className="flex-1 h-[1px] bg-gray-300" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 mb-20">
        <div className="p-20">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {t("why_choose_us.authenticity_title")}
          </h3>
          <p className="text-gray-600">
            {t("why_choose_us.authenticity_desc")}
          </p>
        </div>

        <div className="p-20">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {t("why_choose_us.exclusive_title")}
          </h3>
          <p className="text-gray-600">{t("why_choose_us.exclusive_desc")}</p>
        </div>

        <div className="p-20">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {t("why_choose_us.guidance_title")}
          </h3>
          <p className="text-gray-600">{t("why_choose_us.guidance_desc")}</p>
        </div>
      </div>
    </div>
  );
}

export default About;
