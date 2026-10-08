import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Contexts/authContext";
import { availableBirthDays, toBirthDate } from "../utils/birthDate";
import { toInternationalPhone } from "../utils/phoneNumber";

const initialLogin = { email: "", password: "" };
const initialRegistration = {
  first_name: "", last_name: "", birth_day: "", birth_month: "", birth_year: "", phone_country_code: "+359", phone: "",
  email: "", email_confirmation: "", password: "", preferred_language: "en",
  city: "", address: "", postal_code: "", address_line_2: "", country: "",
};

const getErrorMessage = (error) =>
  error.response?.data?.error?.message || error.response?.data?.message || error.message;

export const useAuthPageForms = () => {
  const { login, register } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState(initialLogin);
  const [registrationData, setRegistrationData] = useState(() => ({
    ...initialRegistration,
    preferred_language: i18n.resolvedLanguage?.startsWith("bg") ? "bg" : "en",
  }));
  const [loginError, setLoginError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  const changeLogin = (event) => {
    const { name, value } = event.target;
    setLoginData((previous) => ({ ...previous, [name]: value }));
  };

  const changeRegistration = (event) => {
    const { name, value } = event.target;
    setRegistrationData((previous) => {
      const next = { ...previous, [name]: value };
      if (name === "birth_year" && Number(next.birth_year) === new Date().getFullYear()
        && Number(next.birth_month) > new Date().getMonth() + 1) next.birth_month = "";
      if ((name === "birth_month" || name === "birth_year")
        && Number(next.birth_day) > availableBirthDays(next.birth_month, next.birth_year)) next.birth_day = "";
      return next;
    });
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const user = await login(loginData);
      if (user?.preferred_language) await i18n.changeLanguage(user.preferred_language);
      navigate("/");
    } catch (error) {
      setLoginError(getErrorMessage(error));
    } finally {
      setLoginLoading(false);
    }
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    setRegistrationError("");
    if (registrationData.email.trim().toLowerCase() !== registrationData.email_confirmation.trim().toLowerCase()) {
      setRegistrationError(t("auth.emailMismatch"));
      return;
    }
    const birthDate = toBirthDate(registrationData.birth_day, registrationData.birth_month, registrationData.birth_year);
    if (!birthDate) {
      setRegistrationError(t("auth.invalidBirthDate"));
      return;
    }
    setRegistrationLoading(true);
    try {
      const { birth_day, birth_month, birth_year, phone_country_code, phone, ...otherFields } = registrationData;
      const payload = { ...otherFields, birth_date: birthDate, phone: toInternationalPhone(phone_country_code, phone) };
      await register(payload);
      await i18n.changeLanguage(payload.preferred_language);
      navigate("/profile");
    } catch (error) {
      setRegistrationError(getErrorMessage(error));
    } finally {
      setRegistrationLoading(false);
    }
  };

  return {
    loginData, registrationData, loginError, registrationError,
    loginLoading, registrationLoading, changeLogin, changeRegistration,
    submitLogin, submitRegistration,
  };
};
