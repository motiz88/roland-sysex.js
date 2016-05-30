export default function observeStore (store, select, onChange) {
  let currentState;

  function handleChange () {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      const prevState = currentState;
      currentState = nextState;
      onChange(currentState, prevState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
