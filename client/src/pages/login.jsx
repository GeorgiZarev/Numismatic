import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/authContext";
import AuthForm from "../components/auth/AuthForm";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await register(formData);
        navigate("/profile");
      } else {
        await login({
          username: formData.username,
          password: formData.password,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      setLocalError(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 py-10">
      <AuthForm
        error={localError || error}
        formData={formData}
        isRegistering={isRegistering}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onToggleMode={() => {
          setLocalError("");
          setIsRegistering((prev) => !prev);
        }}
      />
    </div>
  );
};

export default Login;
