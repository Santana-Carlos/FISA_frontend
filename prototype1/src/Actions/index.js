export const updateUser = (data) => {
  return {
    type: "UPDATE_USER",
    payload: data,
  };
};

export const updatePass = (data) => {
  return {
    type: "UPDATE_PASS",
    payload: data,
  };
};

export const updateRol = (data) => {
  return {
    type: "UPDATE_ROL",
    payload: data,
  };
};

export const loginToken = (data) => {
  return {
    type: "LOGIN_TOKEN",
    payload: data,
  };
};

export const updateToken = (data) => {
  return {
    type: "UPDATE_TOKEN",
    payload: data,
  };
};

export const logoutToken = (data) => {
  return {
    type: "LOGOUT_TOKEN",
    payload: data,
  };
};

export const logIn = () => {
  return {
    type: "LOGIN_LOG",
  };
};

export const logOut = () => {
  return {
    type: "LOGOUT_LOG",
  };
};
