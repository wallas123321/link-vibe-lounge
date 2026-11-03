# Ativação da galeria administrativa

- [ ] Aplicar a migração existente no Lovable Cloud, preservando integração, variáveis e RLS. Bloqueado: `supabase/migrations/20261103000100_admin_gallery.sql` não está neste projeto.
- [ ] Ativar o painel `/admin` existente. Bloqueado: implementação do painel não está neste projeto.
- [ ] Cadastrar a conta solicitante em `gallery_admins` após conferir a migração e identificar a conta.
- [ ] Testar login administrativo, bloqueio de usuário comum, upload de foto não explícita, exibição em `/previas` e exclusão após disponibilização da implementação.