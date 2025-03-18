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

// Sistema de busca para o manual
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    let mensagemContainer;

    // Criar container para mensagens
    function criarMensagemContainer() {
        mensagemContainer = document.createElement('div');
        mensagemContainer.id = 'mensagemBusca';
        mensagemContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(mensagemContainer);
    }

    function mostrarMensagem(texto, tipo) {
        mensagemContainer.textContent = texto;
        mensagemContainer.style.backgroundColor = tipo === 'erro' ? '#ff000099' : '#00ff0099';
        mensagemContainer.style.color = tipo === 'erro' ? '#fff' : '#000';
        mensagemContainer.style.display = 'block';
        
        setTimeout(() => {
            mensagemContainer.style.display = 'none';
        }, 3000);
    }

    function realizarBusca() {
        const termo = searchInput.value.toLowerCase().trim();
        
        if (!termo) {
            mostrarMensagem('Digite algo para buscar', 'erro');
            return;
        }

        const iframe = document.getElementById('manualFrame');
        if (!iframe) {
            mostrarMensagem('Erro ao acessar o manual', 'erro');
            return;
        }

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) {
            mostrarMensagem('Erro ao acessar o conteúdo do manual', 'erro');
            return;
        }

        // Limpar highlights anteriores
        const destaques = iframeDoc.querySelectorAll('.highlight');
        destaques.forEach(el => el.outerHTML = el.innerHTML);

        let encontrouResultado = false;

        function buscarTexto(node) {
            if (node.nodeType === 3) { // Nó de texto
                const texto = node.nodeValue.toLowerCase();
                if (texto.includes(termo)) {
                    encontrouResultado = true;
                    const span = iframeDoc.createElement('span');
                    span.className = 'highlight';
                    span.innerHTML = node.nodeValue.replace(
                        new RegExp(termo, 'gi'),
                        match => `<mark>${match}</mark>`
                    );
                    node.parentNode.replaceChild(span, node);
                }
            } else {
                Array.from(node.childNodes).forEach(buscarTexto);
            }
        }

        // Inicia busca no corpo do documento
        buscarTexto(iframeDoc.body);

        // Scroll até primeiro resultado
        const primeiroResultado = iframeDoc.querySelector('.highlight');
        if (primeiroResultado) {
            primeiroResultado.scrollIntoView({ behavior: 'smooth' });
            mostrarMensagem('Resultado encontrado', 'sucesso');
        } else {
            mostrarMensagem('Nenhum resultado encontrado', 'erro');
        }
    }

    // Eventos de busca
    btnBuscar.addEventListener('click', realizarBusca);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusca();
    });

    criarMensagemContainer();
});

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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    
    // Função para destacar o texto encontrado
    function destacarTexto(texto, termo) {
        const regex = new RegExp(`(${termo})`, 'gi');
        return texto.replace(regex, '<mark>$1</mark>');
    }

    // Função principal de busca
    function buscar() {
        const termo = searchInput.value.trim().toLowerCase();
        if (!termo) {
            alert('Digite algo para buscar');
            return;
        }

        const iframe = document.getElementById('manualFrame');
        
        // Garantir que o iframe está carregado
        if (!iframe.contentWindow.document.body) {
            alert('Aguarde o carregamento do manual...');
            return;
        }

        // Obter todo o conteúdo do iframe
        const conteudo = iframe.contentWindow.document.body;
        
        // Limpar destaques anteriores
        const destaques = conteudo.querySelectorAll('mark');
        destaques.forEach(mark => {
            const texto = mark.textContent;
            mark.outerHTML = texto;
        });

        // Procurar em todo o conteúdo
        const elementos = conteudo.getElementsByTagName('*');
        let encontrados = 0;

        for (let elemento of elementos) {
            if (elemento.childNodes.length === 1 && elemento.childNodes[0].nodeType === 3) {
                const textoOriginal = elemento.textContent;
                if (textoOriginal.toLowerCase().includes(termo)) {
                    elemento.innerHTML = destacarTexto(textoOriginal, termo);
                    encontrados++;
                }
            }
        }

        // Feedback para o usuário
        if (encontrados > 0) {
            const primeiro = conteudo.querySelector('mark');
            if (primeiro) {
                primeiro.scrollIntoView({ behavior: 'smooth' });
            }
            alert(`Encontrados ${encontrados} resultados para "${termo}"`);
        } else {
            alert(`Nenhum resultado encontrado para "${termo}"`);
        }
    }

    // Eventos de busca
    btnBuscar.addEventListener('click', buscar);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscar();
    });
});
