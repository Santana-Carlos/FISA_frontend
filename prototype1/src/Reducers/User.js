const userReducer = (state = "", action) => {
  let toDo = action.type;
  let user = action.payload;
  switch (toDo) {
    case "UPDATE_USER":
      return user;
    default:
      return state;
  }
};

export default userReducer;
