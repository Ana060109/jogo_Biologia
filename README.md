# A Busca pelo Elemento X

Jogo em estilo RPG de texto com tema de ciência, radioatividade e história da química.

## Estrutura

- `index.html` — página principal
- `src/styles.css` — estilos visuais do jogo
- `src/main.js` — fluxo principal da aplicação
- `src/game.js` — regra de negócio e estado do jogo
- `src/ui.js` — funções de renderização e manipulação da tela
- `src/data/fases.js` — banco de fases e missões
- `src/utils/random.js` — utilitários de aleatoriedade

## Como rodar

1. Acesse a pasta do projeto.
2. Inicie um servidor estático, por exemplo:

```bash
python -m http.server 8000
```

3. Abra no navegador:

```text
http://localhost:8000/index.html
```

## Fases do jogo

Cada partida tem 20 fases: 13 desafios de múltipla escolha, incluindo identificação, biologia e segurança radiológica, e 7 fases resolvidas com o dado de 20 lados. A primeira fase é sempre uma pergunta escolhida aleatoriamente, diferente da pergunta inicial da partida anterior.

## Observação

A estrutura foi separada em módulos para facilitar manutenção, testes e futuras evoluções do projeto no GitHub.
A trilha sonora pertence ao jogo que se chama "Space Harrier OST Track 1" de 1985.
