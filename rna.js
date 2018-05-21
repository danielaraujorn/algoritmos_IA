var Matrix = require("./matrix");
class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(x => Math.tanh(x), y => 1 - y * y);

class NeuralNetwork {
  // TODO: document what a, b, c are
  constructor(a, b, c) {
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();
  }

  predict(input_array) {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }
  train(dataset, iterations = 10000, learningRate = 0.05) {
    return new Promise(resolve => {
      this.setLearningRate(learningRate);
      for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < dataset.length; j++) {
          this.trainStep(dataset[j].input, dataset[j].output);
        }
      }
      resolve();
    });
  }
  trainStep(input_array, target_array) {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    // console.log("inputs", inputs);
    // console.log("pesos", this.weights_ih);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    // console.log("hidden", hidden);
    // console.log("bias", this.bias_h);
    hidden.add(this.bias_h);
    // console.log("hiddenb", hidden);
    // activation function!
    hidden.map(this.activation_function.func);
    // console.log("hiddensigmoid", hidden);

    // Generating the output's output!
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    // console.log("outputs", outputs);
    // console.log("bias out", this.bias_o);
    outputs.add(this.bias_o);
    // console.log("outb", outputs);
    outputs.map(this.activation_function.func);
    // console.log("outsigmoid", outputs);

    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);
    // console.log("targets", targets);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);
    // console.log("output error", output_errors);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, this.activation_function.dfunc);
    // console.log("gradient", gradients);
    gradients.multiply(output_errors);
    // console.log("gradient*errors", gradients);
    gradients.multiply(this.learning_rate);
    // console.log("gradient*learning", gradients);

    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    // console.log("hidden_T", hidden_T);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
    // console.log("weight_ho_deltas", weight_ho_deltas);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // console.log("this.weights_ho", this.weights_ho);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);
    // console.log("bias_o", this.bias_o);

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    // console.log("who_t", who_t);
    let hidden_errors = Matrix.multiply(who_t, output_errors);
    // console.log("hidden_errors", hidden_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    // console.log("hidden_errors", hidden_gradient);
    hidden_gradient.multiply(hidden_errors);
    // console.log("hidden_gradient*hidden_errors", hidden_gradient);
    hidden_gradient.multiply(this.learning_rate);
    // console.log("hidden_gradient*learning_rate", hidden_gradient);

    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    // console.log("inputs_T", inputs_T);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
    // console.log("weight_ih_deltas", weight_ih_deltas);

    this.weights_ih.add(weight_ih_deltas);
    // console.log("weights_ih", this.weights_ih);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);
    // console.log("bias_h", this.bias_h);

    // outputs.print();
    // targets.print();
    // error.print();
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == "string") {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(
      data.input_nodes,
      data.hidden_nodes,
      data.output_nodes
    );
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }

  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }
}

module.exports = NeuralNetwork;
