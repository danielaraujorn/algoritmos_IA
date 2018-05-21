var MLP = require("./rna");

var myNet = new MLP(2, 2, 2);

const dataset = [
  {
    input: [1.6, 0],
    output: [1, 1]
  },
  {
    input: [1.5, 0.2],
    output: [1, 1]
  },
  {
    input: [1.4, 0.4],
    output: [1, 1]
  },
  {
    input: [1.3, 0.5],
    output: [1, 1]
  },
  {
    input: [1.2, 0.7],
    output: [1, 1]
  },
  {
    input: [1.1, 0.9],
    output: [1, 1]
  },
  {
    input: [1.1, 1],
    output: [1, 1]
  },
  {
    input: [1.4, 0],
    output: [0, 1]
  },
  {
    input: [1.3, 0.2],
    output: [0, 1]
  },
  {
    input: [1.2, 0.4],
    output: [0, 1]
  },
  {
    input: [1.1, 0.6],
    output: [0, 1]
  },
  {
    input: [1, 0.7],
    output: [0, 1]
  },
  {
    input: [1, 0.8],
    output: [0, 1]
  },
  {
    input: [0.6, 0],
    output: [0, 1]
  },
  {
    input: [0.7, 0.2],
    output: [0, 1]
  },
  {
    input: [0.8, 0.4],
    output: [0, 1]
  },
  {
    input: [0.8, 0.5],
    output: [0, 1]
  },
  {
    input: [0.45, 0],
    output: [0, 0]
  },
  {
    input: [0.5, 0.3],
    output: [0, 0]
  },
  {
    input: [0.6, 0.5],
    output: [0, 0]
  },
  {
    input: [0.8, 0.9],
    output: [0, 0]
  },
  {
    input: [0.9, 1],
    output: [0, 0]
  }
];

myNet
  .train(dataset, 10000, 0.05)
  .then(() => console.log(myNet.predict([0.1, 0.5])));
