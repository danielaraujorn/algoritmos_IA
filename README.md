# Algoritmos de inteligencia artificial

* [Single-Layer Perceptron](https://github.com/danielaraujorn/algoritmos_IA/)
* [Multi-Layer Perceptron](https://github.com/danielaraujorn/algoritmos_IA/tree/multilayer)

## Single Layer Perceptron, como funciona:
O funcionamento de uma rede neural de um neurônio só serve para classificar problemas lineares. Por exemplo, caso seja um problema de duas dimensões, deve ser possivel separar as amostrar por uma reta.
Digamos que estamos tentando treinar a rede neural para funcionar como a porta lógica AND, as amostras serão distribuídas como o gráfico a seguir:(colocar foto)
A rede neural então precisa aprender a traçar uma reta que definirá a classificação, uma das possíveis soluções seria a seguinte: (colocar foto)

#### Como funcionar?
Cada amostra de treinamento terá entradas e uma saída, mas para treinar para mais casos é necessário ter vários conjuntos de amostras. Vou mostrar um exemplo da porta lógica AND:
```js
//entrada_das_amostras é um array em que cada item
//é uma amostra de entrada para o treinamento
const entrada_das_amostras=[[1,1],[1,0],[0,1],[0,0]]

//saida_das_amostras é um array em que para cada elemento do array entrada_das_amostras,
//diz como o elemento deve ser classificado
const saida_das_amostras=[1,0,0,0]
```
ou seja, para a entrada [1,1] a rede neural deve resultar em 1, para [1,0], [0,1] ou [0,0] a rede neural deve resultar em 0.


## Multi Layer Perceptron, como funciona:
