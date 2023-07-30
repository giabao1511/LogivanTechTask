const test = ["a", null, "b", "c"];

const testFunc = (data) => {
  switch (data) {
    case "a":
      return "a";
    case "b":
      return "b";
    default:
      return "";
  }
};

const arr = test.map(testFunc).filter(Boolean);

console.log(arr);
