const LanguageSwitch = ({ language, onChange }) => (
  <div role="group" aria-label="Language" className="inline-flex rounded-md bg-[#f1f3f2] p-1">
    {["en", "bg"].map((code) => (
      <button
        key={code}
        type="button"
        lang={code}
        aria-label={code === "en" ? "English" : "Български"}
        aria-pressed={language.startsWith(code)}
        onClick={() => onChange(code)}
        className={`min-w-10 h-9 rounded text-xs font-semibold transition-colors ${language.startsWith(code) ? "bg-white text-[#203c35] shadow-sm" : "text-[#68736e] hover:text-[#203c35]"}`}
      >
        {code.toUpperCase()}
      </button>
    ))}
  </div>
);

export default LanguageSwitch;
