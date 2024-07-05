import { useContext } from "react";

import { CitiesContext } from "../contexts/CitiesContext";

export function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (!context) throw new Error("CitiesContext was used outside provider");
  return context;
}
