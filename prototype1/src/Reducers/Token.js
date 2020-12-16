const tokenReducer = (state = "", action) => {
  let toDo = action.type;
  let token = action.payload;
  switch (toDo) {
    case "LOGIN_TOKEN":
      return token;
    case "UPDATE_TOKEN":
      return token;
    case "LOGOUT_TOKEN":
      return "a";
    default:
      return state;
  }
};

export default tokenReducer;
