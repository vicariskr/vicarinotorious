/**
 * Script para comparar saldos entre duas tabelas no Google Sheets
 * Tabela Esquerda (Dia 1): Colunas A:E
 * Tabela Direita (Dia 2): Colunas G:K
 * Resultado: Aba "Resultado"
 * Cadastro de UGs: Aba "UGs" (UG, Nome, Abreviação)
 * Mensagens: Aba "Mensagens" (cobranças para UGs com entesouramento)
 * 
 * Versão 5.1 - Com geração de mensagens de cobrança (limpeza completa da aba)
 */

/**
 * Função principal para comparar saldos entre as duas tabelas
 * Identifica quais saldos do Dia 1 ainda permanecem no Dia 2
 */
function compararSaldos() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaDados = planilha.getSheetByName("Dados");
  
  if (!abaDados) {
    SpreadsheetApp.getUi().alert("❌ Erro: Aba 'Dados' não encontrada!");
    return;
  }
  
  // Carregar dados das UGs (código, nome, abreviação)
  var dadosUGs = carregarDadosUGs();
  
  // Criar ou limpar aba "Resultado" ANTES de tudo
  var abaResultado = planilha.getSheetByName("Resultado");
  if (!abaResultado) {
    abaResultado = planilha.insertSheet("Resultado");
  } else {
    abaResultado.clear();
    abaResultado.clearFormats();
    abaResultado.clearConditionalFormatRules();
  }
  
  // Obter dados da tabela da esquerda (Dia 1) - Colunas A:E
  var ultimaLinhaDia1 = obterUltimaLinhaColuna(abaDados, 1);
  var dadosDia1 = abaDados.getRange(2, 1, ultimaLinhaDia1 - 1, 5).getValues();
  
  // Obter dados da tabela da direita (Dia 2) - Colunas G:K
  var ultimaLinhaDia2 = obterUltimaLinhaColuna(abaDados, 7);
  var dadosDia2 = abaDados.getRange(2, 7, ultimaLinhaDia2 - 1, 5).getValues();
  
  // Criar um mapa com os dados do Dia 2 para busca rápida
  var mapaDia2 = {};
  for (var i = 0; i < dadosDia2.length; i++) {
    var linha = dadosDia2[i];
    var ugExecutora = String(linha[0]).trim();
    var contaContabil = String(linha[1]).trim();
    var contaCorrente = String(linha[2]).trim();
    var vinculacao = String(linha[3]).trim();
    var saldo = linha[4];
    
    // Ignorar linhas vazias
    if (ugExecutora === "" || ugExecutora === "undefined") continue;
    
    var chave = ugExecutora + "|" + contaContabil + "|" + contaCorrente + "|" + vinculacao;
    mapaDia2[chave] = {
      saldo: saldo,
      ugExecutora: ugExecutora,
      contaContabil: contaContabil,
      contaCorrente: contaCorrente,
      vinculacao: vinculacao
    };
  }
  
  // Comparar dados do Dia 1 com Dia 2 e agrupar por UG Executora
  var resultadosPorUG = {};
  
  for (var j = 0; j < dadosDia1.length; j++) {
    var linhaDia1 = dadosDia1[j];
    var ugExec = String(linhaDia1[0]).trim();
    var contaCont = String(linhaDia1[1]).trim();
    var contaCorr = String(linhaDia1[2]).trim();
    var vincPag = String(linhaDia1[3]).trim();
    var saldoDia1 = converterParaNumero(linhaDia1[4]);
    
    // Ignorar linhas vazias
    if (ugExec === "" || ugExec === "undefined") continue;
    
    var chaveBusca = ugExec + "|" + contaCont + "|" + contaCorr + "|" + vincPag;
    
    var saldoDia2 = 0;
    var status = "";
    
    if (mapaDia2.hasOwnProperty(chaveBusca)) {
      saldoDia2 = converterParaNumero(mapaDia2[chaveBusca].saldo);
      
      if (saldoDia1 === saldoDia2) {
        status = "Permanece igual";
      } else if (saldoDia2 > saldoDia1) {
        status = "Aumentou";
      } else {
        status = "Diminuiu";
      }
    } else {
      status = "Removido no Dia 2";
    }
    
    var diferenca = saldoDia2 - saldoDia1;
    
    // Agrupar por UG Executora
    if (!resultadosPorUG[ugExec]) {
      resultadosPorUG[ugExec] = [];
    }
    
    resultadosPorUG[ugExec].push({
      ugExecutora: ugExec,
      contaContabil: contaCont,
      contaCorrente: contaCorr,
      vinculacao: vincPag,
      saldoDia1: saldoDia1,
      saldoDia2: saldoDia2,
      diferenca: diferenca,
      status: status
    });
  }
  
  // Verificar registros novos no Dia 2 (não existiam no Dia 1)
  var mapaDia1 = {};
  for (var k = 0; k < dadosDia1.length; k++) {
    var ld1 = dadosDia1[k];
    var chaveD1 = String(ld1[0]).trim() + "|" + String(ld1[1]).trim() + "|" + 
                  String(ld1[2]).trim() + "|" + String(ld1[3]).trim();
    mapaDia1[chaveD1] = true;
  }
  
  for (var chaveD2 in mapaDia2) {
    if (!mapaDia1.hasOwnProperty(chaveD2)) {
      var dadosNovos = mapaDia2[chaveD2];
      var saldoNovo = converterParaNumero(dadosNovos.saldo);
      var ugNova = dadosNovos.ugExecutora;
      
      if (!resultadosPorUG[ugNova]) {
        resultadosPorUG[ugNova] = [];
      }
      
      resultadosPorUG[ugNova].push({
        ugExecutora: ugNova,
        contaContabil: dadosNovos.contaContabil,
        contaCorrente: dadosNovos.contaCorrente,
        vinculacao: dadosNovos.vinculacao,
        saldoDia1: 0,
        saldoDia2: saldoNovo,
        diferenca: saldoNovo,
        status: "Novo no Dia 2"
      });
    }
  }
  
  // Ordenar UGs
  var ugsOrdenadas = Object.keys(resultadosPorUG).sort();
  
  // Montar dados para a planilha com separação por UG
  var linhaAtual = 1;
  var numColunas = 8;
  
  // Título principal
  abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
  abaResultado.getRange(linhaAtual, 1).setValue("RELATÓRIO DE COMPARAÇÃO DE SALDOS");
  formatarTituloPrincipal(abaResultado, linhaAtual, numColunas);
  linhaAtual++;
  
  // Subtítulo com data
  abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
  abaResultado.getRange(linhaAtual, 1).setValue("Gerado em: " + formatarData(new Date()));
  formatarSubtitulo(abaResultado, linhaAtual, numColunas);
  linhaAtual++;
  
  // Linha em branco
  linhaAtual++;
  
  var totalRegistros = 0;
  var linhasStatus = []; // Para armazenar linhas e seus status para colorir depois
  
  // Para cada UG Executora
  for (var u = 0; u < ugsOrdenadas.length; u++) {
    var ug = ugsOrdenadas[u];
    var registrosUG = resultadosPorUG[ug];
    
    // Obter dados da UG (nome e abreviação)
    var infoUG = dadosUGs[ug] || {nome: "Não cadastrada", abreviacao: "N/C"};
    
    // Calcular totais da UG
    var totalDia1UG = 0;
    var totalDia2UG = 0;
    for (var t = 0; t < registrosUG.length; t++) {
      totalDia1UG += registrosUG[t].saldoDia1;
      totalDia2UG += registrosUG[t].saldoDia2;
    }
    
    // Cabeçalho da UG com nome completo e abreviação
    abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
    abaResultado.getRange(linhaAtual, 1).setValue("UG " + ug + " - " + infoUG.nome + " (" + infoUG.abreviacao + ")");
    formatarCabecalhoUG(abaResultado, linhaAtual, numColunas);
    linhaAtual++;
    
    // Cabeçalho das colunas
    var cabecalho = [
      "UG Executora",
      "Conta Contábil", 
      "Conta Corrente",
      "Vinculação",
      "Saldo Dia 1 (R$)",
      "Saldo Dia 2 (R$)",
      "Diferença (R$)",
      "Status"
    ];
    abaResultado.getRange(linhaAtual, 1, 1, numColunas).setValues([cabecalho]);
    formatarCabecalhoColunas(abaResultado, linhaAtual, numColunas);
    linhaAtual++;
    
    // Dados da UG
    var linhaInicioGrupo = linhaAtual;
    for (var r = 0; r < registrosUG.length; r++) {
      var reg = registrosUG[r];
      abaResultado.getRange(linhaAtual, 1, 1, numColunas).setValues([[
        reg.ugExecutora,
        reg.contaContabil,
        reg.contaCorrente,
        reg.vinculacao,
        reg.saldoDia1,
        reg.saldoDia2,
        reg.diferenca,
        reg.status
      ]]);
      
      // Armazenar linha e status para colorir depois
      linhasStatus.push({linha: linhaAtual, status: reg.status});
      
      linhaAtual++;
      totalRegistros++;
    }
    var linhaFimGrupo = linhaAtual - 1;
    
    // Formatar dados do grupo
    formatarDadosGrupo(abaResultado, linhaInicioGrupo, linhaFimGrupo, numColunas);
    
    // Linha de subtotal da UG (usando abreviação)
    abaResultado.getRange(linhaAtual, 1, 1, 4).merge();
    abaResultado.getRange(linhaAtual, 1).setValue("SUBTOTAL " + infoUG.abreviacao);
    abaResultado.getRange(linhaAtual, 5).setValue(totalDia1UG);
    abaResultado.getRange(linhaAtual, 6).setValue(totalDia2UG);
    abaResultado.getRange(linhaAtual, 7).setValue(totalDia2UG - totalDia1UG);
    abaResultado.getRange(linhaAtual, 8).setValue(registrosUG.length + " reg.");
    formatarSubtotal(abaResultado, linhaAtual, numColunas);
    linhaAtual++;
    
    // Linha separadora entre UGs (se não for a última)
    if (u < ugsOrdenadas.length - 1) {
      abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
      abaResultado.getRange(linhaAtual, 1, 1, numColunas).setBackground("#000000");
      abaResultado.setRowHeight(linhaAtual, 5);
      linhaAtual++;
      
      // Espaço em branco
      linhaAtual++;
    }
  }
  
  // Linha separadora final
  linhaAtual++;
  abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
  abaResultado.getRange(linhaAtual, 1, 1, numColunas).setBackground("#000000");
  abaResultado.setRowHeight(linhaAtual, 3);
  linhaAtual++;
  
  // Resumo final
  linhaAtual++;
  abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
  abaResultado.getRange(linhaAtual, 1).setValue("RESUMO GERAL");
  formatarTituloResumo(abaResultado, linhaAtual, numColunas);
  linhaAtual++;
  
  // Estatísticas
  var estatisticas = calcularEstatisticas(resultadosPorUG);
  
  var dadosResumo = [
    ["Total de UGs analisadas:", ugsOrdenadas.length],
    ["Total de registros:", totalRegistros],
    ["Saldos que permanecem iguais:", estatisticas.iguais],
    ["Saldos que aumentaram:", estatisticas.aumentaram],
    ["Saldos que diminuíram:", estatisticas.diminuiram],
    ["Saldos removidos no Dia 2:", estatisticas.removidos],
    ["Saldos novos no Dia 2:", estatisticas.novos]
  ];
  
  for (var s = 0; s < dadosResumo.length; s++) {
    abaResultado.getRange(linhaAtual, 1, 1, 3).merge();
    abaResultado.getRange(linhaAtual, 1).setValue(dadosResumo[s][0]);
    abaResultado.getRange(linhaAtual, 4).setValue(dadosResumo[s][1]);
    formatarLinhaResumo(abaResultado, linhaAtual, s % 2 === 0);
    linhaAtual++;
  }
  
  // Aplicar cores nas células de status
  aplicarCoresStatus(abaResultado, linhasStatus);
  
  // Ajustar largura das colunas
  abaResultado.setColumnWidth(1, 120);  // UG Executora
  abaResultado.setColumnWidth(2, 120);  // Conta Contábil
  abaResultado.setColumnWidth(3, 150);  // Conta Corrente
  abaResultado.setColumnWidth(4, 100);  // Vinculação
  abaResultado.setColumnWidth(5, 140);  // Saldo Dia 1
  abaResultado.setColumnWidth(6, 140);  // Saldo Dia 2
  abaResultado.setColumnWidth(7, 130);  // Diferença
  abaResultado.setColumnWidth(8, 140);  // Status
  
  // Congelar primeira linha (título)
  abaResultado.setFrozenRows(3);
  
  SpreadsheetApp.getUi().alert(
    "✅ Comparação concluída!\n\n" +
    "📊 Total de UGs: " + ugsOrdenadas.length + "\n" +
    "📋 Total de registros: " + totalRegistros + "\n\n" +
    "Resultados salvos na aba 'Resultado'."
  );
}

