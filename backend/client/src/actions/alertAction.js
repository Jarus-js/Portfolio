import uuid from "uuid";

export const setAlert = (msg, alertType) => {
  return dispatch => {
    const id = uuid.v4();
    dispatch({
      type: "ALERT",
      payload: { id, msg, alertType }
    });
    setTimeout(
      () =>
        dispatch({
          type: "REMOVE_ALERT",
          payload: id
        }),
      10000
    );
  };
};

//A- DTP  => Action- Dispatch,Type,Payload
//Hami action creator state update garna lai create garxau
//When we call action creator state update matra hunxa
//Display garna lai mapStateToProps
