const rolReducer = (state = "", action) => {
  let toDo = action.type;
  let rol = action.payload;
  switch (toDo) {
    case "UPDATE_ROL":
      return rol;
    default:
      return state;
  }
};

export default rolReducer;
