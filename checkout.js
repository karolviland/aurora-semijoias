function montarMensagemPedido({itens, obterProduto, nome, cpf, pagamento, produtosCentavos, totalCentavos, opcao, precisaTroco, pagoCentavos}) {
  const reais = centavos => (centavos / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL', minimumFractionDigits:2, maximumFractionDigits:2}).replace(/\u00a0/g, ' ');
  const texto = valor => String(valor ?? '').replace(/[\r\n]+/g, ' ').trim();
  const produtos = itens.map(it => {
    const p = obterProduto(it.id);
    const variacoes = {...(typeof it.variacoes === 'object' && !Array.isArray(it.variacoes) ? it.variacoes : {})};
    if (it.tamanho) variacoes.Tamanho = it.tamanho;
    if (it.cor) variacoes.Cor = it.cor;
    const detalhes = Object.entries(variacoes).filter(([,v]) => v != null && v !== '').map(([k,v]) => texto(k) + ': ' + texto(v));
    if (typeof it.variacao === 'string' && it.variacao.trim()) detalhes.push('Variação: ' + texto(it.variacao));
    return ['• ' + it.q + ' × ' + texto(p.nome), ...detalhes, 'Referência: ' + texto(p.id), 'Valor: ' + reais(Math.round(p.preco * 100) * it.q)].join('\n');
  }).join('\n\n');
  const dados = '*👤 Dados da cliente*\nNome: ' + texto(nome) + '\nCPF: ' + texto(cpf);
  const linhas = ['*💳 Pagamento*', pagamento === 'Cartão de crédito' ? 'Cartão de crédito pelo link InfinitePay' : texto(pagamento)];
  if (pagamento === 'Cartão de crédito' && opcao) linhas.push('Parcelamento: ' + opcao.parcelas + 'x de aproximadamente ' + reais(opcao.parcelaCentavos));
  linhas.push('Valor dos produtos: ' + reais(produtosCentavos));
  if (pagamento === 'Cartão de crédito' && opcao) linhas.push('Acréscimo pelo pagamento no cartão: ' + reais(opcao.acrescimoCentavos));
  if (pagamento === 'Pix' && totalCentavos < produtosCentavos) linhas.push('Desconto no Pix: ' + reais(produtosCentavos - totalCentavos));
  if (pagamento === 'Dinheiro') linhas.push(precisaTroco ? 'Troco para: ' + reais(pagoCentavos) + '\nTroco a receber: ' + reais(pagoCentavos - totalCentavos) : 'Não preciso de troco.');
  linhas.push('*Total a pagar: ' + reais(totalCentavos) + '*');
  const partes = ['Olá, H Maria! ✨ Gostaria de finalizar meu pedido feito pelo site.', '*🛍️ Meu pedido*\n' + produtos, dados, linhas.join('\n')];
  if (pagamento === 'Cartão de crédito') partes.push('Pode me enviar o link para pagamento? 💖');
  return partes.join('\n\n');
}
/* Taxas sobre a venda, não juros mensais. Valores em centavos; exibição igual ao simulador público. */
function calcularParcelamento(produtosCentavos, parcelas, taxas) {
  const taxa = Number(taxas[parcelas]);
  if (!Number.isSafeInteger(produtosCentavos) || produtosCentavos < 0 || !Number.isInteger(parcelas) || parcelas < 1 || parcelas > 10 || !Number.isFinite(taxa) || taxa < 0 || taxa >= 100) throw new Error('Parcelamento indisponível.');
  const bruto = produtosCentavos / 100 / (1 - taxa / 100);
  const moeda = v => Number(v.toLocaleString('en-US', {useGrouping:false, minimumFractionDigits:2, maximumFractionDigits:2}));
  const totalCentavos = Math.round(moeda(bruto) * 100);
  return {parcelas, taxa, totalCentavos, acrescimoCentavos:totalCentavos-produtosCentavos, parcelaCentavos:Math.round(moeda(bruto / parcelas) * 100)};
}
/* Formulário de pedido: dados mantidos apenas enquanto a página está aberta. */
function iniciarCheckout(obterItens, obterProduto, formatar, linkWhatsApp, config) {
  const dialog = document.createElement('dialog');
  dialog.className = 'checkout-dialog';
  dialog.setAttribute('aria-labelledby', 'checkout-title');
  dialog.innerHTML = `<form id="checkout-form" novalidate>
    <div class="checkout-head"><h2 id="checkout-title">Finalizar pedido</h2><button type="button" class="x" data-checkout-close aria-label="Fechar formulário">×</button></div>
    <p>Preencha seus dados para continuar com a nossa consultora.</p>
    <label for="checkout-name">Nome completo *</label><input id="checkout-name" name="nome" autocomplete="name" maxlength="150" required>
    <label for="checkout-cpf">CPF *</label><input id="checkout-cpf" name="cpf" inputmode="numeric" placeholder="000.000.000-00" maxlength="14" required aria-describedby="checkout-error">
    <label for="checkout-payment">Forma de pagamento *</label><select id="checkout-payment" name="pagamento" required><option value="">Selecione</option><option value="Pix">Pix</option><option value="Cartão de crédito">Cartão de crédito</option><option value="Cartão de débito">Cartão de débito</option><option value="Dinheiro">Dinheiro</option></select>
    <div id="checkout-credit" hidden><label for="checkout-installments">Parcelamento *</label><select id="checkout-installments" name="parcelas"><option value="">Selecione o parcelamento</option></select><p class="note">Pagamento por Link de Pagamento InfinitePay. As taxas da venda são repassadas no total; não são juros mensais.</p></div>
    <div id="checkout-cash" hidden><label for="checkout-change">Precisa de troco? *</label><select id="checkout-change"><option value="">Selecione</option><option value="nao">Não preciso</option><option value="sim">Sim</option></select>
    <div id="checkout-change-wrap" hidden><label for="checkout-change-value">Troco para qual valor? *</label><input id="checkout-change-value" inputmode="decimal" placeholder="Ex.: 200,00" maxlength="15"></div></div>
    <div class="checkout-summary" aria-live="polite"><div class="checkout-total">Valor dos produtos <strong id="checkout-products"></strong></div><div class="checkout-total" id="checkout-fee-row" hidden>Acréscimo <strong id="checkout-fee"></strong></div><div class="checkout-total">Total final <strong id="checkout-total"></strong></div><p id="checkout-installment-summary" hidden></p></div>
    <p class="note" id="checkout-discount" hidden></p>
    <p id="checkout-error" class="checkout-error" role="alert"></p>
    <button type="submit" class="btn btn-full btn-wa">Finalizar pelo WhatsApp</button>
    <button type="button" class="btn btn-full ghost" data-checkout-close>Voltar à sacola</button>
  </form>`;
  document.body.append(dialog);
  const campo = id => dialog.querySelector('#checkout-' + id);
  const form = dialog.querySelector('form');
  const nome = campo('name'), cpf = campo('cpf'), pagamento = campo('payment');
  const troco = campo('change'), valorTroco = campo('change-value');
  const parcelas = campo('installments');
  const campos = [nome, cpf, pagamento, parcelas, troco, valorTroco];
  function erroNoCampo(input, mensagem) {
    input.setCustomValidity(mensagem);
    input.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    dialog.querySelector('#' + input.id + '-error').textContent = mensagem;
  }
  campos.forEach(input => {
    const erro = document.createElement('p');
    erro.id = input.id + '-error';
    erro.className = 'checkout-field-error';
    input.setAttribute('aria-describedby', erro.id);
    input.insertAdjacentElement('afterend', erro);
    input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
      erroNoCampo(input, ''); campo('error').textContent = '';
    });
  });
  dialog.addEventListener('keydown', e => { if (e.key === 'Escape') e.stopPropagation(); });
  dialog.addEventListener('close', () => document.querySelector('#btn-checkout').focus());
  const subtotal = () => obterItens().reduce((s, it) => s + Math.round(obterProduto(it.id).preco * 100) * it.q, 0);
  const opcoes = () => Array.from({length:10}, (_, i) => calcularParcelamento(subtotal(), i + 1, config.taxasCreditoInfinitePay));
  const selecionada = () => pagamento.value === 'Cartão de crédito' ? opcoes().find(o => o.parcelas === Number(parcelas.value)) : null;
  const total = () => selecionada()?.totalCentavos ?? Math.round(subtotal() * (pagamento.value === 'Pix' ? 1 - (config.descontoPix || 0) / 100 : 1));
  const parcelaTexto = o => o.parcelas + 'x de ' + formatar(o.parcelaCentavos / 100) + (o.parcelas > 1 ? ' (aprox.)' : '');
  const dinheiroEmCentavos = valor => {
    const texto = valor.trim();
    if (!/^\d+(?:[,.]\d{1,2})?$/.test(texto)) return NaN;
    return Math.round(Number(texto.replace(',', '.')) * 100);
  };
  function atualizar() {
    const credito = pagamento.value === 'Cartão de crédito';
    campo('credit').hidden = !credito;
    parcelas.disabled = !credito; parcelas.required = credito;
    erroNoCampo(parcelas, '');
    const anterior = parcelas.value;
    if (credito) {
      parcelas.innerHTML = '<option value="">Selecione o parcelamento</option>' + opcoes().map(o => '<option value="' + o.parcelas + '">' + parcelaTexto(o) + ' — total ' + formatar(o.totalCentavos / 100) + '</option>').join('');
      parcelas.value = anterior;
    } else parcelas.value = '';
    const opcao = selecionada();
    campo('products').textContent = formatar(subtotal() / 100);
    campo('fee-row').hidden = !opcao;
    campo('fee').textContent = opcao ? formatar(opcao.acrescimoCentavos / 100) : '';
    campo('installment-summary').hidden = !opcao;
    campo('installment-summary').textContent = opcao ? parcelaTexto(opcao) + '. Taxa sobre a venda: ' + opcao.taxa.toFixed(2).replace('.', ',') + '%.' : '';
    const dinheiro = pagamento.value === 'Dinheiro';
    campo('cash').hidden = !dinheiro;
    troco.required = dinheiro; troco.disabled = !dinheiro;
    const precisa = dinheiro && troco.value === 'sim';
    campo('change-wrap').hidden = !precisa;
    valorTroco.required = precisa; valorTroco.disabled = !precisa;
    erroNoCampo(valorTroco, '');
    erroNoCampo(troco, '');
    campo('total').textContent = formatar(total() / 100);
    campo('discount').hidden = pagamento.value !== 'Pix' || !config.descontoPix;
    campo('discount').textContent = 'Desconto de ' + config.descontoPix + '% no Pix aplicado ao total.';
    campo('error').textContent = '';
  }
  function cpfValido(valor) {
    if (!/^\d{11}$/.test(valor) || /^(\d)\1{10}$/.test(valor)) return false;
    for (let tamanho = 9; tamanho <= 10; tamanho++) {
      let soma = 0;
      for (let i = 0; i < tamanho; i++) soma += Number(valor[i]) * (tamanho + 1 - i);
      const digito = (soma * 10 % 11) % 10;
      if (digito !== Number(valor[tamanho])) return false;
    }
    return true;
  }
  cpf.addEventListener('input', () => {
    const v = cpf.value.replace(/\D/g, '').slice(0, 11);
    cpf.value = v.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2').replace(/(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
    cpf.setCustomValidity(''); campo('error').textContent = '';
  });
  nome.addEventListener('input', () => nome.setCustomValidity(''));
  valorTroco.addEventListener('input', () => valorTroco.setCustomValidity(''));
  pagamento.addEventListener('change', atualizar);
  troco.addEventListener('change', atualizar);
  parcelas.addEventListener('change', atualizar);
  dialog.querySelectorAll('[data-checkout-close]').forEach(b => b.addEventListener('click', () => dialog.close()));
  document.querySelector('#btn-checkout').addEventListener('click', () => {
    if (!obterItens().length) return;
    atualizar(); dialog.showModal(); nome.focus();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!obterItens().length) { campo('error').textContent = 'Sua sacola está vazia. Adicione produtos para continuar.'; return; }
    const nomeCompleto = nome.value.trim().replace(/\s+/g, ' ');
    erroNoCampo(nome, /^[\p{L}][\p{L}\p{M}'’.-]*(?: [\p{L}][\p{L}\p{M}'’.-]*)+$/u.test(nomeCompleto) ? '' : 'Informe seu nome completo, com nome e sobrenome.');
    const cpfNumeros = cpf.value.replace(/\D/g, '');
    erroNoCampo(cpf, cpfValido(cpfNumeros) ? '' : 'Informe um CPF válido.');
    const precisaTroco = pagamento.value === 'Dinheiro' && troco.value === 'sim';
    const pago = dinheiroEmCentavos(valorTroco.value);
    erroNoCampo(valorTroco, precisaTroco && (!Number.isSafeInteger(pago) || pago < total()) ? 'Informe um valor igual ou maior que o total do pedido (ex.: 200,00).' : '');
    erroNoCampo(pagamento, ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Dinheiro'].includes(pagamento.value) ? '' : 'Selecione a forma de pagamento.');
    erroNoCampo(troco, pagamento.value === 'Dinheiro' && !['sim', 'nao'].includes(troco.value) ? 'Informe se precisa de troco.' : '');
    erroNoCampo(parcelas, pagamento.value === 'Cartão de crédito' && !selecionada() ? 'Selecione de 1x a 10x para pagar no cartão de crédito.' : '');
    const invalido = campos.find(input => !input.disabled && !input.validity.valid);
    if (invalido) {
      campo('error').textContent = 'Corrija os campos indicados para finalizar seu pedido.';
      invalido.focus();
      return;
    }
    campo('error').textContent = '';
    const mensagem = montarMensagemPedido({itens:obterItens(), obterProduto, nome:nomeCompleto, cpf:cpf.value, pagamento:pagamento.value, produtosCentavos:subtotal(), totalCentavos:total(), opcao:selecionada(), precisaTroco, pagoCentavos:pago});
    window.open(linkWhatsApp(mensagem), '_blank', 'noopener,noreferrer');
  });
}
