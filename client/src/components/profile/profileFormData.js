export const splitFullName = (fullName = "") => {
  const [firstName = "", ...lastNames] = (fullName || "").trim().split(/\s+/);
  return { first_name: firstName, last_name: lastNames.join(" ") };
};

export const profileFormFromUser = (user) => {
  const date = String(user?.birth_date || "").slice(0, 10);
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  return {
    ...splitFullName(user?.full_name),
    phone: user?.phone || "",
    birth_day: parts ? String(Number(parts[3])) : "",
    birth_month: parts ? String(Number(parts[2])) : "",
    birth_year: parts?.[1] || "",
    preferred_language: user?.preferred_language || "",
  };
};
