export const countryCallingCodes = [
  { country: "BG", code: "+359" },
  { country: "DE", code: "+49" },
  { country: "RO", code: "+40" },
  { country: "GR", code: "+30" },
  { country: "GB", code: "+44" },
  { country: "FR", code: "+33" },
  { country: "IT", code: "+39" },
  { country: "ES", code: "+34" },
  { country: "AT", code: "+43" },
  { country: "US", code: "+1" },
];

export const toInternationalPhone = (countryCode, localNumber) => {
  const input = String(localNumber || "").trim();
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (input.startsWith("+")) return `+${digits}`;
  return `${countryCode}${digits.replace(/^0/, "")}`;
};
