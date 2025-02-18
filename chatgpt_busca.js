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

    // Remove marcações anteriores
    doc.querySelectorAll(".highlight").forEach(span => {
        const textoOriginal = document.createTextNode(span.textContent);
        span.replaceWith(textoOriginal);
    });

    resultados = []; // Reinicia a lista de resultados

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

    // Se houver resultados, rola para o primeiro
    if (resultados.length > 0) {
        indiceAtual = 0;
        resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        alert("Palavra não encontrada no manual.");
    }
}

// Captura tecla Enter para navegar pelos resultados
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (resultados.length > 0) {
            indiceAtual = (indiceAtual + 1) % resultados.length; // Avança no ciclo de palavras encontradas
            resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            buscarNoManual(); // Faz a busca caso ainda não tenha sido feita
        }
    }
});

document.getElementById("manualFrame").onload = function() {
    const iframeDoc = document.getElementById("manualFrame").contentWindow.document;
    iframeDoc.body.style.background = "white";
};

// Exibe o botão "Voltar ao Topo" quando a página é rolada mais de 200px
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (window.pageYOffset > 200) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});
