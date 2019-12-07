/*
  const initialState = [
    {id:1,msg:'error message',alertType:'success'}
  ]
*/

const initialState = [];
export default (state = initialState, action) => {
  //action => action bata dispatch vayera aako action
  switch (action.type) {
    case "ALERT":
      return [...state, action.payload];
    case "REMOVE_ALERT":
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
};

//R - SA => Reducer - State,Action
