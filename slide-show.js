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

// Função para rolar para o topo da página
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Exibir o botão "Voltar ao Topo" quando o usuário rolar a página para baixo
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("btnVoltarAoTopo").style.display = "block";
        console.log("Botão 'Voltar ao Topo' exibido.");
    } else {
        document.getElementById("btnVoltarAoTopo").style.display = "none";
        console.log("Botão 'Voltar ao Topo' ocultado.");
    }
};

// Adicionar evento de clique ao botão "Voltar ao Topo"
document.getElementById("btnVoltarAoTopo").addEventListener("click", function() {
    scrollToTop();
});

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

        // Obter as coordenadas da imagem em relação à viewport
        var imageRect = image.getBoundingClientRect();
        var imageTop = imageRect.top + window.pageYOffset; // Posição superior da imagem na viewport
        var imageHeight = imageRect.height; // Altura da imagem

        // Posicionar o popup abaixo da imagem
        popup.style.top = (imageTop + imageHeight) + "px";
        popup.style.left = imageRect.left + "px";

        currentPopup = popup;
    }
}

// Adicionar um event listener ao documento inteiro para fechar o popup quando o usuário clicar fora dele
document.addEventListener('click', function(event) {
    var clickedImg = event.target.closest('img[data-popup-id]');
    var popupContainer = event.target.closest('.popup-container');
    
    if (!clickedImg && !popupContainer) {
        // Se o clique não ocorreu em uma imagem com popup ou dentro de um popup, fechar o popup atual, se houver
        if (currentPopup) {
            currentPopup.style.display = "none";
            currentPopup = null;
        }
    }
});