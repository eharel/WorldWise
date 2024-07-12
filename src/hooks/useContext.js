import { useContext } from "react";

import { CitiesContext } from "../contexts/CitiesContext";
import { AuthContext } from "../contexts/FakeAuthContext";

export function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (!context) throw new Error("CitiesContext was used outside provider");
  return context;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext was used outside provider");
  return context;
}