/**
 * Gera mensagens de cobrança para UGs com entesouramento
 * (saldos que permanecem iguais ou aumentaram)
 */
function gerarMensagensCobranca() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaResultado = planilha.getSheetByName("Resultado");
  
  if (!abaResultado) {
    SpreadsheetApp.getUi().alert("⚠️ Execute primeiro a comparação de saldos!");
    return;
  }
  
  // Carregar dados das UGs
  var dadosUGs = carregarDadosUGs();
  
  // Ler dados do resultado
  var dados = abaResultado.getDataRange().getValues();
  
  // Filtrar saldos com entesouramento (permanece igual ou aumentou)
  var entesouramentoPorUG = {};
  
  for (var i = 0; i < dados.length; i++) {
    var linha = dados[i];
    var status = linha[7];
    
    // Verificar se é uma linha de dados com entesouramento
    if (status === "Permanece igual" || status === "Aumentou") {
      var ugExecutora = String(linha[0]).trim();
      var contaContabil = String(linha[1]).trim();
      var contaCorrente = String(linha[2]).trim();
      var vinculacao = String(linha[3]).trim();
      var saldoDia2 = linha[5]; // Saldo atual (Dia 2)
      
      if (!entesouramentoPorUG[ugExecutora]) {
        entesouramentoPorUG[ugExecutora] = [];
      }
      
      entesouramentoPorUG[ugExecutora].push({
        contaContabil: contaContabil,
        contaCorrente: contaCorrente,
        vinculacao: vinculacao,
        saldo: saldoDia2,
        status: status
      });
    }
  }
  
  var ugsComEntesouramento = Object.keys(entesouramentoPorUG).sort();
  
  if (ugsComEntesouramento.length === 0) {
    SpreadsheetApp.getUi().alert("✅ Nenhuma UG com entesouramento encontrada!\n\nTodas as UGs regularizaram seus saldos.");
    return;
  }
  
  // Criar ou limpar aba "Mensagens" ANTES de tudo (igual faz com Resultado)
  var abaMensagens = planilha.getSheetByName("Mensagens");
  if (!abaMensagens) {
    abaMensagens = planilha.insertSheet("Mensagens");
  } else {
    abaMensagens.clear();
    abaMensagens.clearFormats();
    abaMensagens.clearConditionalFormatRules();
  }
  
  // Data atual
  var dataAtual = new Date();
  var diaAtual = String(dataAtual.getDate()).padStart(2, '0');
  var meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", 
               "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var mesAtual = meses[dataAtual.getMonth()];
  var anoAtual = dataAtual.getFullYear();
  var dataFormatada = diaAtual + " de " + mesAtual + " de " + anoAtual;
  
  // Configurar largura da coluna
  abaMensagens.setColumnWidth(1, 800);
  
  var linhaAtual = 1;
  var numeroMensagem = 1;
  
  // Título da aba
  abaMensagens.getRange(linhaAtual, 1).setValue("MENSAGENS DE COBRANÇA - ENTESOURAMENTO");
  abaMensagens.getRange(linhaAtual, 1).setFontSize(16);
  abaMensagens.getRange(linhaAtual, 1).setFontWeight("bold");
  abaMensagens.getRange(linhaAtual, 1).setBackground("#1a237e");
  abaMensagens.getRange(linhaAtual, 1).setFontColor("#ffffff");
  abaMensagens.getRange(linhaAtual, 1).setHorizontalAlignment("center");
  linhaAtual++;
  
  abaMensagens.getRange(linhaAtual, 1).setValue("Gerado em: " + formatarData(new Date()) + " | Total de UGs: " + ugsComEntesouramento.length);
  abaMensagens.getRange(linhaAtual, 1).setFontSize(10);
  abaMensagens.getRange(linhaAtual, 1).setFontStyle("italic");
  abaMensagens.getRange(linhaAtual, 1).setBackground("#283593");
  abaMensagens.getRange(linhaAtual, 1).setFontColor("#ffffff");
  abaMensagens.getRange(linhaAtual, 1).setHorizontalAlignment("center");
  linhaAtual++;
  
  linhaAtual++; // Linha em branco
  
  // Gerar mensagem para cada UG
  for (var u = 0; u < ugsComEntesouramento.length; u++) {
    var ug = ugsComEntesouramento[u];
    var registros = entesouramentoPorUG[ug];
    var infoUG = dadosUGs[ug] || {nome: "Não cadastrada", abreviacao: ug};
    
    // Agrupar por conta contábil
    var porContaContabil = {};
    for (var r = 0; r < registros.length; r++) {
      var reg = registros[r];
      if (!porContaContabil[reg.contaContabil]) {
        porContaContabil[reg.contaContabil] = [];
      }
      porContaContabil[reg.contaContabil].push(reg);
    }
    
    // Cabeçalho da UG
    abaMensagens.getRange(linhaAtual, 1).setValue("═══════════════════════════════════════════════════════════════════════════════");
    abaMensagens.getRange(linhaAtual, 1).setFontFamily("Courier New");
    linhaAtual++;
    
    abaMensagens.getRange(linhaAtual, 1).setValue("UG " + ug + " - " + infoUG.abreviacao);
    abaMensagens.getRange(linhaAtual, 1).setFontWeight("bold");
    abaMensagens.getRange(linhaAtual, 1).setFontSize(12);
    abaMensagens.getRange(linhaAtual, 1).setBackground("#37474f");
    abaMensagens.getRange(linhaAtual, 1).setFontColor("#ffffff");
    linhaAtual++;
    
    abaMensagens.getRange(linhaAtual, 1).setValue("═══════════════════════════════════════════════════════════════════════════════");
    abaMensagens.getRange(linhaAtual, 1).setFontFamily("Courier New");
    linhaAtual++;
    
    linhaAtual++; // Espaço
    
    // Montar mensagem
    var mensagem = "";
    
    // Assunto
    mensagem += "Assunto: " + infoUG.abreviacao + " - Entesouramento - Urgente\n\n";
    
    // Cabeçalho da mensagem
    mensagem += "Msg Nr " + String(numeroMensagem).padStart(3, '0') + " - S CONT " + ug + "\n\n";
    
    mensagem += "Ao Sr OD " + infoUG.abreviacao + "\n\n";
    
    mensagem += "Rfr: Caderno de Orientação aos Agentes da Administração - Gestão dos Recursos Financeiros\n\n\n";
    
    // Parágrafo 1
    mensagem += "1. Após análise realizada no balancete, em " + dataFormatada + ", foi verificado que essa UGA apresenta saldos nas contas contábeis Limite de Saque com Vinculação de Pagamento, conforme discriminado abaixo:\n\n";
    
    // Para cada conta contábil
    for (var contaContabil in porContaContabil) {
      var registrosConta = porContaContabil[contaContabil];
      
      // Nome da conta contábil
      var nomeContaContabil = obterNomeContaContabil(contaContabil);
      mensagem += "\n   CONTA CONTÁBIL: " + contaContabil + " - " + nomeContaContabil + "\n\n";
      
      // Cabeçalho da tabela
      mensagem += "        UG          FONTE/VINCULAÇÃO              VALOR R$\n";
      mensagem += "   ─────────────────────────────────────────────────────────────\n";
      
      // Dados
      var totalConta = 0;
      for (var c = 0; c < registrosConta.length; c++) {
        var item = registrosConta[c];
        var valorFormatado = formatarMoeda(item.saldo);
        mensagem += "      " + ug + "       " + item.contaCorrente + "         " + valorFormatado + "\n";
        totalConta += converterParaNumero(item.saldo);
      }
      
      // Total da conta
      if (registrosConta.length > 1) {
        mensagem += "   ─────────────────────────────────────────────────────────────\n";
        mensagem += "      TOTAL:                                      " + formatarMoeda(totalConta) + "\n";
      }
    }
    
    mensagem += "\n\n";
    
    // Parágrafo 2
    mensagem += "2. Diante do exposto, solicito realizar a regularização pertinente, e informar este Centro até " + dataFormatada + ", as justificativas dos saldos em tela por mais de 24 horas.\n\n\n";
    
    // Assinatura
    mensagem += "      Curitiba, " + dataFormatada + "\n\n";
    mensagem += "                    ALÉQUIS SANDER DA SILVA CORRÊA - CEL\n";
    mensagem += "                              Chefe do 5º CGCFEx\n";
    
    // Escrever mensagem na célula
    abaMensagens.getRange(linhaAtual, 1).setValue(mensagem);
    abaMensagens.getRange(linhaAtual, 1).setFontFamily("Courier New");
    abaMensagens.getRange(linhaAtual, 1).setFontSize(10);
    abaMensagens.getRange(linhaAtual, 1).setVerticalAlignment("top");
    abaMensagens.getRange(linhaAtual, 1).setWrap(true);
    abaMensagens.getRange(linhaAtual, 1).setBorder(true, true, true, true, false, false, "#000000", SpreadsheetApp.BorderStyle.SOLID);
    abaMensagens.getRange(linhaAtual, 1).setBackground("#fffde7");
    
    // Ajustar altura da linha baseado no conteúdo
    var numLinhasMensagem = mensagem.split('\n').length;
    abaMensagens.setRowHeight(linhaAtual, Math.max(numLinhasMensagem * 14, 400));
    
    linhaAtual++;
    linhaAtual++; // Espaço entre mensagens
    linhaAtual++;
    
    numeroMensagem++;
  }
  
  // Resumo no final
  linhaAtual++;
  abaMensagens.getRange(linhaAtual, 1).setValue("═══════════════════════════════════════════════════════════════════════════════");
  abaMensagens.getRange(linhaAtual, 1).setFontFamily("Courier New");
  linhaAtual++;
  
  abaMensagens.getRange(linhaAtual, 1).setValue("RESUMO: " + ugsComEntesouramento.length + " UGs com entesouramento identificadas");
  abaMensagens.getRange(linhaAtual, 1).setFontWeight("bold");
  abaMensagens.getRange(linhaAtual, 1).setFontSize(12);
  abaMensagens.getRange(linhaAtual, 1).setBackground("#1a237e");
  abaMensagens.getRange(linhaAtual, 1).setFontColor("#ffffff");
  abaMensagens.getRange(linhaAtual, 1).setHorizontalAlignment("center");
  
  SpreadsheetApp.getUi().alert(
    "✅ Mensagens geradas com sucesso!\n\n" +
    "📧 Total de mensagens: " + ugsComEntesouramento.length + "\n\n" +
    "As mensagens estão na aba 'Mensagens'.\n" +
    "Basta copiar e colar para enviar!"
  );
}

