# Parcelamento InfinitePay

As taxas editáveis ficam em taxasCreditoInfinitePay em config.js e .site-publish/dist/config.js.
Plano: Link de Pagamento, 1 dia útil, Nitro desativado. São taxas sobre a venda, não juros mensais.
Fórmula: produtos / (1 - taxa / 100). Total exibido arredondado a dois decimais, como no simulador público.

Validação em 08/10/2026: 80 resultados comparados executando a função calculate original da página https://www.infinitepay.io/calculadora-de-taxas. Taxas e totais coincidiram. Fluxo do formulário, 10 opções, resumo e WhatsApp testados.

Publicação pendente: confirmar divisão dos centavos nas parcelas no link real. O simulador público não exibe essa divisão. Exemplo: produtos R$ 100,00 em 3x -> total R$ 107,54; parcela calculada R$ 35,85, cuja multiplicação resulta em R$ 107,55. Em 10x -> total R$ 117,73 e parcela R$ 11,77. Enquanto não confirmado, valores das parcelas estão marcados como aproximados no código local. Não publicar antes de concluir a conferência solicitada.
