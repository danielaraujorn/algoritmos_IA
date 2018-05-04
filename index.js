const activationTypeObj = {
  tanh: n => Math.tanh(n),
  sigmoid: value => 1 / (1 + Math.exp(-value)),
  sigmoidDerivative: value => {
    let sig = 1 / (1 + Math.exp(-value));
    return sig * (1 - sig);
  }
};
class Perceptron {
  constructor(
    x,
    hiddenLayersNumber,
    hiddenLayersCount,
    y,
    epochs = 1000,
    learn_rate = 0.1,
    error = 0,
    activation = "sigmoid"
  ) {
    // used to generate percent accuracy
    this.activationType = activation;
    this.error = error;
    this.acc = 0;
    this.samples = 0;
    this.x = x;
    // primeira de dimensão da Layers é qual camada é, a segunda é o neuronio, terceira é o peso
    this.layers = new Array(hiddenLayersNumber)
      .fill(0)
      .map((item, i) =>
        new Array(hiddenLayersCount)
          .fill(0)
          .map(j =>
            new Array(i ? hiddenLayersCount + 1 : x[0].length + 1)
              .fill(0)
              .map(k => Math.random() * 2 - 1)
          )
      );
    this.y = y;
    this.epochs = epochs;
    this.learn_rate = learn_rate;

    this.oWeights = new Array(y[0].length)
      .fill(0)
      .map(j =>
        new Array(hiddenLayersCount).fill(0).map(i => Math.random() * 2 - 1)
      );
  }
  activation(n) {
    return activationTypeObj[this.activationType](n);
  }
  activationDerivative(n) {
    return activationTypeObj[this.activationType + "Derivative"](n);
  }
  multiply(input, weights) {
    console.log("multiply", input, weights);
    let sum = -weights[weights.length - 1];
    for (var i = 0; i < input.length; i++) {
      sum += input[i] * weights[i];
    }
    return sum;
  }
  predict(input, weights) {
    // console.log("predict", input, weights);
    return this.activation(this.multiply(input, weights));
  }

  feedFoward(input, layerIndex) {
    let validInput = [...input];
    let tempInput = [];
    for (let i = 0; i < layerIndex + 1; i++) {
      for (let j = 0; j < this.layers[i].length; j++) {
        tempInput = [
          ...tempInput,
          this.activation(this.multiply(validInput, this.layers[i][j]))
        ];
      }
      validInput = tempInput;
      tempInput = [];
    }
    return validInput;
  }
  oneError(input, output) {
    let sum = 0;
    for (let outputIndex = 0; outputIndex < output.length; outputIndex++) {
      sum += Math.pow(
        output[outputIndex] -
          this.predict(
            this.feedFoward(input, this.layers[this.layers.length - 1]),
            this.oWeights[outputIndex]
          ),
        2
      );
    }
    // console.log("oneError", sum / 2);
    return sum / 2;
  }
  totalError() {
    let sum = 0;
    for (let inputIndex = 0; inputIndex < this.x.length; inputIndex++) {
      sum += this.oneError(this.x[inputIndex], this.y[inputIndex]);
    }
    // console.log("total error", sum, this.x.length);
    return sum / this.x.length;
  }
  fit() {
    return new Promise(resolve => {
      for (let e = 0; e < this.epochs; e++) {
        // this.oWeights[neuronio][peso]+=this.learn_rate*this.oneError(this.x[],this.y[])*this.activationDerivative(this.x[],camada)
        // this.layers[camada][neuronio][peso]+=this.learn_rate*this.oneError(this.x[],this.y[])*this.activationDerivative(this.x[],camada)
        // for (let inputIndex = 0; inputIndex < this.x.length; inputIndex++) {
        //   for (let a = 0; a < this.y[0].length; a++) {
        //     let erro = this.error(this.x[inputIndex], this.y[inputIndex]);
        //   }
        // }
        // this.x.forEach((input, i) => {
        //   let predic tion = this.predict(input);
        //   this.y[i] === prediction ? (this.acc += 1) : (this.acc -= 1);
        //   let loss = this.y[i] - prediction;
        //   for (var p = this.weights.length - 1; p >= 0; p--) {
        //     this.weights[p] += loss * input[p] * this.learn_rate;
        //   }
        //   this.biasWeight -= loss * this.learn_rate;
        //   this.samples++;
        // });
        // console.log(this.accuracy(), e);
        // if (1 - this.accuracy() < this.error) break;
      }
      console.log(this.layers, this.oWeights);
      resolve();
    });
  }
}
let x = [[1, 1], [0, 1], [1, 0], [0, 0]];
let y = [[1], [1], [1], [0]];
let myPerceptron = new Perceptron(x, 2, 3, y, 50000, 0.01, 0.05);

// console.log("totalError", myPerceptron.totalError());
// myPerceptron.fit().then(() => {
//   console.log(
//     "vai"
//     // myPerceptron.predict([1, 1]),
//     // myPerceptron.predict([0, 0])
//   );
// });