/**
 * Retorna o nome da conta contábil baseado no código
 */
function obterNomeContaContabil(codigo) {
  var nomes = {
    "111122001": "LIMITE DE SAQUE COM VINCULAÇÃO DE PGTO - OFSS",
    "111122003": "LIMITE DE SAQUE COM VINCULAÇÃO DE PGTO - OUTRAS VINCULAÇÕES"
  };
  
  return nomes[codigo] || "LIMITE DE SAQUE COM VINCULAÇÃO DE PAGAMENTO";
}

/**
 * Formata valor como moeda brasileira
 */
function formatarMoeda(valor) {
  var numero = converterParaNumero(valor);
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Carrega os dados das UGs da aba "UGs"
 * Retorna um objeto {codigo: {nome, abreviacao}}
 */
function carregarDadosUGs() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaUGs = planilha.getSheetByName("UGs");
  var dadosUGs = {};
  
  if (!abaUGs) {
    return dadosUGs;
  }
  
  var ultimaLinha = obterUltimaLinhaColuna(abaUGs, 1);
  if (ultimaLinha < 2) return dadosUGs;
  
  var dados = abaUGs.getRange(2, 1, ultimaLinha - 1, 3).getValues();
  
  for (var i = 0; i < dados.length; i++) {
    var codigo = String(dados[i][0]).trim();
    var nome = String(dados[i][1]).trim();
    var abreviacao = String(dados[i][2]).trim();
    
    if (codigo !== "" && codigo !== "undefined") {
      dadosUGs[codigo] = {
        nome: nome || "Sem nome",
        abreviacao: abreviacao || codigo
      };
    }
  }
  
  return dadosUGs;
}

