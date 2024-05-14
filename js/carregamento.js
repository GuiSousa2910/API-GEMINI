function apagar() {
    document.getElementById('tudao').style.paddingBottom = '5%';
    document.getElementById('carregamento').style.display = 'none';
    document.getElementById('response').style.display = 'none';
}

function carregar() {
    document.getElementById('carregamento').style.display = 'flex';
    document.getElementById('response').style.display = 'none';
    document.getElementById('tudao').style.paddingBottom = '0%';
}