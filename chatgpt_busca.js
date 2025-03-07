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
    
    // Se o campo estiver vazio, remove os destaques e reseta as variáveis
    if (!termoBusca) {
        doc.querySelectorAll(".highlight").forEach(span => {
            const textoOriginal = doc.createTextNode(span.textContent);
            span.replaceWith(textoOriginal);
        });
        currentSearch = "";
        resultados = [];
        indiceAtual = -1;
        return;
    }
    
    // Se a busca for diferente da última, atualiza o termo e zera os resultados
    if (termoBusca !== currentSearch) {
        currentSearch = termoBusca;
        resultados = [];
        indiceAtual = -1;
    }
    
    // Remove todos os destaques anteriores antes de buscar
    doc.querySelectorAll(".highlight").forEach(span => {
        const textoOriginal = doc.createTextNode(span.textContent);
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
            const regex = new RegExp(`(${termoBusca})`, "gi"); // Case insensitive
            const fragment = doc.createDocumentFragment();
    
            node.nodeValue.split(regex).forEach(part => {
                if (part.match(new RegExp(termoBusca, "gi"))) { // Verifica match independente de maiúsc/minúsc
                    const span = doc.createElement("span");
                    span.className = "highlight";
                    span.style.backgroundColor = "#00ff00"; // Verde neon
                    span.style.color = "#000000"; // Texto preto
                    span.textContent = part;
                    resultados.push(span);
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(doc.createTextNode(part));
                }
            });
    
            node.replaceWith(fragment);
        } else if (node.nodeType === 1 && !["script", "style"].includes(node.tagName.toLowerCase())) {
            Array.from(node.childNodes).forEach(destacarTexto);
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

// Aguarda o carregamento do DOM e adiciona os event listeners
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const btnBuscar = document.getElementById("btnBuscar");
    
    function avancarResultado() {
        if (resultados.length === 0) {
            buscarNoManual(); // Realiza a busca se não houver resultados
        } else {
            // Avança para a próxima palavra destacada
            indiceAtual = (indiceAtual + 1) % resultados.length;
            resultados[indiceAtual].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
    
    // Evento para o input (Enter e input para mobile)
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            avancarResultado();
        }
    });
    
    searchInput.addEventListener("input", function () {
        if (searchInput.value.trim() === "") {
            buscarNoManual();
        }
    });
    
    // Evento para o botão de buscar (click e touchend para mobile)
    btnBuscar.addEventListener("click", function (event) {
        event.preventDefault();
        avancarResultado();
    });
    
    btnBuscar.addEventListener("touchend", function (event) {
        event.preventDefault();
        avancarResultado();
    });
});



// Botão "Voltar ao Topo"
document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.getElementById("backToTop");
    if (backToTopButton) {
        backToTopButton.style.display = "block";
        backToTopButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        window.addEventListener('scroll', () => {
            backToTopButton.style.display = 'block';
        });
    }
});
