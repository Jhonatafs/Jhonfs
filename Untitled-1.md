## Avaliação de (f 2) com diferentes ordens

Vamos analisar o passo a passo da avaliação da expressão `(f 2)` com as ordens aplicativa, normal e preguiçosa, considerando a definição da função `f`:

```lisp
(define (f x)
  (+ x 3) (* 4 5))
```

### Ordem Aplicativa

1. **Avaliação dos argumentos:**
   - O argumento `2` é um valor primitivo, então não precisa ser avaliado.

2. **Aplicação da função `f`:**
   - Substitui `x` por `2` no corpo da função:
     ```lisp
     (+ 2 3) (* 4 5)
     ```

3. **Avaliação da expressão `(+ 2 3)`:**
   - Avalia `2` e `3`, que são valores primitivos.
   - Realiza a soma: `(+ 2 3)` resulta em `5`.

4. **Avaliação da expressão `(* 4 5)`:**
   - Avalia `4` e `5`, que são valores primitivos.
   - Realiza a multiplicação: `(* 4 5)` resulta em `20`.

5. **Resultado final:**
   - A função `f` retorna os resultados das duas expressões, que são avaliadas sequencialmente. Em algumas variantes de Lisp, isso pode ser interpretado como uma lista de resultados `(5 20)`. Em outras, o comportamento pode ser diferente, dependendo da implementação específica da linguagem.

### Ordem Normal

1. **Expansão da expressão:**
   - Substitui `x` por `2` no corpo da função, sem avaliar os argumentos:
     ```lisp
     (+ 2 3) (* 4 5)
     ```

2. **Avaliação da expressão `(+ 2 3)`:**
   - Avalia `2` e `3`, que são valores primitivos.
   - Realiza a soma: `(+ 2 3)` resulta em `5`.

3. **Avaliação da expressão `(* 4 5)`:**
   - Avalia `4` e `5`, que são valores primitivos.
   - Realiza a multiplicação: `(* 4 5)` resulta em `20`.

4. **Resultado final:**
   - Similar à ordem aplicativa, a função `f` retorna os resultados das duas expressões, possivelmente como uma lista `(5 20)`.

### Ordem Preguiçosa (Lazy Evaluation)

1. **Criação de promessas:**
   - Quando `(f 2)` é chamado, a ordem preguiçosa não avalia imediatamente os argumentos ou o corpo da função. Em vez disso, ela cria "promessas" para as expressões `(+ 2 3)` e `(* 4 5)`. Essas promessas contêm as expressões não avaliadas e o ambiente em que devem ser avaliadas.

2. **Avaliação sob demanda:**
   - Se o valor de `(+ 2 3)` for realmente necessário em algum momento posterior, a promessa correspondente será "forçada" a ser avaliada. Nesse momento, `2` e `3` serão avaliados e a soma será realizada. O resultado será armazenado na promessa para que não precise ser recalculado se for necessário novamente.

3. **Avaliação de `(* 4 5)`:**
   - O mesmo processo ocorre para a expressão `(* 4 5)`. Sua promessa é avaliada apenas quando seu valor é necessário.

4. **Resultado final:**
   - A função `f` retorna as promessas para as duas expressões. A avaliação real ocorre apenas quando os valores dessas expressões são requisitados por outras partes do programa.

### Observações

* A ordem preguiçosa é uma técnica poderosa para otimizar o desempenho de programas, adiando a avaliação de cálculos custosos até o último momento possível.
* A ordem aplicativa é a ordem de avaliação padrão na maioria das linguagens Lisp.
* A ordem normal é menos comum, mas pode ser útil em situações específicas, como quando se lida com estruturas de dados infinitas.

Espero que esta análise detalhada tenha sido útil! Se tiver mais perguntas, sinta-se à vontade para perguntar.
