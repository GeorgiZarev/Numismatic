import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BirthDateSelect from "../auth/BirthDateSelect";
import { availableBirthDays, toBirthDate } from "../../utils/birthDate";
import { profileFormFromUser } from "./profileFormData";
import { inputClass, primaryButtonClass } from "./profileStyles";

const ProfileForm = ({ user, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(() => profileFormFromUser(user));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(profileFormFromUser(user));
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => {
      const next = { ...previous, [name]: value };
      const today = new Date();
      if (name === "birth_year" && Number(next.birth_year) === today.getFullYear()
        && Number(next.birth_month) > today.getMonth() + 1) next.birth_month = "";
      if ((name === "birth_month" || name === "birth_year")
        && Number(next.birth_day) > availableBirthDays(next.birth_month, next.birth_year, today)) next.birth_day = "";
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    const { first_name, last_name, birth_day, birth_month, birth_year, phone, preferred_language } = formData;
    const birthDate = toBirthDate(birth_day, birth_month, birth_year);
    if ((birth_day || birth_month || birth_year) && !birthDate) {
      setError(t("auth.invalidBirthDate"));
      return;
    }
    setSaving(true);

    try {
      await onSave({
        full_name: [first_name.trim(), last_name.trim()].filter(Boolean).join(" "),
        phone,
        birth_date: birthDate || null,
        preferred_language: preferred_language || null,
      });
      setMessage(t("profile.profileSaved"));
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          t("profile.saveProfileError")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#dce3df] py-10 sm:py-12">
      <h2 className="mb-6 font-serif text-2xl font-semibold text-[#142e28] sm:text-[28px]">{t("profile.contactDetails")}</h2>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("auth.first_name")}</span>
          <input name="first_name" type="text" autoComplete="given-name" value={formData.first_name} onChange={handleChange} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("auth.last_name")}</span>
          <input name="last_name" type="text" autoComplete="family-name" value={formData.last_name} onChange={handleChange} className={inputClass} />
        </label>
        <BirthDateSelect day={formData.birth_day} month={formData.birth_month} year={formData.birth_year} onChange={handleChange} t={t} required={false} labelKey="profile.birthDate" />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("profile.phone")}</span>
          <input name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("profile.preferredLanguage")}</span>
          <select name="preferred_language" value={formData.preferred_language} onChange={handleChange} className={inputClass}>
            <option value="">{t("profile.notSet")}</option>
            <option value="bg">{t("auth.bulgarian")}</option>
            <option value="en">{t("auth.english")}</option>
          </select>
        </label>
      </div>

      {message && <p role="status" className="mt-4 text-sm text-[#235b50]">{message}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-[#963b33]">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className={`mt-7 ${primaryButtonClass}`}
      >
        {t(saving ? "profile.saving" : "profile.saveProfile")}
      </button>
    </form>
  );
};

export default ProfileForm;
