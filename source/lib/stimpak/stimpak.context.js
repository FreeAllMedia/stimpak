export default function context(object) {
  const action = privateData(this).action;
  if (object) {
    action.context(object);
    return this;
  }

  return action.context();
}
