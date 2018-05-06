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
            new Array(i ? hiddenLayersCount : x[0].length + 1)
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
    // console.log("multiply", input, weights);
    let sum = -weights[weights.length - 1];
    for (var i = 0; i < input.length; i++) {
      sum += input[i] * weights[i];
    }
    return sum;
  }
  predict(input) {
    const feedFoward = this.feedFoward(input, this.layers.length - 1);
    return this.oWeights.map(item =>
      this.activation(this.multiply(feedFoward, item))
    );
  }

  feedFoward(input, layerIndex) {
    // mostra as entradad da camada que vc deseja
    let validInput = [...input];
    let tempInput = [];
    for (let i = 0; i <= layerIndex; i++) {
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
    let feedFoward = this.feedFoward(input, this.layers.length - 1);

    let sum = 0;
    for (let outputIndex = 0; outputIndex < output.length; outputIndex++) {
      sum += Math.pow(
        output[outputIndex] -
          this.activation(
            this.multiply(feedFoward, this.oWeights[outputIndex])
          ),
        2
      );
    }
    // console.log("oneError", sum / 2);
    return sum / 2;
  }
  errorOutput(input, output, pesos) {
    return (
      output -
      this.activation(
        this.multiply(this.feedFoward(input, this.layers.length - 1), pesos)
      )
    );
  }
  totalError() {
    // acha o erro na ultima camada
    let sum = 0;
    for (let inputIndex = 0; inputIndex < this.x.length; inputIndex++) {
      sum += this.oneError(
        this.x[inputIndex],
        this.y[inputIndex],
        this.layers.length - 1
      );
    }
    // console.log("total error", sum, this.x.length);
    return sum / this.x.length;
  }

  fit() {
    return new Promise(resolve => {
      console.time("train");
      for (let e = 0; e < this.epochs; e++) {
        for (
          let datasetIndex = 0;
          datasetIndex < this.x.length;
          datasetIndex++
        ) {
          let inputOutLayer = this.feedFoward(
            this.x[datasetIndex],
            this.layers.length - 1
          );
          let globalGradient = 0;
          // console.log("camada output");
          for (let neuronio = 0; neuronio < this.oWeights.length; neuronio++) {
            // console.log(inputOutLayer, this.oWeights[neuronio]);
            let gradiente =
              this.errorOutput(
                inputOutLayer,
                this.y[datasetIndex][neuronio],
                this.oWeights[neuronio]
              ) *
              this.activationDerivative(
                this.multiply(inputOutLayer, this.oWeights[neuronio])
              );
            for (let peso = 0; peso < this.oWeights[neuronio].length; peso++) {
              this.oWeights[neuronio][peso] +=
                this.learn_rate * gradiente * inputOutLayer[peso];
              globalGradient += gradiente * this.oWeights[neuronio][peso];
            }
            // console.log("gg", globalGradient);
          }
          for (
            let layerIndex = this.layers.length - 1;
            layerIndex >= 0;
            layerIndex--
          ) {
            let tempGlobalGradient = 0;
            let inputLayer = this.feedFoward(this.x[datasetIndex], layerIndex);
            for (
              let neuronioIndex = 0;
              neuronioIndex < this.layers[layerIndex].length;
              neuronioIndex++
            ) {
              // console.log(inputLayer);
              let gradiente =
                this.activationDerivative(
                  this.multiply(
                    inputLayer,
                    this.layers[layerIndex][neuronioIndex]
                  )
                ) * globalGradient;
              for (
                let pesoIndex = 0;
                pesoIndex < this.layers[layerIndex][neuronioIndex].length;
                pesoIndex++
              ) {
                this.layers[layerIndex][neuronioIndex][pesoIndex] +=
                  this.learn_rate * gradiente * inputLayer[pesoIndex];
                tempGlobalGradient +=
                  gradiente * this.layers[layerIndex][neuronioIndex][pesoIndex];
              }
            }
            globalGradient += tempGlobalGradient;
          }
        }
      }
      console.timeEnd("train");
      // console.log(this.layers, this.oWeights);
      resolve();
    });
  }
}
let x = [[1, 1], [0, 1], [1, 0], [0, 0]];
let y = [[0], [1], [1], [0]];
let myPerceptron = new Perceptron(x, 2, 3, y, 10000, 0.01, 0.05);

myPerceptron
  .fit()
  .then(() =>
    console.log(
      myPerceptron.predict([1, 1]),
      myPerceptron.predict([1, 0]),
      myPerceptron.predict([0, 1]),
      myPerceptron.predict([0, 0])
    )
  );
