import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axiosConfig from "../util/axiosConfig";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { useEffect } from "react";

const useUser = () => {
  const { user, setUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      clearUser();
      navigate("/login");
      return;
    }
    if (user) {
      return;
    }

    let isMounted = true;
    const fetchUserInfo = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
        if (isMounted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          clearUser();
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchUserInfo();
    return () => {
      isMounted = false;
    };
  }, [setUser, clearUser, navigate]);
};

export default useUser;
