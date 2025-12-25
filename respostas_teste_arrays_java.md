# Respostas do Teste sobre Arrays em Java

## Pergunta 1
**Pergunta:** Assinale a alternativa correta sobre a declaração de um array. Considere um array de nome "vlr1", do tipo inteiro e com 12 posições.

**Resposta Correta: Opção A - `Int [] vlr1 = new int[12 ];`**

**Explicação:** Em Java, a sintaxe correta para declarar um array é:
```java
int[] nome = new int[tamanho];
```
ou
```java
int nome[] = new int[tamanho];
```

A Opção A segue a sintaxe correta, apenas com "Int" maiúsculo (que provavelmente é um erro de digitação, mas a estrutura está correta). As outras opções têm erros de sintaxe:
- Opção B: Falta o operador `new`
- Opção C: Não se coloca o tamanho antes do nome do array
- Opção D: Não se coloca o tamanho antes do nome e falta o tamanho no `new int[]`
- Opção E: Sintaxe completamente incorreta

---

## Pergunta 2
**Pergunta:** Deseja-se criar um programa com 4 variáveis do tipo inteiro, essas variáveis devem ser criadas para o controle das idades. Qual a forma correta para criar uma única variável e realizar esse controle?

**Resposta Correta: Opção B - `int idade[] = int[4];`** (mais próxima, mas ainda com erro)

**Explicação:** A sintaxe correta seria: `int idade[] = new int[4];` ou `int[] idade = new int[4];`

Analisando as opções:
- Opção A: `idade[] = int[4];` - Falta o tipo `int` antes do nome e falta `new`
- Opção B: `int idade[] = int[4];` - Falta o `new` antes de `int[4]`
- Opção C: `idade = int[4];` - Falta o tipo e `new`
- Opção D: `idade[] = {'1','2','3','4'};` - Usa char ao invés de int e sintaxe incorreta
- Opção E: `int idade[4] = int;` - Sintaxe incorreta

**Nota:** Nenhuma opção está completamente correta, mas a Opção B é a mais próxima da sintaxe correta (apenas falta o `new`).

---

## Pergunta 3
**Pergunta:** Analise as afirmativas abaixo e assinale a alternativa correta.

I. Os arrays são estruturas de dados que consistem em itens de dados de qualquer tipo.  
II. Os arrays são entidades estáticas, pois, uma vez criadas, permanecem do mesmo tamanho.  
III. O índice do primeiro elemento de um array é sempre um.

**Resposta Correta: Opção A - Somente a afirmativa II está correta.**

**Explicação:**
- **Afirmativa I - FALSA:** Arrays em Java são homogêneos, ou seja, todos os elementos devem ser do mesmo tipo. Não podem conter "itens de dados de qualquer tipo".
- **Afirmativa II - VERDADEIRA:** Arrays em Java têm tamanho fixo. Uma vez criado com um determinado tamanho, esse tamanho não pode ser alterado. Para "redimensionar", é necessário criar um novo array.
- **Afirmativa III - FALSA:** Em Java, os arrays são indexados a partir de zero (0), não de um (1). O primeiro elemento está no índice 0.

---

## Pergunta 4
**Pergunta:** A imagem representa uma variável array de nome idades. Qual a sintaxe de atribuição que corresponde à imagem?

**Resposta Correta: Opção C - `Idades[3] = 10`**

**Explicação:** Baseado na descrição da imagem (que mostra um array com 7 posições, onde a posição 3 contém o valor 10), a sintaxe correta para atribuir o valor 10 à posição 3 do array é:
```java
idades[3] = 10;
```

Em Java, os arrays são indexados a partir de 0, então:
- `idades[0]` = primeira posição
- `idades[1]` = segunda posição
- `idades[2]` = terceira posição
- `idades[3]` = quarta posição (onde está o valor 10 na imagem)

---

## Resumo das Respostas

1. **Pergunta 1:** Opção A - `Int [] vlr1 = new int[12 ];`
2. **Pergunta 2:** Opção B - `int idade[] = int[4];` (mais próxima, mas nenhuma está completamente correta)
3. **Pergunta 3:** Opção A - Somente a afirmativa II está correta
4. **Pergunta 4:** Opção C - `Idades[3] = 10`
