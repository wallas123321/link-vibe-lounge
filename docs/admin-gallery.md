# Fotos nos arquivos do projeto

O preparador em `/admin` funciona no navegador, sem login, banco ou armazenamento
do Lovable Cloud. Ele prepara arquivos; a publicação é feita pela conta do GitHub
com permissão de escrita no repositório.

## Preparar e publicar

1. Abra `/admin` e selecione fotos não explícitas (JPG, PNG ou WebP, até 15 MB).
2. Ajuste rotação, zoom e enquadramento. A saída é JPEG vertical de 600 × 800,
   já desfocado. Os originais não são enviados.
3. Descreva a foto, confirme a autorização e clique em **Adicionar ao pacote**.
4. Repita para as demais imagens e clique em **Baixar pacote ZIP**.
5. Extraia o ZIP no computador.
6. Abra https://github.com/wallas123321/link-vibe-lounge/tree/main/src/assets/gallery
   e clique em **Add file → Upload files**. Envie os JPGs extraídos, não o ZIP.
7. Confirme em **Commit changes**. Aguarde a sincronização e publique a versão
   atualizada do site no host.

As novas fotos entram automaticamente antes das oito fotos originais na galeria,
com o mesmo botão e destino. Não é preciso editar uma lista ou banco.
Para retirar uma foto, exclua seu JPG dessa pasta e publique novamente.
O nome gerado contém data, identificador e descrição sem acentos, usados para
ordenar as fotos e fornecer o texto alternativo.

## O que fica salvo

Baixe o pacote antes de atualizar ou fechar a página: fotos selecionadas e
preparadas ficam apenas na memória da sessão. É possível baixar cada imagem
separadamente ou removê-la do pacote antes do download.

O preparador não altera o servidor e pode ser usado por qualquer visitante em
sua própria sessão. Só quem tem acesso ao GitHub pode mudar a galeria publicada.
Nenhuma credencial do GitHub é colocada no site.

## Dados antigos e hospedagem

A galeria não consulta mais `gallery_photos` nem o Storage do Cloud. Dados antigos
do Cloud não são apagados e não são migrados automaticamente. Se houver fotos
publicadas somente no Cloud, baixe as prévias e coloque-as na pasta do projeto.
As oito fotos originais que já estavam no código continuam disponíveis.

Esta alteração elimina o Cloud do preparo e da exibição das novas fotos. Ela não
troca a hospedagem: se o host atual parar por falta de crédito, será necessário
hospedar o site em outro local.
