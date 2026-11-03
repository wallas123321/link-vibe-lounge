# Painel de fotos — Lovable Cloud

A rota `/admin` permite publicar fotos não explícitas na galeria de `/previas`.
O painel usa o backend do Lovable Cloud (compatível com Supabase), sem precisar
criar outro serviço. Ele exige login e autorização na tabela `gallery_admins`.

## Ativação no projeto existente

1. Sincronize esta alteração com o projeto Lovable pelo GitHub.
2. No Lovable, peça para aplicar `supabase/migrations/20261103000100_admin_gallery.sql`
   no **backend Cloud do próprio projeto**. O arquivo cria duas tabelas, um bucket
   e as políticas de acesso. Não basta ter o arquivo no GitHub: ele precisa ser
   aplicado no banco. A migração é executada uma única vez.
3. Preserve a integração Cloud já gerada pelo Lovable e seus valores públicos:
   `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (a chave pública antiga
   `VITE_SUPABASE_ANON_KEY` também é aceita na verificação de configuração). O painel
   reutiliza `src/integrations/supabase/client.ts`, incluindo o adaptador de
   requisições e autenticação do preview do Lovable. Os valores ficam no `.env` do projeto;
   para desenvolvimento local use `.env.local`. Nunca use uma chave `service_role`
   ou uma chave secreta no frontend.
4. Crie ou selecione sua conta em **Users** no backend do Lovable, com login por
   e-mail e senha. Copie o UUID do usuário e peça para inserir apenas essa conta:

   ```sql
   insert into public.gallery_admins (user_id) values ('UUID-DO-USUARIO');
   ```

   A conta não ganha permissão apenas por fazer login. Não há cadastro público no
   painel nem função de autoaprovação. A lista de administradores só pode ser
   alterada pelo gerenciamento do backend.

5. Publique a versão no Lovable e abra `/admin` no domínio do site.

Texto para pedir a ativação ao Lovable após sincronizar o código:

> Use o Lovable Cloud deste projeto para ativar o painel /admin já implementado.
> Aplique supabase/migrations/20261103000100_admin_gallery.sql no backend, preserve
> a integração e as variáveis públicas já existentes do Cloud e me ajude a
> cadastrar minha conta em gallery_admins. Preserve as políticas RLS e não crie
> outro backend. Teste login de administrador, bloqueio de usuários comuns,
> upload de uma foto não explícita, aparição em /previas e exclusão.

## Uso

- Selecione uma ou várias fotos JPG, PNG ou WebP, de até 15 MB e 40 megapixels.
- Ajuste cada uma: rotação de 90 graus, aproximação e posição do recorte.
- As fotos horizontais são recortadas no formato vertical 3:4; você decide se
  precisa girar a foto ou apenas ajustar o enquadramento.
- Confira a prévia, descreva a foto, confirme a autorização e publique.
- A próxima foto da seleção abre automaticamente. As novas fotos aparecem antes
  das existentes na galeria e usam o mesmo destino e estilo do botão atual.
- Para excluir uma foto publicada pelo painel, use a lista abaixo do editor.
  As oito fotos anteriores continuam sendo gerenciadas pelo código.

## Armazenamento e acesso

O navegador exporta somente uma prévia JPEG de 600 × 800 pixels já desfocada;
o original não é enviado nem armazenado. O bucket de **prévias** é público para
permitir a galeria, e os arquivos nele devem sempre ser próprios para essa
exibição. O desfoque é visual, não um sistema de acesso ao original. O painel
não faz moderação automática: a confirmação de conteúdo não explícito é uma
declaração do administrador.

Visitantes só podem ler as fotos. Inserções e exclusões exigem um usuário em
`gallery_admins`, com verificação nas políticas do banco e do Storage. O frontend
não guarda senhas de administrador no código. Se a exclusão do arquivo falhar
após a exclusão do registro, o painel avisa para remover o arquivo no Storage.

## Validação após ativar o Cloud

Verifique em janela anônima que a galeria mostra a prévia publicada; tente uma
gravação com a chave pública sem login e com uma conta comum para confirmar a
negação pelas políticas. Confirme também que a URL pública só fornece o JPEG
desfocado e que excluir pelo painel remove o registro e o arquivo. Essas etapas
dependem do backend e não podem ser validadas sem a configuração do projeto.

Referências: [Lovable Cloud](https://docs.lovable.dev/features/cloud),
[variáveis de ambiente](https://docs.lovable.dev/features/secrets),
[políticas de Storage](https://supabase.com/docs/guides/storage/security/access-control).
