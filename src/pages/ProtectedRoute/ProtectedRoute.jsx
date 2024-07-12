import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
