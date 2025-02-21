let resultados = []; // Lista de elementos destacados
let indiceAtual = -1; // Índice do destaque atual
let currentSearch = "";    // Armazena o termo da última busca

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
    if (termoBusca !== currentSearch) {
        currentSearch = termoBusca;
        resultados = [];
        indiceAtual = -1;}
    // Se a busca for diferente da última, zera os resultados
 
    // Remove todos os destaques anteriores antes de buscar
    doc.querySelectorAll(".highlight").forEach(span => {
        const textoOriginal = document.createTextNode(span.textContent);
        span.replaceWith(textoOriginal);
    });

    // Zera os resultados antes de uma nova busca
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

    // Se houver resultados, rola para o primeiro
    if (resultados.length > 0) {
        indiceAtual = 0;
        resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        alert("Palavra não encontrada no manual.");
    }
}

// Captura ENTER para buscar e navegar pelos resultados
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        if (resultados.length === 0) {
            buscarNoManual(); // Realiza a busca apenas se não houver resultados
        } else {
            // Avança para a próxima palavra destacada
            indiceAtual = (indiceAtual + 1) % resultados.length;
            resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
});

// Define fundo branco no iframe
document.getElementById("manualFrame").addEventListener("load", function () {
    const iframeDoc = this.contentWindow.document;
    iframeDoc.body.style.background = "white";
});

// ----- Botão "Voltar ao Topo" -----
document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.getElementById("backToTop");

    // Garante que o botão fique sempre visível
    backToTopButton.style.display = "block";

    // Ao clicar, rola suavemente para o topo da página
    backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Exibe o botão quando a página é rolada mais de 200px
    window.addEventListener('scroll', () => {
        backToTopButton.style.display = 'block';
    });
});

