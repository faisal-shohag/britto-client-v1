import { FreeUserContext } from "@/context/FreeUser.context";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export const FreeUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      const localUser = localStorage.getItem("user");
      if (!localUser) {
        setLoading(false);
        return;
      }
      const phone = JSON.parse(localUser).phone;
      const res = await api.get(`/freeUser/${phone}`);
      const currentUser = res.data.result;
      if(currentUser)   localStorage.setItem('user', JSON.stringify(currentUser))
      setUser(currentUser);
      setLoading(false);
    };
    getCurrentUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const userData: any = {
    user,
    setUser,
    loading,
    logout
  };

  return <FreeUserContext value={userData}>{children}</FreeUserContext>;
};
