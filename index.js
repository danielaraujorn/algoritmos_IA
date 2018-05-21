class Perceptron {
  constructor(x, y, epochs = 1000, learn_rate = 0.1, error = 0) {
    // used to generate percent accuracy
    this.error = error;
    this.acc = 0;
    this.samples = 0;
    this.x = x;
    this.y = y;

    this.epochs = epochs;
    this.learn_rate = learn_rate;

    this.biasWeight = new Array(y[0].length)
      .fill(0)
      .map(item => Math.random() * 2 - 1);
    this.weights = new Array(y[0].length)
      .fill(0)
      .map(item =>
        new Array(x[0].length).fill(0).map(i => Math.random() * 2 - 1)
      );
  }

  accuracy() {
    return this.acc / this.samples;
  }

  activation(n) {
    return n < 0 ? 0 : 1;
  }
  multiply(input, pesos, bias) {
    let sum = 0;
    for (var i = input.length - 1; i >= 0; i--) {
      sum += input[i] * pesos[i] - bias;
    }
    return sum;
  }
  predict(input) {
    return this.weights.map((pesos, i) =>
      this.activation(this.multiply(input, pesos, this.biasWeight[i]))
    );
  }

  fit() {
    return new Promise(resolve => {
      for (let e = 0; e < this.epochs; e++) {
        this.x.forEach((input, i) => {
          let prediction = this.predict(input);
          this.y[i].forEach((output, j) => {
            output === prediction[j] ? (this.acc += 1) : (this.acc -= 1);
            let loss = output - prediction[j];
            for (var p = this.weights[j].length - 1; p >= 0; p--) {
              this.weights[j][p] += loss * input[p] * this.learn_rate;
            }
            this.biasWeight[j] -= loss * this.learn_rate;
            this.samples++;
          });
        });

        // console.log(this.accuracy(), e);

        if (1 - this.accuracy() < this.error) break;
      }
      console.log(this.weights, this.biasWeight);
      resolve();
    });
  }
}
const inputs = [
  {
    input: [1.9, 0.5],
    output: [1, 1]
  },
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
const x = inputs.map(item => item.input);
const y = inputs.map(item => item.output);

let myPerceptron = new Perceptron(x, y, 5000000, 0.0005, 0.001);

myPerceptron.fit().then(() => {
  console.log("vai", myPerceptron.predict([0.5, 0.5]));
});
