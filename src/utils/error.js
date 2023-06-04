export const error = (code) => {
  const err = new Error();
  err.code = code;
  return err;
}