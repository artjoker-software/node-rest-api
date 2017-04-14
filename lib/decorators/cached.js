// eslint-disable-next-line arrow-parens, arrow-body-style
export default TargetDAO => {
  return class CachedWrapper extends TargetDAO {
    isCacheEnabled = true;
  };
};
