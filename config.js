/* ==========================================================================
   CONFIG — dados da loja.
   Este é o ÚNICO lugar para mexer nos seus dados: vale para todas as páginas.
   ========================================================================== */

const CONFIG = {
  marca:        "H Maria",             // parte grande do logo
  marcaSub:     "por Karol",           // palavrinha pequena embaixo
  nomeCompleto: "H Maria por Karol",

  whatsapp:   "5549999295076",        // DDI + DDD + número, só números
  mensagem:   "Olá! Vim pelo site e gostaria de atendimento 💛",

  instagram:  "https://instagram.com/hmaria_porkarol",
  maps:       "https://maps.google.com/?q=Aurora+Semijoias",

  parcelas:    10,     // nº de parcelas exibido no card do produto
  // Link InfinitePay: recebimento em 1 dia útil, Nitro desativado.
  // Taxas percentuais sobre a venda. Atualize aqui ao mudar seu plano.
  taxasCreditoInfinitePay: {1:4.20, 2:6.09, 3:7.01, 4:7.91, 5:8.80, 6:9.67, 7:12.59, 8:13.42, 9:14.25, 10:15.06},
  porPagina:   12     // peças carregadas por vez no catálogo
};
