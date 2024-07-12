import { createContext, useReducer } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  user: {},
  login: () => {},
  logout: () => {},
});

export const AuthActionTypes = Object.freeze({
  LOGIN: "login",
  LOGOUT: "logout",

  LOADING: "loading",
  CITIES_LOADED: "cities/loaded",
  CITY_LOADED: "city/loaded",
  CITY_CREATED: "city/created",
  CITIES_DELETED: "cities/deleted",
  REJECTED: "rejected",
});

const initialState = {
  user: null,
  isAuthenticated: false,
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

/* -------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
------------------------------------------------------------------------- AUTH REDUCER
----------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */
function authReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case AuthActionTypes.LOGIN: {
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
      };
    }
    case AuthActionTypes.LOGOUT: {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    }
    default: {
      throw new Error(`Unknown action type: ${type}`);
    }
  }
}

/* -------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-------------------------------------------------------------------------- AUTH PROVIDER
----------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { user, isAuthenticated } = state;

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: AuthActionTypes.LOGIN, payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: AuthActionTypes.LOGOUT });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
