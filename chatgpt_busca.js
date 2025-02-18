let resultados = []; // Lista de elementos destacados
let indiceAtual = -1; // Índice do destaque atual

function buscarNoManual() {
    const termoBusca = document.getElementById("searchInput").value.trim();
    if (!termoBusca) {
        alert("Digite uma palavra para buscar!");
        return;
    }

    const iframe = document.getElementById("manualFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    if (!doc) {
        alert("Erro ao acessar o manual.");
        return;
    }

    // **🔴 REMOVE TODOS OS DESTAQUES ANTERIORES ANTES DE BUSCAR**
    doc.querySelectorAll(".highlight").forEach(span => {
        const textoOriginal = document.createTextNode(span.textContent);
        span.replaceWith(textoOriginal);
    });

    // **🔵 ZERA OS RESULTADOS ANTES DE UMA NOVA BUSCA**
    resultados = [];
    indiceAtual = -1;

    // Define cores para alternar nos destaques
    const cores = ["yellow", "lightblue", "lightgreen", "orange", "pink"];
    let corAtual = 0;

    function destacarTexto(node) {
        if (node.nodeType === 3) { // Nó de texto
            const regex = new RegExp(`(${termoBusca})`, "gi");
            const fragment = document.createDocumentFragment();

            node.nodeValue.split(regex).forEach(part => {
                if (part.toLowerCase() === termoBusca.toLowerCase()) {
                    const span = document.createElement("span");
                    span.className = "highlight";
                    span.style.backgroundColor = cores[corAtual % cores.length];
                    span.textContent = part;
                    resultados.push(span); // Salva o destaque na lista
                    corAtual++;
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            });

            node.replaceWith(fragment);
        } else {
            node.childNodes.forEach(destacarTexto);
        }
    }

    destacarTexto(doc.body);

    // **Se houver resultados, rola para o primeiro**
    if (resultados.length > 0) {
        indiceAtual = 0;
        resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        alert("Palavra não encontrada no manual.");
    }
}

// **🔵 CAPTURA ENTER PARA BUSCAR E NAVEGAR PELOS RESULTADOS**
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        if (resultados.length === 0) {
            buscarNoManual(); // **Realiza a busca apenas se não houver resultados**
        } else {
            // **Avança para a próxima palavra destacada**
            indiceAtual = (indiceAtual + 1) % resultados.length;
            resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
});

// **🔴 REMOVE DESTAQUES QUANDO CLICAR FORA DO INPUT**
document.addEventListener("click", function (event) {
    const inputBusca = document.getElementById("searchInput");
    if (event.target !== inputBusca) {  // Apenas remove se NÃO estiver clicando no input
        const iframe = document.getElementById("manualFrame");
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        if (!doc) return; // Evita erro se o iframe não estiver carregado

        doc.querySelectorAll(".highlight").forEach(span => {
            const textoOriginal = document.createTextNode(span.textContent);
            span.replaceWith(textoOriginal);
        });

        resultados = []; // Limpa a lista de palavras destacadas
        indiceAtual = -1; // Reseta índice de navegação
    }
});

// **EXIBE O BOTÃO "VOLTAR AO TOPO" SEMPRE VISÍVEL**
document.getElementById("backToTop").style.display = 'block';

// **ALINHA O BOTÃO MAIS PARA CIMA (OPCIONAL)**
document.getElementById("backToTop").style.bottom = "50%";

document.getElementById("manualFrame").onload = function() {
    const iframeDoc = document.getElementById("manualFrame").contentWindow.document;
    iframeDoc.body.style.background = "white";
};
