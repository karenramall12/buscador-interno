// Função de busca no manual (dentro do iframe, se aplicável)
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
      span.parentNode.replaceChild(textoOrigina, span);
    });

  
    const cores = ["yellow", "lightblue", "lightgreen", "orange", "pink"];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
  
    // Destacar a palavra e adicionar efeito visual
    let bodyText = doc.body.innerHTML;
    const regex = new RegExp(`(${termoBusca})`, "gi");
    const novoTexto = bodyText.replace(regex, `<span class="highlight" style="background-color: ${corAleatoria};">$1</span>`);
    doc.body.innerHTML = novoTexto;
  
    const primeiroResultado = doc.querySelector(".highlight");
    if (primeiroResultado) {
      primeiroResultado.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      alert("Palavra não encontrada no manual.");
    }
  }
  
  // Adiciona um estilo CSS para os destaques (para o documento atual)
  const style = document.createElement("style");
  style.innerHTML = `
    mark.highlight {
      font-weight: bold;
      color: black;
      padding: 3px;
      border-radius: 5px;
      transition: all 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
  
  // Toggle do menu hamburger
  document.getElementById("hamburgerButton").addEventListener("click", function(e) {
    e.stopPropagation();
    document.getElementById("hamburgerMenu").classList.toggle("open");
  });
  
  // Toggle para cada categoria (submenus)
  document.querySelectorAll(".menu-category").forEach(function(category) {
    category.addEventListener("click", function(e) {
      e.stopPropagation();
      const targetId = this.getAttribute("data-target");
      document.getElementById(targetId).classList.toggle("open");
    });
  });
  
  // Fechar o menu e todos os submenus ao clicar fora
  document.addEventListener("click", function(e) {
    const menu = document.getElementById("hamburgerMenu");
    const button = document.getElementById("hamburgerButton");
    if (!menu.contains(e.target) && !button.contains(e.target)) {
      menu.classList.remove("open");
      document.querySelectorAll(".submenu").forEach(function(sub) {
        sub.classList.remove("open");
      });
    }
  });
  
  // Botão "Voltar ao Topo"
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.pageYOffset > 200 ? 'block' : 'none';
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Função de busca com destaque e navegação entre ocorrências no documento atual
  let currentHighlightIndex = -1;
  let highlights = [];
  
  document.getElementById("search").addEventListener("keyup", function(e) {
    // Se a tecla Enter for pressionada, navega entre as ocorrências
    if (e.key === "Enter") {
      if (highlights.length > 0) {
        currentHighlightIndex = (currentHighlightIndex + 1) % highlights.length;
        highlights[currentHighlightIndex].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      clearHighlights();
      const term = this.value.trim();
      if (term !== "") {
        highlights = highlightText(document.body, term);
        const resultadoBusca = document.getElementById("resultadoBusca");
        if (resultadoBusca) {
          resultadoBusca.textContent = `Encontradas ${highlights.length} ocorrências.`;
        }
        currentHighlightIndex = -1;
      } else {
        const resultadoBusca = document.getElementById("resultadoBusca");
        if (resultadoBusca) {
          resultadoBusca.textContent = "";
        }
      }
    }
  });
  
  function highlightText(element, term) {
    const regex = new RegExp(term, "gi");
    const marks = [];
    
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        let match;
        let lastIndex = 0;
        const frag = document.createDocumentFragment();
        let found = false;
        regex.lastIndex = 0;
        while ((match = regex.exec(text)) !== null) {
          found = true;
          const before = text.substring(lastIndex, match.index);
          if (before) frag.appendChild(document.createTextNode(before));
          const mark = document.createElement("mark");
          mark.className = "highlight";
          mark.textContent = match[0];
          frag.appendChild(mark);
          marks.push(mark);
          lastIndex = regex.lastIndex;
        }
        if (found) {
          const after = text.substring(lastIndex);
          if (after) frag.appendChild(document.createTextNode(after));
          node.parentNode.replaceChild(frag, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !["SCRIPT", "STYLE"].includes(node.tagName)) {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(element);
    return marks;
  }
  
  function clearHighlights() {
    document.querySelectorAll("mark.highlight").forEach(function(mark) {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    highlights = [];
    currentHighlightIndex = -1;
  }
  
  // Ajustar o background do body dentro do iframe (se mesmo domínio)
  window.addEventListener("load", function() {
    const iframe = document.querySelector(".iframe-container iframe");
    if (iframe) {
      iframe.addEventListener("load", function() {
        try {
          iframe.contentWindow.document.body.style.backgroundColor = "#fff";
        } catch (e) {
          console.log("Não foi possível acessar o conteúdo do iframe:", e);
        }
      });
    }
  });
  