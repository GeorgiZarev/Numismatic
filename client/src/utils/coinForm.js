export const emptyCoinForm = {
  name: "",
  price: "",
  year: "",
  country: "Montenegro",
  currency: "",
  monarch: "",
  price_value: "",
  composition_metal: "",
  weight: "",
  diameter: "",
  shape: "",
  technique: "",
  denomination: "",
  lettering: "",
  script: "",
  mintage: "",
  mint_place: "",
  coin_grading: "",
  number: "",
  status: "active",
  photo: null,
};

export const coinToForm = (coin) => ({
  ...emptyCoinForm,
  ...coin,
  price: coin?.price ?? "",
  year: coin?.year ?? "",
  mintage: coin?.mintage ?? "",
  photo: null,
});

export const buildCoinFormData = (formData) => {
  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key === "photo" && value) {
      data.append("photo", value);
    } else if (key !== "photo" && value !== "" && value !== null) {
      data.append(key, value);
    }
  });

  return data;
};
