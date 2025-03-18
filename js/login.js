const SENHA_CORRETA = "lua123";

function verificarSenha() {
    const senha = document.getElementById('senhaInput').value;
    const mensagemErro = document.getElementById('mensagemErro');
    
    if(senha === SENHA_CORRETA) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('matrixCanvas').style.display = 'block';
        sessionStorage.setItem('autenticado', 'true');
    } else {
        mensagemErro.style.display = 'block';
        setTimeout(() => mensagemErro.style.display = 'none', 2000);
    }
}

window.onload = function() {
    if(!sessionStorage.getItem('autenticado')) {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
        document.getElementById('matrixCanvas').style.display = 'none';
    }
}

document.getElementById('senhaInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verificarSenha();
});