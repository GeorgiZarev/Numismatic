import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthField = ({ id, label, name, type = "text", value, onChange, autoComplete, minLength, required = true, t }) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="mb-2 block text-sm font-medium text-[#263c34]">{label}{required && <> <span aria-hidden="true">*</span></>}</span>
      <span className="relative block">
        <input
          id={id}
          name={name}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
          className={`min-h-12 w-full border border-[#dce3df] bg-[#f5f6f5] px-4 text-base text-[#17342c] outline-none transition-colors placeholder:text-[#7e8a83] focus:border-[#2a6556] focus:bg-white ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#496357] hover:text-[#17342c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2a6556]"
          >
            {visible ? <FiEyeOff size={19} aria-hidden="true" /> : <FiEye size={19} aria-hidden="true" />}
          </button>
        )}
      </span>
    </label>
  );
};

export default AuthField;
