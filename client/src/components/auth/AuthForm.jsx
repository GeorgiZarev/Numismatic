import { useTranslation } from "react-i18next";
import { contactEmail } from "../../utils/contactDetails";
import AuthField from "./AuthField";
import RegistrationFields from "./RegistrationFields";

const AuthForm = ({ forms }) => {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-[1340px] pb-20 pt-12 sm:pt-16">
      <section aria-labelledby="existing-customer-title" className="border-b border-[#dce3df] pb-14 sm:pb-16">
        <h1 id="existing-customer-title" className="font-serif text-[32px] font-semibold leading-tight text-[#142e28] sm:text-[38px]">{t("auth.existingCustomer")}</h1>
        <p className="mt-3 text-base text-[#53655b]">{t("auth.existingIntro")}</p>

        <form onSubmit={forms.submitLogin} className="mt-8" aria-busy={forms.loginLoading}>
          <div className="grid gap-5 md:grid-cols-2 md:gap-8">
            <AuthField id="login-email" name="email" type="email" label={t("auth.email")} value={forms.loginData.email} onChange={forms.changeLogin} autoComplete="email" t={t} />
            <AuthField id="login-password" name="password" type="password" label={t("auth.password")} value={forms.loginData.password} onChange={forms.changeLogin} autoComplete="current-password" t={t} />
          </div>
          {forms.loginError && <p role="alert" className="mt-5 text-sm text-[#a0312c]">{forms.loginError}</p>}
          <div className="mt-5 grid items-center gap-5 md:grid-cols-2 md:gap-8">
            <button type="submit" disabled={forms.loginLoading} className="min-h-12 bg-[#c69a5d] px-6 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#ad8147] disabled:opacity-60">
              {forms.loginLoading ? t("auth.pleaseWait") : t("auth.login")}
            </button>
            <a href={contactEmail.href} className="justify-self-start border-b border-[#c69a5d] pb-1 text-sm font-medium text-[#17342c] hover:text-[#8b602f] md:justify-self-end">{t("auth.loginHelp")}</a>
          </div>
        </form>
      </section>

      <section aria-labelledby="new-customer-title" className="pt-14 sm:pt-16">
        <h2 id="new-customer-title" className="font-serif text-[32px] font-semibold leading-tight text-[#142e28] sm:text-[38px]">{t("auth.newCustomer")}</h2>
        <p className="mt-3 text-base text-[#53655b]">{t("auth.newIntro")}</p>

        <form onSubmit={forms.submitRegistration} className="mt-8" aria-busy={forms.registrationLoading}>
          <RegistrationFields data={forms.registrationData} onChange={forms.changeRegistration} t={t} />
          <p className="mt-3 text-sm text-[#65766b]">{t("auth.passwordHint")}</p>
          {forms.registrationError && <p role="alert" className="mt-5 text-sm text-[#a0312c]">{forms.registrationError}</p>}
          <div className="mt-8 flex justify-end border-t border-[#dce3df] pt-7">
            <button type="submit" disabled={forms.registrationLoading} className="min-h-12 w-full bg-[#c69a5d] px-8 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#ad8147] disabled:opacity-60 sm:w-auto sm:min-w-60">
              {forms.registrationLoading ? t("auth.pleaseWait") : t("auth.createAccount")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AuthForm;