/**
 * Cria a aba "UGs" com os dados iniciais do cadastro
 */
function criarAbaUGs() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaUGs = planilha.getSheetByName("UGs");
  
  if (abaUGs) {
    var resposta = SpreadsheetApp.getUi().alert(
      "⚠️ Atenção",
      "A aba 'UGs' já existe. Deseja substituir os dados?",
      SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    
    if (resposta !== SpreadsheetApp.getUi().Button.YES) {
      return;
    }
    abaUGs.clear();
    abaUGs.clearFormats();
  } else {
    abaUGs = planilha.insertSheet("UGs");
  }
  
  // Dados das UGs com Nome e Abreviação
  var dadosUGs = [
    ["UG", "Nome", "Abreviação"],
    ["160077", "Colégio Militar de Curitiba", "CMC"],
    ["160192", "Base de Administração e Apoio da 5ª Região Militar", "B Adm Ap/5RM"],
    ["160206", "30º Batalhão de Infantaria Mecanizado", "30º BI Mec"],
    ["160207", "3º Regimento de Carros de Combate", "3º RCC"],
    ["160209", "Comando da 15ª Brigada de Infantaria Mecanizada", "Cmdo 15ª Bda Inf Mec"],
    ["160211", "20º Batalhão de Infantaria Blindado", "20º BIB"],
    ["160212", "27º Batalhão Logístico", "27º B Log"],
    ["160213", "5º Depósito de Suprimento", "5º D Sup"],
    ["160216", "5º Esquadrão de Cavalaria Mecanizado", "5º Esqd C Mec"],
    ["160217", "5º Grupo de Artilharia de Campanha Autopropulsado", "5º GAC AP"],
    ["160219", "Comando da 5ª Região Militar", "Cmdo 5ª RM"],
    ["160220", "Centro Regional de Obras 5", "C R Op 5"],
    ["160222", "5º Batalhão de Suprimento", "5º B Sup"],
    ["160223", "Hospital Geral de Curitiba", "H Ge C"],
    ["160224", "Parque Regional de Manutenção da 5ª Região Militar", "Pq R Mnt/5"],
    ["160227", "15ª Companhia de Infantaria Motorizada", "15ª Cia Inf Mtz"],
    ["160228", "26º Grupo de Artilharia de Campanha", "26º GAC"],
    ["160229", "15º Grupo de Artilharia de Campanha Autopropulsado", "15º GAC AP"],
    ["160230", "15ª Companhia de Engenharia de Combate Mecanizada", "15ª Cia E Cmb Mec"],
    ["160232", "13º Batalhão de Infantaria Blindado", "13º BIB"],
    ["160233", "Comando da 5ª Brigada de Cavalaria Blindada", "Cmdo 5ª Bda C Bld"],
    ["160234", "5º Regimento de Carros de Combate", "5º RCC"],
    ["160327", "5º Centro de Gestão de Custos e Finanças do Exército", "5º CGCFEx"],
    ["160378", "16º Esquadrão de Cavalaria Mecanizado", "16º Esqd C Mec"],
    ["160407", "1º Batalhão Ferroviário", "1º B Fv"],
    ["160440", "23º Batalhão de Infantaria", "23º BI"],
    ["160441", "28º Grupo de Artilharia de Campanha", "28º GAC"],
    ["160443", "63º Batalhão de Infantaria", "63º BI"],
    ["160444", "Comando da 14ª Brigada de Infantaria Motorizada", "Cmdo 14ª Bda Inf Mtz"],
    ["160445", "Hospital de Guarnição de Foz do Iguaçu", "H Gu FI"],
    ["160446", "62º Batalhão de Infantaria", "62º BI"],
    ["160448", "5º Batalhão de Engenharia de Combate Blindado", "5º BE Cmb Bld"],
    ["160450", "14º Regimento de Cavalaria Mecanizado", "14º R C Mec"],
    ["160517", "14ª Companhia de Engenharia de Combate", "14ª Cia Eng Cmb"],
    ["160524", "15º Batalhão Logístico", "15º B Log"],
    ["160901", "11ª Bateria de Artilharia Antiaérea Autopropulsada", "11ª Bia AAAe Ap"],
    ["160996", "33º Batalhão de Infantaria Mecanizado", "33º BI Mec"]
  ];
  
  // Escrever dados
  abaUGs.getRange(1, 1, dadosUGs.length, 3).setValues(dadosUGs);
  
  // Formatar cabeçalho
  var cabecalhoRange = abaUGs.getRange(1, 1, 1, 3);
  cabecalhoRange.setBackground("#1a237e");
  cabecalhoRange.setFontColor("#ffffff");
  cabecalhoRange.setFontWeight("bold");
  cabecalhoRange.setFontSize(11);
  cabecalhoRange.setHorizontalAlignment("center");
  cabecalhoRange.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  // Formatar dados
  var dadosRange = abaUGs.getRange(2, 1, dadosUGs.length - 1, 3);
  dadosRange.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);
  
  // Aplicar cores alternadas
  for (var i = 2; i <= dadosUGs.length; i++) {
    var corFundo = (i % 2 === 0) ? "#ffffff" : "#e8eaf6";
    abaUGs.getRange(i, 1, 1, 3).setBackground(corFundo);
  }
  
  // Ajustar colunas
  abaUGs.setColumnWidth(1, 80);   // UG
  abaUGs.setColumnWidth(2, 400);  // Nome
  abaUGs.setColumnWidth(3, 180);  // Abreviação
  
  // Centralizar coluna UG e Abreviação
  abaUGs.getRange(2, 1, dadosUGs.length - 1, 1).setHorizontalAlignment("center");
  abaUGs.getRange(2, 3, dadosUGs.length - 1, 1).setHorizontalAlignment("center");
  
  // Congelar cabeçalho
  abaUGs.setFrozenRows(1);
  
  SpreadsheetApp.getUi().alert(
    "✅ Aba 'UGs' criada com sucesso!\n\n" +
    "📋 Total de UGs cadastradas: " + (dadosUGs.length - 1) + "\n\n" +
    "Colunas disponíveis:\n" +
    "• UG - Código da unidade\n" +
    "• Nome - Nome completo\n" +
    "• Abreviação - Sigla para relatórios\n\n" +
    "Você pode adicionar, editar ou remover UGs diretamente na aba."
  );
}

