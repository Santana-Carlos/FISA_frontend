const passReducer = (state = "", action) => {
  let toDo = action.type;
  let pass = action.payload;
  switch (toDo) {
    case "UPDATE_PASS":
      return pass;
    default:
      return state;
  }
};

export default passReducer;
