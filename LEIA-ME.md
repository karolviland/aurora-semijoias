# H Maria por Karol — loja virtual

Página inicial no estilo e-commerce (referência: montecarlo.com.br), com as
**115 peças do catálogo 09/26** já cadastradas, com foto, preço e categoria.

## Arquivos
| arquivo | o que é |
|---|---|
| `index.html` | o site (abra com dois cliques) |
| `produtos.js` | **as 115 peças** — nome, categoria, material, preço |
| `assets/produtos/` | as fotos, uma por código |
| `assets/banners/` | as duas artes do carrossel do topo |
| `assets/categorias/` | fotos da vitrine "Encontre sua peça" (brincos, colares, pulseiras, aneis) |
| `conferir-produtos.html` | sua conferência do PDF (não faz parte do site) |
| `produtos.csv` / `produtos.json` | dados brutos extraídos do PDF |
| `versao-anterior-linkbio.html` | a primeira versão, estilo link na bio |

## O que já funciona
- Carrossel de banners (automático, setas, bolinhas, arraste no celular)
- Círculos de categoria que filtram o catálogo
- Vitrines: Destaques, Favoritas das clientes e Prata 925
- **Catálogo completo** (seção da home) com filtro por categoria + material e "carregar mais"
- Busca ao vivo por nome, categoria, material ou **código da peça**
- Favoritos com contador
- **Sacola**: quantidade, subtotal, valor no Pix e botão "Finalizar no WhatsApp"
  com o pedido escrito item por item
- Menu lateral no celular, mega menu no computador, FAQ, newsletter

## Personalizar

### 1. Dados da loja — arquivo `config.js` (vale para todas as páginas)
```js
marca / marcaSub   nome no logo (parte grande e palavrinha de baixo)
whatsapp           DDI + DDD + número, só números. Ex: 5549999999999
instagram / maps   links dos botões
parcelas           nº de parcelas mostrado no card
descontoPix        % de desconto no Pix
porPagina          quantas peças carregam por vez no catálogo
```

### 2. Peças — `produtos.js`
Cada linha é uma peça:
```js
{ id:"43183", cat:"Anéis", mat:"Folheado a Ouro", preco:523.20, de:0, tag:"", vitrine:"",
  nome:"Anel coração cravejado em zircônias" },
```
- `id` — código da peça; a foto é buscada sozinha em `assets/produtos/43183.jpg`
- `de` — para criar promoção: coloque o preço antigo (aparece riscado)
- `tag` — etiqueta na foto: `"novo"` ou `"-20%"`
- `vitrine` — `"destaques"`, `"favoritas"` ou vazio

Para **adicionar uma peça**: jogue a foto quadrada em `assets/produtos/` com o
nome do código e copie uma linha dessas trocando os dados.

### 3. Banners do topo — `assets/banners/`
O carrossel tem só duas telas, as duas com a arte pronta (título, texto e botão já
vêm na imagem). Para trocar, salve a arte nova por cima, com o mesmo nome:
`hero-prazer-karol.jpg` (botão abre o WhatsApp) e `hero-cada-versao.jpg` (botão
leva ao catálogo). Use imagens deitadas, por volta de 2170 × 725 px (3 × 1). No
computador a arte aparece inteira; no celular o site mostra só o pedaço onde fica
o texto: o lado direito na arte da Karol e o lado esquerdo na das joias.

### 4. Confira antes de publicar

Os nomes das peças foram escritos a partir das fotos — confira se batem com o
nome que você usa. Os preços vieram do catálogo (valor cheio, sem desconto).

**Textos que são promessa e precisam da sua confirmação:**
- barra do topo e faixa de confiança: 3x sem juros, troca grátis em 7 dias,
  5% off no Pix
- "Garantia de 1 ano" e "Compre e retire" na seção de vantagens
- os 3 depoimentos (são de exemplo — troque por reais)

## Publicar (grátis)
Arraste a pasta inteira em https://app.netlify.com/drop — sai um link na hora.

---

## Página de Garantia, Produtos e Cuidados
`garantia-e-cuidados.html` — conteúdo tirado do catálogo `CHECK_LIST_2026_JUNHO.pdf`:

- **Garantia e assistência**: prazo de 1 ano, como acionar, prazo de 30 a 40 dias,
  e as listas de *coberto* × *não coberto* separadas por corpo, componentes e
  folheação, mais as situações que ficam automaticamente fora da garantia.
- **Sobre os produtos**: joias contemporâneas × maciças × bijuteria; as 3 partes
  de uma joia (corpo/tombak, componentes, folheação); tabelas de ligas de ouro e
  prata; aço 304L/316L; zircônia, cristal, pérola e as 20 pedras naturais;
  as 8 camadas do banho de ouro e os milésimos depositados.
- **Dicas para manter as joias sempre lindas**: os 5 cuidados.

As 5 dicas também aparecem resumidas na página inicial, e o FAQ foi reescrito
com essas informações.

**Não publiquei no site**, de propósito: o nome e o telefone da pessoa da
assistência técnica, o endereço da fábrica e o nome do fabricante. Se quiser
qualquer um desses no ar, me avise.

**Dados da loja agora ficam em `config.js`** — um arquivo só, que vale para as
duas páginas.

---

## Paleta de cores
Definida no topo do `index.html` e do `garantia-e-cuidados.html`, no bloco `:root`.
As duas páginas usam os mesmos nomes — mudou lá, mudou no site inteiro.

| nome | hex | onde aparece |
|---|---|---|
| Creme | `#EEE4DA` | fundos claros, círculos de categoria |
| Vanilla Silk | `#FAF6F0` | fundo das seções e do rodapé |
| Sand | `#D8C4AC` | fim dos degradês, etiqueta "novo" |
| Alpine Oat | `#E0D7C8` | bordas e tabelas |
| Dusty Pink | `#C8A49F` | banner de presentes, detalhes |
| Warm Greige | `#B9AEA4` | textos de apoio |
| Cherry Velvet | `#6E1A23` | **cor de destaque** — links, preços, botões |
| Burgundy | `#4D0E13` | faixas escuras, hover dos botões |
| Bordeaux Noir | `#3B1219` | texto principal, barra do topo, newsletter |

O verde do WhatsApp (`#25D366`) ficou de fora de propósito: é a cor da marca do
aplicativo e mudar atrapalha o reconhecimento do botão.

## Prévia de publicação
As alterações devem ser publicadas no mesmo endereço:
https://h-maria-karol-previa.lucasjandrey.chatgpt.site/

Projeto Sites: `appgprj_6abcdb8b5f1c8191aebdc23a871f6318`.
O checkout de publicação fica em `.site-publish`; a configuração está em
`.site-publish/.openai/hosting.json` e os arquivos publicados em `.site-publish/dist`.
A prévia contém melhorias anteriores que ainda não estão nos HTML da raiz.
Ao publicar, atualize o checkout e aplique as alterações solicitadas preservando essas melhorias.
