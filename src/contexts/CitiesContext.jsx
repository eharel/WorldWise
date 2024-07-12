import { createContext, useCallback, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

// It's a good idea to model these actions as events and not setters
// It makes it easier to see state transitions
export const CityActionTypes = Object.freeze({
  LOADING: "loading",
  CITIES_LOADED: "cities/loaded",
  CITY_LOADED: "city/loaded",
  CITY_CREATED: "city/created",
  CITIES_DELETED: "cities/deleted",
  REJECTED: "rejected",
});

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

/* -------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
------------------------------------------------------------------------- CITIES REDUCER
----------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */
function citiesReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case CityActionTypes.LOADING: {
      return { ...state, isLoading: true };
    }
    case CityActionTypes.CITIES_LOADED: {
      return {
        ...state,
        isLoading: false,
        cities: payload,
      };
    }
    case CityActionTypes.CITY_LOADED: {
      return {
        ...state,
        isLoading: false,
        currentCity: payload,
      };
    }
    case CityActionTypes.CITY_CREATED: {
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, payload],
        currentCity: payload,
      };
    }
    case CityActionTypes.CITY_DELETED: {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== payload),
        currentCity: {},
      };
    }
    case CityActionTypes.REJECTED: {
      return { ...state, isLoading: false, error: payload };
    }
    default: {
      throw new Error(`Unknown action type: ${type}`);
    }
  }
}

/* -------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
------------------------------------------------------------------------ CITIES PROVIDER
----------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */
function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(citiesReducer, initialState);
  const { cities, isLoading, currentCity, error } = state;

  // Reducers need to be pure functions.
  // Meaning async functions and API calls must occur outside.
  async function fetchCities() {
    dispatch({ type: CityActionTypes.LOADING });
    try {
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();

      dispatch({ type: CityActionTypes.CITIES_LOADED, payload: data });
    } catch {
      dispatch({
        type: CityActionTypes.REJECTED,
        payload: "There was an error loading the cities",
      });
    }
  }

  useEffect(function () {
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (String(id) === String(currentCity.id)) return;

      dispatch({ type: CityActionTypes.LOADING });

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: CityActionTypes.CITY_LOADED, payload: data });
      } catch {
        dispatch({
          type: CityActionTypes.REJECTED,
          payload: "There was an error loading the city",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: CityActionTypes.LOADING });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: CityActionTypes.CITY_CREATED, payload: data });
    } catch {
      dispatch({
        type: CityActionTypes.REJECTED,
        payload: "There was an error creating the city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: CityActionTypes.LOADING });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: CityActionTypes.CITY_DELETED, payload: id });
    } catch {
      dispatch({
        type: CityActionTypes.REJECTED,
        payload: "There was an error deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
