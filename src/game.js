import { todasAsFases } from './data/fases.js';
import { embaralhar, rolarD20 } from './utils/random.js';

export class Game {
    constructor() {
        this.pontos = 100;
        this.faseAtual = 0;
        this.rolagemEmAndamento = false;
        this.fasesSorteadas = [];
        this.onStateChange = null;
    }

    setStateHandler(handler) {
        this.onStateChange = handler;
    }

    notificar() {
        if (typeof this.onStateChange === 'function') {
            this.onStateChange({
                pontos: this.pontos,
                faseAtual: this.faseAtual,
                fasesSorteadas: this.fasesSorteadas,
                rolagemEmAndamento: this.rolagemEmAndamento,
            });
        }
    }

    iniciarJogo() {
        this.faseAtual = 0;
        this.pontos = 100;
        this.rolagemEmAndamento = false;
        const fasesDeEscolha = todasAsFases.filter((fase) => fase.tipo === 'escolha');
        const fasesDeDado = todasAsFases.filter((fase) => fase.tipo === 'normal');
        const faseInicialAnterior = this.fasesSorteadas[0];
        const fasesPossiveisParaInicio = fasesDeEscolha.filter((fase) => fase !== faseInicialAnterior);
        const faseInicial = embaralhar([...fasesPossiveisParaInicio])[0];
        const escolhasSorteadas = embaralhar(
            fasesDeEscolha.filter((fase) => fase !== faseInicial)
        ).slice(0, 12);
        const fasesComDadoSorteadas = embaralhar([...fasesDeDado]).slice(0, 7);
        this.fasesSorteadas = [
            faseInicial,
            ...embaralhar([...escolhasSorteadas, ...fasesComDadoSorteadas]),
        ];
        this.notificar();
    }

    avancarFase() {
        this.faseAtual += 1;
        this.notificar();
    }

    responderEscolha(indexEscolhido, fase) {
        const acertou = indexEscolhido === fase.respostaCorreta;

        if (acertou) {
            this.pontos += 15;
        } else {
            this.pontos -= 10;
        }

        this.notificar();
        return acertou;
    }

    processarResultado(fase, dado) {
        if (dado > 15) {
            this.pontos += fase.pontosSucesso;
            return { venceu: true, texto: fase.sucessoText, tipo: 'sucesso' };
        }

        this.pontos -= fase.pontosFalha;
        return { venceu: false, texto: fase.falhaText, tipo: 'falha' };
    }

    rolarResultado() {
        return rolarD20();
    }

    getFaseAtual() {
        return this.fasesSorteadas[this.faseAtual];
    }
}