/**
 * Funções de formatação
 */

function formatarTituloPrincipal(aba, linha, numColunas) {
  var range = aba.getRange(linha, 1, 1, numColunas);
  range.setBackground("#1a237e");
  range.setFontColor("#ffffff");
  range.setFontSize(16);
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  aba.setRowHeight(linha, 40);
  range.setBorder(true, true, true, true, false, false, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function formatarSubtitulo(aba, linha, numColunas) {
  var range = aba.getRange(linha, 1, 1, numColunas);
  range.setBackground("#283593");
  range.setFontColor("#ffffff");
  range.setFontSize(10);
  range.setFontStyle("italic");
  range.setHorizontalAlignment("center");
  range.setBorder(true, true, true, true, false, false, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function formatarCabecalhoUG(aba, linha, numColunas) {
  var range = aba.getRange(linha, 1, 1, numColunas);
  range.setBackground("#37474f");
  range.setFontColor("#ffffff");
  range.setFontSize(11);
  range.setFontWeight("bold");
  range.setHorizontalAlignment("left");
  aba.setRowHeight(linha, 30);
  range.setBorder(true, true, true, true, false, false, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function formatarCabecalhoColunas(aba, linha, numColunas) {
  var range = aba.getRange(linha, 1, 1, numColunas);
  range.setBackground("#546e7a");
  range.setFontColor("#ffffff");
  range.setFontSize(10);
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  aba.setRowHeight(linha, 25);
  range.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);
}

function formatarDadosGrupo(aba, linhaInicio, linhaFim, numColunas) {
  if (linhaFim < linhaInicio) return;
  
  var numLinhas = linhaFim - linhaInicio + 1;
  var range = aba.getRange(linhaInicio, 1, numLinhas, numColunas);
  
  // Bordas em todas as células
  range.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);
  
  // Formatação de números
  aba.getRange(linhaInicio, 5, numLinhas, 3).setNumberFormat("#.##0,00");
  
  // Alinhamentos
  aba.getRange(linhaInicio, 1, numLinhas, 4).setHorizontalAlignment("center");
  aba.getRange(linhaInicio, 5, numLinhas, 3).setHorizontalAlignment("right");
  aba.getRange(linhaInicio, 8, numLinhas, 1).setHorizontalAlignment("center");
  
  // Fonte
  range.setFontSize(9);
  
  // Cores alternadas nas linhas
  for (var i = 0; i < numLinhas; i++) {
    var linhaAtual = linhaInicio + i;
    var corFundo = (i % 2 === 0) ? "#ffffff" : "#f5f5f5";
    aba.getRange(linhaAtual, 1, 1, numColunas - 1).setBackground(corFundo); // Exceto status
  }
}

function formatarSubtotal(aba, linha, numColunas) {
  var range = aba.getRange(linha, 1, 1, numColunas);
  range.setBackground("#cfd8dc");
  range.setFontWeight("bold");
  range.setFontSize(10);
  range.setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  // Formatar números
  aba.getRange(linha, 5, 1, 3).setNumberFormat("#.##0,00");
  aba.getRange(linha, 5, 1, 3).setHorizontalAlignment("right");
  aba.getRange(linha, 1).setHorizontalAlignment("right");
  aba.getRange(linha, 8).setHorizontalAlignment("center");
}

function formatarTituloResumo(aba, linha, numColunas) {
  var range = aba.getRange(linha, 1, 1, numColunas);
  range.setBackground("#1a237e");
  range.setFontColor("#ffffff");
  range.setFontSize(12);
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  aba.setRowHeight(linha, 30);
  range.setBorder(true, true, true, true, false, false, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function formatarLinhaResumo(aba, linha, par) {
  var corFundo = par ? "#e8eaf6" : "#c5cae9";
  aba.getRange(linha, 1, 1, 8).setBackground(corFundo);
  aba.getRange(linha, 1, 1, 8).setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);
  aba.getRange(linha, 1).setFontWeight("bold");
  aba.getRange(linha, 4).setHorizontalAlignment("center");
  aba.getRange(linha, 4).setFontWeight("bold");
}

function aplicarCoresStatus(aba, linhasStatus) {
  for (var i = 0; i < linhasStatus.length; i++) {
    var info = linhasStatus[i];
    var celula = aba.getRange(info.linha, 8);
    
    var corFundo = "#ffffff";
    var corTexto = "#000000";
    
    switch(info.status) {
      case "Permanece igual":
        corFundo = "#c8e6c9"; // Verde claro
        corTexto = "#1b5e20";
        break;
      case "Aumentou":
        corFundo = "#fff9c4"; // Amarelo claro
        corTexto = "#f57f17";
        break;
      case "Diminuiu":
        corFundo = "#ffcdd2"; // Vermelho claro
        corTexto = "#b71c1c";
        break;
      case "Removido no Dia 2":
        corFundo = "#ef5350"; // Vermelho
        corTexto = "#ffffff";
        break;
      case "Novo no Dia 2":
        corFundo = "#bbdefb"; // Azul claro
        corTexto = "#0d47a1";
        break;
    }
    
    celula.setBackground(corFundo);
    celula.setFontColor(corTexto);
    celula.setFontWeight("bold");
  }
}

function calcularEstatisticas(resultadosPorUG) {
  var stats = {
    iguais: 0,
    aumentaram: 0,
    diminuiram: 0,
    removidos: 0,
    novos: 0
  };
  
  for (var ug in resultadosPorUG) {
    var registros = resultadosPorUG[ug];
    for (var i = 0; i < registros.length; i++) {
      switch(registros[i].status) {
        case "Permanece igual": stats.iguais++; break;
        case "Aumentou": stats.aumentaram++; break;
        case "Diminuiu": stats.diminuiram++; break;
        case "Removido no Dia 2": stats.removidos++; break;
        case "Novo no Dia 2": stats.novos++; break;
      }
    }
  }
  
  return stats;
}

function formatarData(data) {
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  var hora = String(data.getHours()).padStart(2, '0');
  var minuto = String(data.getMinutes()).padStart(2, '0');
  
  return dia + "/" + mes + "/" + ano + " às " + hora + ":" + minuto;
}

/**
 * Função auxiliar para obter a última linha com dados em uma coluna específica
 */
function obterUltimaLinhaColuna(aba, coluna) {
  var dados = aba.getRange(1, coluna, aba.getMaxRows(), 1).getValues();
  for (var i = dados.length - 1; i >= 0; i--) {
    if (dados[i][0] !== "" && dados[i][0] !== null) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Função auxiliar para converter valor para número
 * Lida com formato brasileiro (vírgula como decimal)
 */
function converterParaNumero(valor) {
  if (typeof valor === "number") {
    return valor;
  }
  if (typeof valor === "string") {
    var valorLimpo = valor.replace(/\./g, "").replace(",", ".");
    var numero = parseFloat(valorLimpo);
    return isNaN(numero) ? 0 : numero;
  }
  return 0;
}

/**
 * Adiciona menu personalizado ao abrir a planilha
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("📊 Comparar Saldos")
    .addItem("🔄 Comparar Tabelas", "compararSaldos")
    .addItem("✅ Filtrar Saldos Permanentes", "filtrarSaldosPermanentes")
    .addSeparator()
    .addItem("📧 Gerar Mensagens de Cobrança", "gerarMensagensCobranca")
    .addSeparator()
    .addItem("📋 Criar/Atualizar Cadastro de UGs", "criarAbaUGs")
    .addItem("🗑️ Limpar Resultado", "limparResultado")
    .addToUi();
}

/**
 * Função para limpar a aba de resultado
 */
function limparResultado() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaResultado = planilha.getSheetByName("Resultado");
  
  if (abaResultado) {
    abaResultado.clear();
    abaResultado.clearFormats();
    abaResultado.clearConditionalFormatRules();
    SpreadsheetApp.getUi().alert("✅ Aba 'Resultado' limpa com sucesso!");
  } else {
    SpreadsheetApp.getUi().alert("⚠️ Aba 'Resultado' não existe.");
  }
}

/**
 * Função para filtrar apenas os saldos que permanecem iguais ou ainda existem
 */
function filtrarSaldosPermanentes() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaResultado = planilha.getSheetByName("Resultado");
  
  if (!abaResultado) {
    SpreadsheetApp.getUi().alert("⚠️ Execute primeiro a comparação de saldos!");
    return;
  }
  
  var dados = abaResultado.getDataRange().getValues();
  var permanentes = [];
  var cabecalhoEncontrado = false;
  var cabecalho = [];
  
  for (var i = 0; i < dados.length; i++) {
    var linha = dados[i];
    
    // Encontrar o cabeçalho das colunas
    if (linha[0] === "UG Executora" && linha[1] === "Conta Contábil") {
      if (!cabecalhoEncontrado) {
        cabecalho = linha;
        cabecalhoEncontrado = true;
      }
      continue;
    }
    
    // Verificar se é uma linha de dados (tem status válido)
    var status = linha[7];
    if (status === "Permanece igual" || status === "Aumentou" || status === "Diminuiu") {
      permanentes.push(linha);
    }
  }
  
  if (permanentes.length === 0) {
    SpreadsheetApp.getUi().alert("⚠️ Nenhum saldo permanente encontrado!");
    return;
  }
  
  // Criar aba para saldos permanentes
  var abaPermanentes = planilha.getSheetByName("Saldos Permanentes");
  if (!abaPermanentes) {
    abaPermanentes = planilha.insertSheet("Saldos Permanentes");
  } else {
    abaPermanentes.clear();
    abaPermanentes.clearFormats();
  }
  
  // Título
  abaPermanentes.getRange(1, 1, 1, 8).merge();
  abaPermanentes.getRange(1, 1).setValue("SALDOS QUE PERMANECEM");
  formatarTituloPrincipal(abaPermanentes, 1, 8);
  
  // Cabeçalho
  abaPermanentes.getRange(3, 1, 1, 8).setValues([cabecalho]);
  formatarCabecalhoColunas(abaPermanentes, 3, 8);
  
  // Dados
  abaPermanentes.getRange(4, 1, permanentes.length, 8).setValues(permanentes);
  formatarDadosGrupo(abaPermanentes, 4, 4 + permanentes.length - 1, 8);
  
  // Aplicar cores de status
  var linhasStatus = [];
  for (var j = 0; j < permanentes.length; j++) {
    linhasStatus.push({linha: 4 + j, status: permanentes[j][7]});
  }
  aplicarCoresStatus(abaPermanentes, linhasStatus);
  
  // Ajustar colunas
  abaPermanentes.autoResizeColumns(1, 8);
  
  SpreadsheetApp.getUi().alert(
    "✅ Filtragem concluída!\n\n" +
    "Saldos que permanecem: " + permanentes.length + "\n" +
    "Resultados salvos na aba 'Saldos Permanentes'."
  );
}
