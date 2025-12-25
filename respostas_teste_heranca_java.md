# Respostas do Teste sobre Herança em Java

## Pergunta 1
**Pergunta:** Pode um objeto ser uma subclasse de outro objeto?

**Resposta Correta: Opção A - Não, herança ocorre apenas entre as classes.**

**Explicação:** 
- **Herança** é um relacionamento entre **classes**, não entre objetos.
- **Objetos** são **instâncias** de classes criadas em tempo de execução.
- A herança define a relação hierárquica entre classes (superclasse e subclasse).
- Objetos não podem ser subclasses de outros objetos, pois objetos são instâncias concretas, não definições.

Exemplo:
```java
class Animal { }  // Classe (superclasse)
class Cachorro extends Animal { }  // Classe (subclasse)
Cachorro meuCachorro = new Cachorro();  // Objeto (instância)
```

---

## Pergunta 2
**Pergunta:** Qual o tipo de herança do Java?

**Resposta Correta: Opção B - herança única**

**Explicação:**
- Java suporta apenas **herança simples (single inheritance)**.
- Uma classe em Java pode estender apenas **uma** superclasse diretamente.
- Java não suporta herança múltipla (múltiplas superclasses) para evitar problemas como o "diamond problem".
- Para simular herança múltipla, Java usa **interfaces**, que permitem que uma classe implemente múltiplas interfaces.

Exemplo:
```java
class Animal { }  // Superclasse
class Cachorro extends Animal { }  // Herança única - OK
// class Cachorro extends Animal, Mamifero { }  // ERRO - herança múltipla não permitida
```

---

## Pergunta 3
**Pergunta:** Digamos que existem três classes: Computador, AppleComputer e IBMComputer. Quais são as relações possíveis entre essas classes?

**Resposta Correta: Opção C - Computador é a superclasse, AppleComputer e IBMComputer são subclasses de Computador.**

**Explicação:**
- **Computador** é a classe genérica/base (superclasse) que define características comuns a todos os computadores.
- **AppleComputer** e **IBMComputer** são classes específicas (subclasses) que herdam de Computador e adicionam características próprias de cada marca.
- Esta é uma relação de **generalização/especialização** típica em orientação a objetos.

Estrutura:
```
        Computador (superclasse)
           /    \
          /      \
AppleComputer  IBMComputer (subclasses)
```

As outras opções estão incorretas:
- Opção A: IBMComputer não seria superclasse de Computador (relação invertida)
- Opção B: Não são classes irmãs, há uma hierarquia
- Opção D: IBMComputer não é subclasse de AppleComputer (são irmãs)
- Opção E: Não faz sentido todas serem superclasses

---

## Pergunta 4
**Pergunta:** Quantos objetos de uma determinada classe pode ser utilizada em um programa?

**Resposta Correta: Opção D - Quantas forem necessárias, depende da necessidade do programa.**

**Explicação:**
- Não há limite para o número de objetos que podem ser criados a partir de uma classe.
- Você pode criar **quantos objetos forem necessários** para atender às necessidades do programa.
- A quantidade de objetos depende da lógica e requisitos da aplicação.
- Cada objeto é uma instância independente da classe, ocupando seu próprio espaço na memória.

Exemplo:
```java
class Carro { }
// Pode criar quantos objetos quiser:
Carro carro1 = new Carro();
Carro carro2 = new Carro();
Carro carro3 = new Carro();
// ... e assim por diante, sem limite
```

As outras opções estão incorretas:
- Opção A: Não há limite de "um por construtor"
- Opção B: Não há limite de "um por método main()"
- Opção C: Não há limite de "um por classe definida"
- Opção E: Não há limite fixo de dois objetos

---

## Resumo das Respostas

1. **Pergunta 1:** Opção A - Não, herança ocorre apenas entre as classes
2. **Pergunta 2:** Opção B - herança única
3. **Pergunta 3:** Opção C - Computador é a superclasse, AppleComputer e IBMComputer são subclasses de Computador
4. **Pergunta 4:** Opção D - Quantas forem necessárias, depende da necessidade do programa
