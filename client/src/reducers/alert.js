import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (
    type // action is an objet generally have type and payload(data)
  ) {
    case SET_ALERT:
      return [...state, payload]; //...state--- spread separator to include previous data
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); //here payload is id
    default:
      return state;
  }
}
