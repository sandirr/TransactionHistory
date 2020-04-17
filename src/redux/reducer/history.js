const initialState = {
  history: [],
  noLoading: false,
};

const history = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_HISTORY_PENDING':
      return {
        ...state,
        noLoading: false,
      };
    case 'GET_HISTORY_REJECTED':
      return {
        ...state,
        noLoading: false,
      };
    case 'GET_HISTORY_FULFILLED':
      return {
        ...state,
        history: action.payload,
        noLoading: true,
      };
    default:
      return state;
  }
};

export default history;
