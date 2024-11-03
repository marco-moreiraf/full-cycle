import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";

export function Logout() {
  const { makeLogoutUrl } = useContext(AuthContext);

  useEffect(() => {
    const url = makeLogoutUrl();
    if (url) {
      window.location.href = url;
    }
  }, [makeLogoutUrl]);

  return <div>Loading...</div>;
}
