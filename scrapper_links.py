import requests
from bs4 import BeautifulSoup
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import os
from PIL import Image
from io import BytesIO
import urllib.parse

def scrape_image_links(url):
    # Realize uma solicitação GET para o site
    response = requests.get(url)
    
    # Verifique se a solicitação foi bem-sucedida (código de status 200)
    if response.status_code == 200:
        # Parseie o conteúdo HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Encontre todas as âncoras (links) na página
        anchors = soup.find_all('a', href=True)
        
        # Extraia os links das imagens
        image_links = []
        for anchor in anchors:
            href = anchor['href']
            img_tag = anchor.find('img')
            if href and img_tag:
                img_src = img_tag.get('src')
                if img_src and (img_src.endswith('.jpg') or img_src.endswith('.png') or img_src.endswith('.jpeg')):
                    image_links.append((href, urllib.parse.urljoin(url, img_src)))
        
        # Retorne os links das imagens e seus respectivos links relacionados
        return image_links
    else:
        print(f"Falha ao acessar o site: {url}")
        return None

def scrape_external_site(url):
    try:
        # Realize uma solicitação GET para o site externo
        response = requests.get(url, timeout=10)
        
        # Verifique se a solicitação foi bem-sucedida (código de status 200)
        if response.status_code == 200:
            # Parseie o conteúdo HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extrair URL, título e descrição do site externo (se disponíveis)
            external_url = url
            external_url.replace("https://","")
            external_title = soup.title.text.strip() if soup.title else ""
            
            # Verifique se o URL é do Facebook ou do Instagram
            if 'www.facebook.com' in external_url or 'www.instagram.com' in external_url:
                external_description = ""
            else:
                meta_description = soup.find('meta', attrs={'name': 'description'})
                external_description = meta_description['content'].strip() if meta_description else ""
            
            # Retorne as informações coletadas do site externo
            return {'url': external_url, 'title': external_title, 'description': external_description}
        else:
            print(f"Falha ao acessar o site externo: {url}")
            return None
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(f"Erro ao acessar o site externo: {url} - {e}")
        return None


# URL do site que você deseja raspar
url = 'https://www.ufsm.br/orgaos-suplementares/inovatec/startups'

# Chame a função scrape_image_links para coletar os links das imagens e seus links relacionados
image_links_with_external = scrape_image_links(url)

# Inicializa o conteúdo HTML para os popups
html_content = ""

# Imprima os links das imagens
if image_links_with_external:
    print("Total de imagens:", len(image_links_with_external))

    for idx, (external_link, image_link) in enumerate(image_links_with_external, 1):
        
        response = requests.get(image_link, timeout=10)
        if response.status_code == 200:
            # Visitando o site externo vinculado à imagem
            print("Visitar site externo vinculado à imagem...")
            external_info = scrape_external_site(external_link)
            if external_info:
                # Remove "https://" do início da URL para usar como ID
                popup_id = external_link.replace("https://", "")
                # Adiciona as informações coletadas ao conteúdo HTML dos popups
                popup_html = f"""
                <div class="popup-container" id="{popup_id}">
                    <p>{external_info['title']}</p>
                    <a href="{external_info['url']}" target="_blank">Visitar página</a>
                    <p>{external_info['description']}</p>
                </div>
                """
                html_content += popup_html
                print("Informações do site externo adicionadas ao HTML.")
            else:
                print("Nenhuma informação obtida do site externo.")   
            print("------------------------------------------------------\n")   
                
else:
    print("Nenhuma imagem encontrada.")

from bs4 import BeautifulSoup

# Ler o conteúdo atual do arquivo index.html
with open("index.html", "r", encoding="utf-8") as file:
    index_content = file.read()

# Criar um objeto BeautifulSoup para manipular o HTML
soup = BeautifulSoup(index_content, "html.parser")

# Encontrar a div existente com id "popus"
popups_div = soup.find("div", id="popus")

# Verificar se a div foi encontrada
if popups_div:
    # Adicionar o conteúdo gerado dentro da div encontrada
    new_content = BeautifulSoup(html_content, "html.parser")
    for tag in new_content.find_all():
        # Contar o número de espaços antes da tag atual
        indent = len(tag.find_parents()) * "    "
        tag.insert_before(indent)  # Adiciona a mesma quantidade de espaços antes da nova tag
        
    # Para cada popup novo, verifique se já existe um popup com o mesmo ID
    for new_popup in new_content.find_all("div", class_="popup-container"):
        popup_id = new_popup.get("id")
        existing_popup = popups_div.find("div", id=popup_id)
        if existing_popup:
            # Substituir o conteúdo do popup existente pelo novo popup
            existing_popup.replace_with(new_popup)
            print(f"Popup com ID '{popup_id}' substituído.")
        else:
            # Adicionar o novo popup à div de popups
            popups_div.append(new_popup)
            print(f"Popup com ID '{popup_id}' adicionado.")
    
    # Sobrescrever o arquivo index.html com o novo conteúdo mantendo a formatação
    with open("index.html", "w", encoding="utf-8") as file:
        file.write(str(soup.prettify(formatter=lambda s: s.replace("\n", "").replace("    ", "    "))))
    
    print("Conteúdo dos popups adicionado à div com id 'popus' mantendo a formatação.")
else:
    print("Div com id 'popus' não encontrada no arquivo index.html.")
