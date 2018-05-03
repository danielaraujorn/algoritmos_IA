const activationTypeObj={
	tanh:(n)=>Math.tanh(n),
}
class Perceptron{
	constructor (x, y, epochs=1000, learn_rate= 0.1, error=0,activation='tanh') {

	// used to generate percent accuracy
	this.activationType=activation
	this.error=error
	this.acc = 0
	this.samples = 0
	this.x = x
	this.y = y

	this.epochs = epochs
	this.learn_rate = learn_rate

	this.biasWeight = Math.random() * 2 - 1
	this.weights = new Array(x[0].length).fill(0).map(i=>(Math.random() * 2 - 1))
	
	}

	accuracy () {
		return this.acc/this.samples
	}

	activation (n) {
		return n < 0 ? 0 : 1
	}
	multiply(input,weights,bias){
		let sum = -bias
		for (var i = input.length - 1; i >= 0; i--) {
			sum+=(input[i]*weights[i])
		}
		return sum
	}
	predict (input) {
		return this.activation(this.multiply(input,this.weights,this.biasWeight))
	}

	fowardPass(input,weight,bias){
		return activationTypeObj[this.activationType](this.multiply(input,weights,bias))
	}

	fit () {
		return new Promise((resolve)=>{
			for ( let e = 0; e < this.epochs; e++) { 
				this.x.forEach((input,i)=>{ 
					let prediction = this.predict(input) 
					this.y[i] === prediction ? this.acc += 1 : this.acc -= 1
					let loss = this.y[i] - prediction
					for (var p = this.weights.length - 1; p >= 0; p--) {
						this.weights[p]+=loss*input[p]*this.learn_rate
					}
					this.biasWeight -= loss * this.learn_rate
					this.samples++
				})

				console.log(this.accuracy(),e)

				if(1-this.accuracy()< this.error)
					break
			}
			console.log(this.weights,this.biasWeight)
			resolve()
		})
	}
}
let x = [[1, 1], [0, 1], [1, 0], [0, 0]]
let y = [1, 1, 1, 0]
let myPerceptron = new Perceptron(x, y, 50000, .01, 0.05)

myPerceptron.fit().then(()=>{
	console.log('vai',myPerceptron.predict([1,1]),myPerceptron.predict([0,0]))
})