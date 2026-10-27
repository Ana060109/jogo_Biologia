import { Game } from './game.js';
import { criarBotaoOpcao, atualizarIndicadores, mudarArte } from './ui.js';

const game = new Game();

const elHistoria = document.getElementById('historia');
const elQuiz = document.getElementById('quiz-options');
const elDado = document.getElementById('resultado-dado');
const elBtnAcao = document.getElementById('btn-acao');
const elAudio = document.getElementById('trilha-sonora');
const elBtnMusica = document.getElementById('btn-musica');
const elEstadoMusica = document.getElementById('estado-musica');

let musicaLigada = true;
let primeiraReproducao = true;
let aguardandoMetadados = false;

function atualizarBotaoMusica() {
    const textoAcao = musicaLigada ? 'Desligar música' : 'Ligar música';
    elBtnMusica.setAttribute('aria-pressed', String(musicaLigada));
    elBtnMusica.setAttribute('aria-label', textoAcao);
    elBtnMusica.title = textoAcao;
    elEstadoMusica.innerText = `MÚSICA ${musicaLigada ? 'LIGADA' : 'DESLIGADA'}`;
    elBtnMusica.classList.toggle('is-muted', !musicaLigada);
}

function tocarMusica() {
    if (!musicaLigada) return;

    if (elAudio.readyState < HTMLMediaElement.HAVE_METADATA) {
        if (!aguardandoMetadados) {
            aguardandoMetadados = true;
            elAudio.addEventListener('loadedmetadata', () => {
                aguardandoMetadados = false;
                tocarMusica();
            }, { once: true });
        }
        return;
    }

    elAudio.play().then(() => {
        if (musicaLigada && primeiraReproducao) {
            elAudio.currentTime = 5;
            primeiraReproducao = false;
        }
    }).catch((erro) => {
        if (erro.name !== 'NotAllowedError' && erro.name !== 'AbortError') {
            console.error('Não foi possível reproduzir a trilha sonora.', erro);
        }
    });
}

elAudio.addEventListener('ended', () => {
    if (!musicaLigada) return;

    elAudio.currentTime = 5;
    tocarMusica();
});

elBtnMusica.addEventListener('click', () => {
    musicaLigada = !musicaLigada;
    atualizarBotaoMusica();

    if (musicaLigada) {
        tocarMusica();
    } else {
        elAudio.pause();
    }
});

elBtnAcao.addEventListener('click', tocarMusica);

function atualizarUI() {
    atualizarIndicadores({
        pontos: game.pontos,
        faseAtual: game.faseAtual,
        fasesSorteadas: game.fasesSorteadas,
    });
}

function carregarFase() {
    const fase = game.getFaseAtual();
    elHistoria.innerHTML = `<strong>${fase.titulo}</strong><br><br>${fase.descricao}`;
    elDado.innerHTML = '';

    if (fase.tipo === 'descoberta') {
        elBtnAcao.style.display = 'none';
        elQuiz.style.display = 'flex';
        elQuiz.innerHTML = '';

        fase.opcoes.forEach((opcao, index) => {
            const btn = criarBotaoOpcao(opcao, () => responderDescoberta(index, fase));
            elQuiz.appendChild(btn);
        });
    } else {
        elQuiz.style.display = 'none';
        elBtnAcao.style.display = 'block';
        elBtnAcao.innerText = fase.acao;
        elBtnAcao.onclick = rolarDado;
        elBtnAcao.disabled = false;
    }
}

function responderDescoberta(indexEscolhido, fase) {
    elQuiz.style.display = 'none';
    elBtnAcao.style.display = 'block';

    const acertou = game.responderDescoberta(indexEscolhido, fase);

    if (acertou) {
        elHistoria.innerHTML += `<br><br><span class="good-event">${fase.msgAcerto} (+15 Pts de Intuição)</span><br>Agora teste o experimento.`;
    } else {
        elHistoria.innerHTML += `<br><br><span class="bad-event">${fase.msgErro} (-10 Pts de Intuição)</span><br>Avance e teste o experimento mesmo assim.`;
    }

    atualizarUI();
    elBtnAcao.innerText = fase.acao;
    elBtnAcao.onclick = rolarDado;
    elBtnAcao.disabled = false;
}

