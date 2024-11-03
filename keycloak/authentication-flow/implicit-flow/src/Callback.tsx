import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export function Callback() {
  const { hash } = useLocation();
  const { auth, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/login");
      return;
    }

    const searcheParams = new URLSearchParams(hash.replace("#", ""));
    const accessToken = searcheParams.get("access_token");
    const idToken = searcheParams.get("id_token");
    const state = searcheParams.get("state");

    if (!accessToken || !idToken || !state) {
      navigate("/login");
      return;
    }

    login(accessToken, idToken, state);
  }, [hash, auth, login, navigate]);

  return <div>Loading...</div>;
}
