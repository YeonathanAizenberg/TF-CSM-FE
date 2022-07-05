const domParser = (domString) => {
  return new DOMParser().parseFromString(domString, "text/html");
};

export default domParser;