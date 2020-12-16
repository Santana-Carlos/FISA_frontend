const logReducer = (state = false, action) => {
  let toDo = action.type;
  switch (toDo) {
    case "LOGIN_LOG":
      return true;
    case "LOGOUT_LOG":
      return false;
    default:
      return state;
  }
};

export default logReducer;
