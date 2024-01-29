import store from './store';

it('has an initial state', ()=>{
  const initState = store.getState();

  expect(typeof initState).toEqual('object');

  expect(Array.isArray(initState.code)).toEqual(true);
});