function rolarDado() {
    if (game.rolagemEmAndamento) return;
    game.rolagemEmAndamento = true;
    elBtnAcao.disabled = true;

    const fase = game.getFaseAtual();

    if (!elHistoria.innerHTML.includes('Pts de Intuição')) {
        elHistoria.innerHTML = '<em>Iniciando maquinário do experimento...</em>';
    }

    let counter = 0;
    const intervalo = setInterval(() => {
        const numAleatorio = Math.floor(Math.random() * 20) + 1;
        elDado.innerHTML = `Rolando D20: <span class="blink">[ ${numAleatorio} ]</span>`;
        counter += 1;

        if (counter > 15) {
            clearInterval(intervalo);
            const resultadoFinal = game.rolarResultado();
            processarResultado(resultadoFinal, fase);
        }
    }, 80);
}

function processarResultado(dado, fase) {
    const resultado = game.processarResultado(fase, dado);
    const classeCores = resultado.tipo === 'sucesso' ? 'good-event' : 'bad-event';

    elHistoria.innerHTML = `<span class="${classeCores}">${resultado.texto}</span>`;
    elDado.innerHTML = `Resultado D20: <span class="${classeCores}">[ ${dado} ]</span>`;
    mudarArte(resultado.tipo);
    atualizarUI();

    setTimeout(() => {
        verificarFimDeJogo();
    }, 1200);
}

function verificarFimDeJogo() {
    elQuiz.style.display = 'none';
    elBtnAcao.style.display = 'block';

    if (game.pontos <= 0) {
        const faseAtualInfo = game.getFaseAtual();
        elHistoria.innerHTML = `<span class="bad-event">FIM DE JOGO! VOCÊ MORREU.</span><br><br>${faseAtualInfo.morteText}<br><br>Seus pontos chegaram a zero. A ciência exige sacrifícios e, desta vez, ele foi fatal.`;
        elBtnAcao.innerText = 'TENTAR NOVAMENTE';
        elBtnAcao.onclick = iniciarJogo;
        mudarArte('inicio');
        elBtnAcao.disabled = false;
        game.rolagemEmAndamento = false;
        return;
    }

    game.avancarFase();

    if (game.faseAtual >= game.fasesSorteadas.length) {
        elHistoria.innerHTML = `<span class="good-event">VITÓRIA DA CIÊNCIA!</span><br><br>Parabéns, Dra. Lídia! Você expandiu os horizontes da Tabela Periódica contra todas as probabilidades estatísticas (e o machismo da época). Seu legado perdurará para sempre!<br><br>Pontuação Final: ${game.pontos}`;
        elBtnAcao.innerText = 'JOGAR NOVAMENTE (NOVA ORDEM)';
        elBtnAcao.onclick = iniciarJogo;
        mudarArte('inicio');
        atualizarBotaoMusica();
        elBtnAcao.disabled = false;
        game.rolagemEmAndamento = false;
        return;
    }

    elBtnAcao.innerText = 'AVANÇAR PESQUISA';
    elBtnAcao.onclick = () => {
        carregarFase();
        elBtnAcao.disabled = false;
        game.rolagemEmAndamento = false;
    };
    elBtnAcao.disabled = false;
}

function iniciarJogo() {
    game.iniciarJogo();
    mudarArte('inicio');
    elDado.innerHTML = '';
    atualizarUI();
    carregarFase();
}

game.setStateHandler(() => {
    atualizarUI();
});

elBtnAcao.onclick = iniciarJogo;
mudarArte('inicio');
