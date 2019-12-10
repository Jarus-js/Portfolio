import axios from "axios";
//action creator
import { setAlert } from "./alertAction";
import setAuthToken from "../utils/setAuthToken";
//redirect
import history from "../history";

export const register = ({ name, email, password }) => {
  return dispatch => {
    axios
      .post("/api/users/register", { name, email, password })
      .then(response => {
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: response.data //register ko response(payload) token
        });
        localStorage.setItem("token", response.data.token);
        history.push("/login");
      })
      .catch(err => {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: "REGISTER_FAIL"
        });
      });
  };
};
export const login = ({ email, password }) => {
  return dispatch => {
    axios
      .post("/api/users/login", { email, password })
      .then(response => {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data
        });
        localStorage.setItem("token", response.data.token);
        history.push("/dashboard");
      })
      .catch(err => {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: "LOGIN_FAIL"
        });
      });
  };
};

export const loadUser = () => {
  return dispatch => {
    if (localStorage.token) {
      return setAuthToken(localStorage.token);
    }

    axios
      .get("/api/users/current")
      .then(response => {
        dispatch({
          type: "USER_LOADED",
          payload: response.data
        });
      })
      .catch(err => {
        dispatch({
          type: "AUTH_ERROR"
        });
      });
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({
      type: "LOGOUT"
    });
  };
};
