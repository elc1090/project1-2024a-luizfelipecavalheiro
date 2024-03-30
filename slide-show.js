function prevSlide(slideContainerId) {
    const slideContainer = document.getElementById(slideContainerId);
    const slides = slideContainer.querySelector('.slides');
    const moveAmount = 200; 

    let position = parseInt(slides.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
    position += moveAmount;
    const maxPosition = 0;

    if (position > maxPosition) {
        // Verifica se a nova posição após o movimento é maior que 0
        // Se for, ajusta a posição para exibir completamente a primeira imagem
        position = maxPosition;
    } else if (position < -(slides.scrollWidth - slides.offsetWidth)) {
        // Se a nova posição após o movimento for menor que o deslocamento necessário para exibir completamente a última imagem
        // Ajusta a posição para exibir completamente a última imagem
        position = -(slides.scrollWidth - slides.offsetWidth);
    }

    slides.style.transform = `translateX(${position}px)`;
}


function nextSlide(slideContainerId) {
    const slideContainer = document.getElementById(slideContainerId);
    const slides = slideContainer.querySelector('.slides');
    const moveAmount = 200; 

    let position = parseInt(slides.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
    position -= moveAmount;
    const minPosition = -(slides.scrollWidth - slides.offsetWidth);
    
    if (minPosition < 0 && position < minPosition) {
        // Verifica se o deslocamento total é menor que a largura do contêiner de slides
        // Se não for, e a nova posição após o movimento for menor que o deslocamento necessário para exibir completamente a última imagem
        // Ajusta a posição para exibir completamente a última imagem
        position = minPosition;
    } else if (position > 0) {
        // Se a nova posição após o movimento for maior que 0, volta ao início
        position = 0;
    }

    slides.style.transform = `translateX(${position}px)`;
}


// Função para ajustar o tamanho do contêiner de slides para acomodar a última imagem completamente
function adjustSlideContainerWidth(slideContainerId) {
    const slideContainer = document.getElementById(slideContainerId);
    const slides = slideContainer.querySelector('.slides');
    const images = slides.querySelectorAll('img');

    let totalWidth = 0;
    images.forEach(function(image) {
        totalWidth += image.clientWidth;
    });

    slides.style.width = totalWidth + 'px';
}

// Adicione touch events aos contêineres de slides desejados
addTouchEvents('slidesAgtech');
addTouchEvents('slidesSoftwareHardware');

// Ajuste o tamanho do contêiner de slides após o carregamento das imagens
window.onload = function() {
    adjustSlideContainerWidth('slidesAgtech');
    adjustSlideContainerWidth('slidesSoftwareHardware');
};

var currentPopup = null;

function showPopup(popupId, image) {
    var popup = document.getElementById(popupId);
    
    // Verificar se o popup atual é o mesmo que está sendo exibido
    if (currentPopup === popup) {
        // Se for o mesmo popup, fechar
        popup.style.display = "none";
        currentPopup = null;
    } else {
        // Fechar o popup atual, se houver
        if (currentPopup) {
            currentPopup.style.display = "none";
        }
        // Abrir o novo popup
        popup.style.display = "block";

        // Verificar se é um dispositivo móvel
        if (window.innerWidth <= 768) { // Por exemplo, considerando dispositivos móveis com largura até 768 pixels
            // Posicionar o popup abaixo da imagem
            var imageRect = image.getBoundingClientRect();
            var imageBottom = imageRect.bottom + window.pageYOffset; // Posição inferior da imagem na viewport
            var popupHeight = popup.offsetHeight; // Altura do popup
            popup.style.top = (imageBottom + 10) + "px"; // Ajuste de espaçamento
            popup.style.left = "50%";
            popup.style.transform = "translateX(-50%)"; // Centralizar horizontalmente
            popup.style.width = "80%"; // Definir a largura do popup
        } else {
             // Obter as coordenadas da imagem em relação à viewport
            var imageRect = image.getBoundingClientRect();
            var imageTop = imageRect.top + window.pageYOffset; // Posição superior da imagem na viewport
            var imageHeight = imageRect.height; // Altura da imagem

            // Posicionar o popup abaixo da imagem
            popup.style.top = (imageTop + imageHeight) + "px";
            popup.style.left = imageRect.left + "px";

        }
        currentPopup = popup;
    }
}
