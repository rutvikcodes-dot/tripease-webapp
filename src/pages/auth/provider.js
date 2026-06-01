import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, login, logoutUser, register } from "../../api/authApi";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const AUTH_SESSION_KEY = "tripease_auth_session";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [opened, setOpened] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const restoreSession = async () => {
      const hasSession = localStorage.getItem(AUTH_SESSION_KEY);

      if (!hasSession) {
        setUser(null);
        return;
      }

      try {
        setLoading(true);
        const response = await getProfile();
        setUser(response.data.data);
      } catch (error) {
        localStorage.removeItem(AUTH_SESSION_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isLogin && !form.username.trim()) {
      nextErrors.username = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) {
      notifications.show({
        title: "Check your details",
        message: "Please fix the highlighted fields.",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const response = await login(form);
        const loggedUser = response.data.data.user;
        localStorage.setItem(AUTH_SESSION_KEY, "true");
        setUser(loggedUser);

        notifications.show({
          title: "Success",
          message: "Logged in successfully",
          color: "green",
        });
      } else {
        await register(form);
        notifications.show({
          title: "Success",
          message: "Account created successfully",
          color: "green",
        });
      }

      // Reset form
      setForm({ username: "", email: "", password: "" });
      setErrors({});

      // Close popover
      setOpened(false);

      setLoading(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        color: "red",
      });

      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem(AUTH_SESSION_KEY);
      setUser(null);
    }
  };

  const goToLanding = () => {
    navigate("/");
  };

  const handleModeChange = (value) => {
    if ((value === "login") !== isLogin) {
      toggleMode();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        form,
        errors,
        isLogin,
        opened,
        setOpened,
        updateField,
        submit,
        toggleMode,
        handleModeChange,
        logout,
        goToLanding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
