// `compact` shows one button that switches to the other language, for tight header widths.
const LanguageSwitch = ({ language, onChange, compact = false }) => {
  if (compact) {
    const next = language.startsWith("bg") ? "en" : "bg";
    return (
      <button
        type="button"
        lang={next}
        aria-label={next === "en" ? "English" : "Български"}
        title={next === "en" ? "English" : "Български"}
        onClick={() => onChange(next)}
        className="h-12 min-w-11 rounded-md bg-[#f1f3f2] px-2 text-sm font-semibold text-[#203c35] transition-colors hover:bg-[#e6ebe8]"
      >
        {next.toUpperCase()}
      </button>
    );
  }

  return (
    <div role="group" aria-label="Language" className="inline-flex rounded-md bg-[#f1f3f2] p-1">
      {["en", "bg"].map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={code === "en" ? "English" : "Български"}
          aria-pressed={language.startsWith(code)}
          onClick={() => onChange(code)}
          className={`min-w-11 h-10 rounded text-sm font-semibold transition-colors ${language.startsWith(code) ? "bg-white text-[#203c35] shadow-sm" : "text-[#68736e] hover:text-[#203c35]"}`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitch;
