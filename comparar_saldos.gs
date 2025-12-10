/**
 * Script para comparar saldos entre duas tabelas no Google Sheets
 * Tabela Esquerda (Dia 1): Colunas A:E
 * Tabela Direita (Dia 2): Colunas G:K
 * Resultado: Aba "Resultado"
 * 
 * Versão 2.0 - Com formatação profissional e separação por UG Executora
 */

/**
 * Função principal para comparar saldos entre as duas tabelas
 * Identifica quais saldos do Dia 1 ainda permanecem no Dia 2
 */
function compararSaldos() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaDados = planilha.getSheetByName("Dados");
  
  if (!abaDados) {
    SpreadsheetApp.getUi().alert("Erro: Aba 'Dados' não encontrada!");
    return;
  }
  
  // Criar ou limpar aba "Resultado" ANTES de tudo
  var abaResultado = planilha.getSheetByName("Resultado");
  if (!abaResultado) {
    abaResultado = planilha.insertSheet("Resultado");
  } else {
    abaResultado.clear();
    abaResultado.clearFormats();
    // Remover todas as formatações condicionais
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
    
    // Calcular totais da UG
    var totalDia1UG = 0;
    var totalDia2UG = 0;
    for (var t = 0; t < registrosUG.length; t++) {
      totalDia1UG += registrosUG[t].saldoDia1;
      totalDia2UG += registrosUG[t].saldoDia2;
    }
    
    // Cabeçalho da UG
    abaResultado.getRange(linhaAtual, 1, 1, numColunas).merge();
    abaResultado.getRange(linhaAtual, 1).setValue("UG EXECUTORA: " + ug);
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
    
    // Linha de subtotal da UG
    abaResultado.getRange(linhaAtual, 1, 1, 4).merge();
    abaResultado.getRange(linhaAtual, 1).setValue("SUBTOTAL " + ug);
    abaResultado.getRange(linhaAtual, 5).setValue(totalDia1UG);
    abaResultado.getRange(linhaAtual, 6).setValue(totalDia2UG);
    abaResultado.getRange(linhaAtual, 7).setValue(totalDia2UG - totalDia1UG);
    abaResultado.getRange(linhaAtual, 8).setValue(registrosUG.length + " registros");
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
  range.setFontSize(12);
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
