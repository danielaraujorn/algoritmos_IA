class Perceptron{
	constructor (x, y, epochs=1000, learn_rate= 0.1, error=0) {

	// used to generate percent accuracy
	this.error=error
	this.acc = 0
	this.samples = 0
	this.x = x
	this.y = y

	this.epochs = epochs
	this.learn_rate = learn_rate

	this.bias = 0
	this.weights = new Array(x[0].length).fill(0).map(i=>(Math.random() * 2 - 1))
	
	}

	get accuracy () {
		return this.acc/this.samples
	}

	activation (n) {
		return n < 0 ? 0 : 1
	}
	predictNoActivation(input){
		return this.weights.reduce((a,b,i)=>a+b*input[i])+this.bias
	}
	predict (input) {
		return this.activation(this.weights.reduce((a,b,i)=>a+b*input[i])+this.bias)
	}

	fit (epocas) {
		return new Promise((resolve)=>{
			for ( let e = 0; e < this.epochs; e++) { 
				this.x.forEach((input,i)=>{ 
					let prediction = this.predict(input) 
					this.y[i] === prediction ? this.acc += 1 : this.acc -= 1
					let loss = this.y[i] - prediction
					this.weights=this.weights.map((item,w)=>item+(loss* input[w] * this.learn_rate))
					this.bias += loss * this.learn_rate
					this.samples++
				})

				// console.log(this.accuracy,e)

				if(1-this.accuracy<this.error)
					break
			}
			resolve()
		})
	}
}
let x = [[1, 1], [0, 1], [1, 0], [0, 0]]
let y = [1, 1, 1, 0]
let myPerceptron = new Perceptron(x, y, 10000, .1, 0.005)

myPerceptron.fit().then(()=>{
	console.log('vai',myPerceptron.predictNoActivation([1,0]),myPerceptron.predictNoActivation([0,1]))
})