export function criarBotaoOpcao(opcao, callback) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = `>> ${opcao}`;
    btn.onclick = callback;
    return btn;
}

export function atualizarIndicadores({ pontos, faseAtual, fasesSorteadas }) {
    const elPontos = document.getElementById('pontos');
    const elFase = document.getElementById('fase');

    if (elPontos) elPontos.innerText = pontos;
    if (elFase) {
        if (fasesSorteadas.length > 0 && faseAtual < fasesSorteadas.length) {
            elFase.innerText = `${faseAtual + 1}/${fasesSorteadas.length}`;
        } else {
            elFase.innerText = '-';
        }
    }
}

export function mudarArte(tipo) {
    const elArt = document.getElementById('art');
    if (!elArt) return;

    const asciiInicio = "   ___   \n  |   |  \n  |___|  \n /     \\ \n/_______\\";
    const asciiSucesso = "   .*.   \n  (   )  \n  |___|  \n / *   \\ \n/_______\\";
    const asciiFalha = "  \\ | /  \n --BOOM--\n  / | \\  \n   _|_   \n  /___\\  ";

    let ascii = asciiInicio;
    let classe = 'ascii-art';

    if (tipo === 'inicio') {
        ascii = asciiInicio;
    } else if (tipo === 'sucesso') {
        ascii = asciiSucesso;
        classe = 'ascii-art good-event blink';
    } else if (tipo === 'falha') {
        ascii = asciiFalha;
        classe = 'ascii-art bad-event';
    }

    elArt.className = classe;
    elArt.innerHTML = `
        <div class="art-scene">
            <pre class="ascii-graphic">${ascii}</pre>
            <img src="./src/personagem/ligia.png" alt="Personagem Lídia" class="personagem-efeito" />
        </div>
    `;

    setTimeout(() => {
        elArt.className = 'ascii-art';
    }, 1500);
}
