export const getHistory = () => {
  return {
    type: 'GET_HISTORY',
    payload: fetch('https://nextar.flip.id/frontend-test').then(res => {
      return res.json();
    }),
  };
};
