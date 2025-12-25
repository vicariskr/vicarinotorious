# Respostas do Teste sobre POO Avançado

## Pergunta 1
**Pergunta:** Um comando "abrir" ao provocar diferentes ações em objetos distintos, por exemplo: em uma caixa, porta ou janela, representa figurativamente na orientação a objetos o princípio denominado:

**Resposta Correta: Opção A - Polimorfismo**

**Explicação:**
- **Polimorfismo** é a capacidade de um mesmo método/comando ter comportamentos diferentes dependendo do objeto que o executa.
- No exemplo dado, o comando "abrir" tem comportamentos distintos:
  - Abrir uma **caixa** → levantar a tampa
  - Abrir uma **porta** → girar a maçaneta e empurrar
  - Abrir uma **janela** → deslizar ou empurrar
- Todos respondem ao mesmo comando "abrir", mas cada um executa de forma diferente.
- Isso é o princípio de **polimorfismo**: "uma interface, múltiplas implementações".

As outras opções não se aplicam:
- **Encapsulamento**: ocultação de detalhes internos
- **Herança**: relação de especialização entre classes
- **Classe**: definição/template de objetos
- **Construtor**: método especial para inicializar objetos

---

## Pergunta 2
**Pergunta:** Assinale a alternativa falsa a respeito de classes abstratas:

**Resposta Correta: Opção E - Pode conter apenas métodos estáticos, ou seja, métodos que não possuam corpo e apenas a assinatura**

**Explicação:**
A Opção E está **FALSA** porque:
- Classes abstratas **podem conter**:
  - Métodos **abstratos** (sem corpo, apenas assinatura) ✅
  - Métodos **concretos** (com corpo/implementação) ✅
  - Métodos **estáticos** (com ou sem corpo) ✅
  - Atributos e construtores ✅
- A descrição está incorreta ao dizer "apenas métodos estáticos" e confunde conceitos (métodos estáticos podem ter corpo).

As outras opções estão **CORRETAS**:
- **Opção A:** Classes abstratas são mais genéricas no modelo hierárquico ✅
- **Opção B:** Podem ter subclasses também abstratas ✅
- **Opção C:** Obrigam subclasses concretas a implementar métodos abstratos ✅
- **Opção D:** Não permitem instanciação direta (são abstratas) ✅

Exemplo:
```java
abstract class Animal {
    // Método abstrato (sem corpo)
    abstract void fazerSom();
    
    // Método concreto (com corpo)
    void dormir() {
        System.out.println("Dormindo...");
    }
    
    // Método estático (com corpo)
    static void info() {
        System.out.println("Classe Animal");
    }
}
```

---

## Pergunta 3
**Pergunta:** Analise a figura a seguir e determine qual mecanismo está sendo representado no contexto de programação orientada a objetos

**Resposta Correta: Opção D - Encapsulamento**

**Explicação:**
Sem poder visualizar a imagem diretamente, mas baseado no contexto típico de questões sobre POO:
- Se a figura mostra algo como "dados privados" protegidos por uma "cápsula" ou "interface pública", representa **Encapsulamento**.
- **Encapsulamento** é o princípio que oculta os detalhes internos de implementação e expõe apenas uma interface pública controlada.
- Geralmente representado visualmente como dados internos protegidos por uma barreira, com acesso controlado através de métodos públicos.

As outras opções:
- **Polimorfismo**: seria representado por múltiplas formas do mesmo método
- **Herança Múltipla**: seria uma hierarquia complexa (não existe em Java)
- **Sobrecarga**: seria múltiplos métodos com mesmo nome mas parâmetros diferentes

**Nota:** Como não posso ver a imagem, a resposta mais provável é **Encapsulamento**, que é frequentemente representado visualmente em diagramas de POO.

---

## Pergunta 4
**Pergunta:** QUESTÃO ANULADA - Escolhe a alternativa incorreta sobre interfaces

**Resposta:** Como a questão foi anulada, qualquer alternativa pode ser selecionada para receber os pontos automaticamente.

**Análise das opções (para conhecimento):**
- **Opção A:** "Uma interface possui apenas métodos ocos, não podendo possuir métodos com corpo e apenas a sua assinatura"
  - **Parcialmente correta** - Interfaces tradicionais (antes do Java 8) só tinham métodos abstratos. A partir do Java 8, interfaces podem ter métodos default e static com corpo.
  
- **Opção B:** "Uma classe pode implementar uma ou várias interfaces ao mesmo tempo"
  - **CORRETA** ✅ - Java permite implementar múltiplas interfaces.

- **Opção C:** "Uma interface é o mecanismo que simula uma herança múltipla em linguagens que não possuem esse tipo de herança"
  - **CORRETA** ✅ - Interfaces permitem simular herança múltipla em Java.

- **Opção D:** "Uma interface pode possuir apenas constantes e não podem ter atributos"
  - **Parcialmente correta** - Interfaces podem ter constantes (public static final) implicitamente, mas não podem ter atributos de instância.

---

## Resumo das Respostas

1. **Pergunta 1:** Opção A - Polimorfismo
2. **Pergunta 2:** Opção E - Pode conter apenas métodos estáticos... (FALSA)
3. **Pergunta 3:** Opção D - Encapsulamento
4. **Pergunta 4:** Qualquer alternativa (questão anulada)
