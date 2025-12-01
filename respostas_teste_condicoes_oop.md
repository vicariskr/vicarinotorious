# Respostas do Teste - Condições e OOP

## Pergunta 1
**Pergunta:** Qual alternativa abaixo representa uma condição, para verificar se um número é par?

**⚠️ ATENÇÃO:** Não tenho acesso às imagens referenciadas (perg3_e.png, perg3_b.png, perg3_d.png, perg3_c.png, perg3_a.png).

**Resposta Esperada:** A alternativa que contém a condição correta para verificar se um número é par em Java seria algo como:

```java
if (numero % 2 == 0)
```

ou

```java
numero % 2 == 0
```

**Explicação:** Para verificar se um número é par, usamos o operador módulo (`%`). Se o resto da divisão por 2 for igual a 0, o número é par.

**Possíveis variações incorretas que podem aparecer:**
- `numero % 2 = 0` (erro: usa `=` em vez de `==`)
- `numero / 2 == 0` (errado: divisão não verifica paridade)
- `numero == 2` (errado: verifica se é igual a 2, não se é par)
- `numero % 2 != 0` (verifica se é ímpar, não par)

---

## Pergunta 2
**Pergunta:** QUESTÃO ANULADA!!

**Resposta:** Qualquer alternativa pode ser selecionada (A, B, C, D ou E).

**Nota:** Como a questão foi anulada, qualquer resposta atribuirá os pontos automaticamente.

---

## Pergunta 3
**Pergunta:** QUESTÃO ANULADA!!

**Resposta:** Qualquer alternativa pode ser selecionada (A, B, C, D ou E).

**Nota:** Como a questão foi anulada, qualquer resposta atribuirá os pontos automaticamente.

---

## Pergunta 4
**Pergunta:** Na programação orientada a objetos os atributos são criados com o tipo de acesso privado, para se ter acesso a esses atributos, são criados 2 métodos públicos SET e GET, essa afirmação é correta?

**Resposta Correta: Verdadeiro**

**Explicação:** 
Sim, essa afirmação está correta. Em programação orientada a objetos, o **encapsulamento** é um dos pilares fundamentais. A prática recomendada é:

1. **Atributos privados:** Os atributos de uma classe são declarados como `private` para proteger o acesso direto e manter a integridade dos dados.

2. **Métodos GET (getters):** Métodos públicos que permitem **ler** o valor de um atributo privado.
   ```java
   public String getNome() {
       return nome;
   }
   ```

3. **Métodos SET (setters):** Métodos públicos que permitem **modificar** o valor de um atributo privado, geralmente com validação.
   ```java
   public void setNome(String nome) {
       this.nome = nome;
   }
   ```

**Benefícios do encapsulamento:**
- Controle de acesso aos dados
- Possibilidade de validação antes de modificar valores
- Manutenção mais fácil do código
- Flexibilidade para mudar a implementação interna sem afetar outros códigos

**Exemplo completo:**
```java
public class Pessoa {
    private String nome;  // Atributo privado
    private int idade;    // Atributo privado
    
    // Método GET para nome
    public String getNome() {
        return nome;
    }
    
    // Método SET para nome
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    // Método GET para idade
    public int getIdade() {
        return idade;
    }
    
    // Método SET para idade (com validação)
    public void setIdade(int idade) {
        if (idade >= 0) {
            this.idade = idade;
        }
    }
}
```

---

## Resumo das Respostas

1. **Pergunta 1:** ⚠️ Precisa verificar as imagens - procurar por `numero % 2 == 0`
2. **Pergunta 2:** Qualquer alternativa (questão anulada)
3. **Pergunta 3:** Qualquer alternativa (questão anulada)
4. **Pergunta 4:** **Verdadeiro** ✅
