# Respostas do Teste de Java

## Pergunta 1
**Pergunta:** Qual o tipo de retorno que indica que um método em Java não retornará nenhum valor é:

**Resposta Correta: Opção C - void**

**Explicação:** Em Java, `void` é a palavra-chave que indica que um método não retorna nenhum valor. As outras opções são incorretas:
- `int` retorna um valor inteiro
- `public`, `private`, `protected` são modificadores de acesso, não tipos de retorno

---

## Pergunta 2
**Pergunta:** O trecho de código abaixo deve estar dentro de um arquivo de nome:

```java
public class TestarCarro {
    public static void main(String args[]) {
        Carro c1 = new Carro();
        c1.motor = "1.8";
        c1.modelo = "Ecosport";
    }
}
```

**Resposta Correta: Opção E - TestarCarro.java**

**Explicação:** Em Java, quando uma classe é declarada como `public`, o nome do arquivo deve corresponder exatamente ao nome da classe. Como a classe se chama `TestarCarro`, o arquivo deve ser `TestarCarro.java` (respeitando maiúsculas e minúsculas).

---

## Pergunta 3
**Pergunta:** Conforme a regra para a criação de nomes para métodos em Java, qual a opção está correta.

**Resposta Correta: Opção D - imprimeValorFuncionario**

**Explicação:** Em Java, os nomes de métodos seguem a convenção camelCase, começando sempre com letra minúscula. Cada palavra subsequente começa com maiúscula. Portanto:
- ❌ `ImprimeValorfuncionario` - começa com maiúscula
- ❌ `Imprimevalrofuncionario` - começa com maiúscula e tem erro de digitação
- ❌ `ImprimeValorFuncionario` - começa com maiúscula (parece nome de classe)
- ✅ `imprimeValorFuncionario` - correto (camelCase)
- ❌ `imprimevalorfuncionario` - todas minúsculas (não segue camelCase)

---

## Pergunta 4
**Pergunta:** O Java fornece dois tipos primitivos para armazenar números de pontos flutuantes na memória, quais são eles?

i) int  
ii) float  
iii) String  
iv) double  
v) char

**Resposta Correta: Opção D - Somente a II e IV estão corretas**

**Explicação:** Os tipos primitivos de ponto flutuante em Java são:
- `float` (32 bits) - Opção II ✅
- `double` (64 bits) - Opção IV ✅

As outras opções são incorretas:
- `int` é um tipo primitivo inteiro
- `String` não é um tipo primitivo (é uma classe)
- `char` é um tipo primitivo para caracteres

---

## Resumo das Respostas

1. **Pergunta 1:** Opção C - void
2. **Pergunta 2:** Opção E - TestarCarro.java
3. **Pergunta 3:** Opção D - imprimeValorFuncionario
4. **Pergunta 4:** Opção D - Somente a II e IV estão corretas
