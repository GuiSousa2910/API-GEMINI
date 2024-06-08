var espressaoBooleana = false;

function abilitar() {
    var informacao = userInput.value;

    if (informacao == '') {
        espressaoBooleana = false;
    } else {
        espressaoBooleana = true;
    }
}

function verificar() {
    if (espressaoBooleana) {
        document.getElementById('sendButton').removeAttribute('disabled');
    }
    else {
        document.getElementById('sendButton').setAttribute('disabled', true);
    }
}

// window.validaEcookie = {
//     Fazcookie
// }