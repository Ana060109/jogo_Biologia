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

    if (tipo === 'inicio') {
        elArt.innerText = "   ___   \n  |   |  \n  |___|  \n /     \\ \n/_______\\";
    } else if (tipo === 'sucesso') {
        elArt.innerText = "   .*.   \n  (   )  \n  |___|  \n / *   \\ \n/_______\\";
        elArt.className = 'ascii-art good-event blink';
    } else if (tipo === 'falha') {
        elArt.innerText = "  \\ | /  \n --BOOM--\n  / | \\  \n   _|_   \n  /___\\  ";
        elArt.className = 'ascii-art bad-event';
    }

    setTimeout(() => {
        elArt.className = 'ascii-art';
    }, 1500);
}
