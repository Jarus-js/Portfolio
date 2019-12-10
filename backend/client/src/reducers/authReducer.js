const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null //after loading matra update garne
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "REGISTER_SUCCESS":
      return {
        ...state,
        ...payload,
        isAuthenticated: true
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        user: payload.user
      };

    case "REGISTER_FAIL":
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null
      };

    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,

        user: payload
      };
    default:
      return state;
  }
};
