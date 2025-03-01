let resultados = []; // Lista de elementos destacados
let indiceAtual = -1; // Índice do destaque atual
let currentSearch = ""; // Armazena o termo da última busca

function buscarNoManual() {
    const termoBusca = document.getElementById("searchInput").value.trim();
    const iframe = document.getElementById("manualFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    if (!doc) {
        alert("Erro ao acessar o manual.");
        return;
    }
    
    // Limpa busca se campo estiver vazio
    if (!termoBusca) {
        doc.querySelectorAll(".highlight").forEach(span => {
            span.replaceWith(doc.createTextNode(span.textContent));
        });
        currentSearch = "";
        resultados = [];
        indiceAtual = -1;
        return;
    }
    
    // Reinicia busca se termo mudar
    if (termoBusca !== currentSearch) {
        currentSearch = termoBusca;
        resultados = [];
        indiceAtual = -1;
    }
    
    // Remove destaques antigos
    doc.querySelectorAll(".highlight").forEach(span => {
        span.replaceWith(doc.createTextNode(span.textContent));
    });
    
    // Função de destaque com cor fixa
    function destacarTexto(node) {
        if (node.nodeType === 3) { // Nó de texto
            const regex = new RegExp(`(${termoBusca})`, "gi");
            const fragment = doc.createDocumentFragment();

            node.nodeValue.split(regex).forEach(part => {
                if (part.toLowerCase() === termoBusca.toLowerCase()) {
                    const span = doc.createElement("span");
                    span.className = "highlight";
                    span.style.backgroundColor = "#00ffff"; // Cor fixa
                    span.textContent = part;
                    resultados.push(span);
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(doc.createTextNode(part));
                }
            });

            node.replaceWith(fragment);
        } else if (node.nodeType === 1) { // Element node
            node.childNodes.forEach(destacarTexto);
        }
    }
    
    destacarTexto(doc.body);
    
    // Navegação inicial
    if (resultados.length > 0) {
        indiceAtual = 0;
        resultados[indiceAtual].scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
        });
    } else {
        alert("Palavra não encontrada no manual.");
    }
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const btnBuscar = document.getElementById("btnBuscar");
    
    function avancarResultado() {
        if (resultados.length === 0) return;
        indiceAtual = (indiceAtual + 1) % resultados.length;
        resultados[indiceAtual].scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
        });
    }

    // Controles de busca
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarNoManual();
        }
    });

    btnBuscar.addEventListener("click", (e) => {
        e.preventDefault();
        buscarNoManual();
    });

    // Botão Voltar ao Topo
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});
