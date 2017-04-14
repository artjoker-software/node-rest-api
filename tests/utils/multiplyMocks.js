const multiplyMocks = (mocks, power = 7) => {
  let multiplied = mocks;

  for (let idx = 0; idx < power; idx += 1) {
    multiplied = [...multiplied, ...multiplied];
  }

  for (let idx = mocks.length; idx < multiplied.length; idx += 1) {
    multiplied[idx] = {
      ...multiplied[idx],
      id: idx.toString()
    };
  }

  return multiplied;
};

export default multiplyMocks;
