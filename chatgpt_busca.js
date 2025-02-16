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
        span.parentNode.replaceChild(textoOriginal, span);
    });

    // Cores para alternar no destaque
    const cores = ["yellow", "lightblue", "lightgreen", "orange", "pink"];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

    // Destacar a palavra e adicionar efeito visual
    let bodyText = doc.body.innerHTML;
    const regex = new RegExp(`(${termoBusca})`, "gi");
    const novoTexto = bodyText.replace(regex, `<span class="highlight" style="background-color: ${corAleatoria};">$1</span>`);
    doc.body.innerHTML = novoTexto;

    // Encontra a primeira ocorrência e rola até ela
    const primeiroResultado = doc.querySelector(".highlight");
    if (primeiroResultado) {
        primeiroResultado.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        alert("Palavra não encontrada no manual.");
    }
}

// Adiciona um estilo CSS para destacar melhor as palavras
const style = document.createElement("style");
style.innerHTML = `
    .highlight {
        font-weight: bold;
        color: black;
        padding: 3px;
        border-radius: 5px;
        transition: all 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

