/**
 * Script para comparar saldos entre duas tabelas no Google Sheets
 * Tabela Esquerda (Dia 1): Colunas A:E
 * Tabela Direita (Dia 2): Colunas G:K
 * Resultado: Aba "Resultado"
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
    
    // Criar chave única combinando os campos identificadores
    var chave = ugExecutora + "|" + contaContabil + "|" + contaCorrente + "|" + vinculacao;
    mapaDia2[chave] = {
      saldo: saldo,
      ugExecutora: ugExecutora,
      contaContabil: contaContabil,
      contaCorrente: contaCorrente,
      vinculacao: vinculacao
    };
  }
  
  // Comparar dados do Dia 1 com Dia 2
  var resultados = [];
  var cabecalho = [
    "UG Executora",
    "Conta Contábil", 
    "Conta Corrente",
    "Vinculação Pagamento",
    "Saldo Dia 1 - R$",
    "Saldo Dia 2 - R$",
    "Diferença - R$",
    "Status"
  ];
  resultados.push(cabecalho);
  
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
    
    resultados.push([
      ugExec,
      contaCont,
      contaCorr,
      vincPag,
      saldoDia1,
      saldoDia2,
      diferenca,
      status
    ]);
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
      resultados.push([
        dadosNovos.ugExecutora,
        dadosNovos.contaContabil,
        dadosNovos.contaCorrente,
        dadosNovos.vinculacao,
        0,
        saldoNovo,
        saldoNovo,
        "Novo no Dia 2"
      ]);
    }
  }
  
  // Criar ou limpar aba "Resultado"
  var abaResultado = planilha.getSheetByName("Resultado");
  if (!abaResultado) {
    abaResultado = planilha.insertSheet("Resultado");
  } else {
    abaResultado.clear();
  }
  
  // Escrever resultados
  if (resultados.length > 0) {
    abaResultado.getRange(1, 1, resultados.length, resultados[0].length).setValues(resultados);
    
    // Formatar cabeçalho
    var cabecalhoRange = abaResultado.getRange(1, 1, 1, cabecalho.length);
    cabecalhoRange.setFontWeight("bold");
    cabecalhoRange.setBackground("#4285f4");
    cabecalhoRange.setFontColor("#ffffff");
    
    // Formatar colunas de valores como moeda
    var numLinhas = resultados.length - 1;
    if (numLinhas > 0) {
      abaResultado.getRange(2, 5, numLinhas, 3).setNumberFormat("#.##0,00");
    }
    
    // Ajustar largura das colunas
    abaResultado.autoResizeColumns(1, cabecalho.length);
    
    // Aplicar cores condicionais na coluna Status
    for (var r = 2; r <= resultados.length; r++) {
      var statusCell = abaResultado.getRange(r, 8);
      var statusValor = statusCell.getValue();
      
      if (statusValor === "Permanece igual") {
        statusCell.setBackground("#b7e1cd"); // Verde claro
      } else if (statusValor === "Aumentou") {
        statusCell.setBackground("#fce8b2"); // Amarelo claro
      } else if (statusValor === "Diminuiu") {
        statusCell.setBackground("#f4c7c3"); // Vermelho claro
      } else if (statusValor === "Removido no Dia 2") {
        statusCell.setBackground("#ea9999"); // Vermelho
      } else if (statusValor === "Novo no Dia 2") {
        statusCell.setBackground("#a4c2f4"); // Azul claro
      }
    }
  }
  
  SpreadsheetApp.getUi().alert(
    "Comparação concluída!\n\n" +
    "Total de registros analisados: " + (resultados.length - 1) + "\n" +
    "Resultados salvos na aba 'Resultado'."
  );
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
    // Remove pontos de milhar e substitui vírgula por ponto
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
    .addItem("Comparar Tabelas", "compararSaldos")
    .addItem("Filtrar Saldos que Permanecem", "filtrarSaldosPermanentes")
    .addToUi();
}

/**
 * Função para filtrar apenas os saldos que permanecem iguais ou ainda existem
 */
function filtrarSaldosPermanentes() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaResultado = planilha.getSheetByName("Resultado");
  
  if (!abaResultado) {
    SpreadsheetApp.getUi().alert("Erro: Execute primeiro a comparação de saldos!");
    return;
  }
  
  var dados = abaResultado.getDataRange().getValues();
  var permanentes = [dados[0]]; // Cabeçalho
  
  for (var i = 1; i < dados.length; i++) {
    var status = dados[i][7];
    // Incluir registros que permanecem (igual, aumentou ou diminuiu - mas ainda existe)
    if (status === "Permanece igual" || status === "Aumentou" || status === "Diminuiu") {
      permanentes.push(dados[i]);
    }
  }
  
  // Criar aba para saldos permanentes
  var abaPermanentes = planilha.getSheetByName("Saldos Permanentes");
  if (!abaPermanentes) {
    abaPermanentes = planilha.insertSheet("Saldos Permanentes");
  } else {
    abaPermanentes.clear();
  }
  
  if (permanentes.length > 1) {
    abaPermanentes.getRange(1, 1, permanentes.length, permanentes[0].length).setValues(permanentes);
    
    // Formatar cabeçalho
    var cabecalhoRange = abaPermanentes.getRange(1, 1, 1, permanentes[0].length);
    cabecalhoRange.setFontWeight("bold");
    cabecalhoRange.setBackground("#4285f4");
    cabecalhoRange.setFontColor("#ffffff");
    
    abaPermanentes.autoResizeColumns(1, permanentes[0].length);
  }
  
  SpreadsheetApp.getUi().alert(
    "Filtragem concluída!\n\n" +
    "Saldos que permanecem: " + (permanentes.length - 1) + "\n" +
    "Resultados salvos na aba 'Saldos Permanentes'."
  );
}
