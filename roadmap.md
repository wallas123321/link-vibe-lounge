# Ativação da galeria administrativa

- [x] Aplicar a migração no Cloud atual com as mesmas políticas RLS, grants explícitos e armazenamento separado pela API.
- [x] Habilitar login por e-mail e verificar o formulário de `/admin`; envio de fotos oculto para visitantes.
- [ ] Criar o armazenamento público `gallery-previews` (2 MB). Bloqueado: política do workspace proíbe armazenamento público; administrador deve permitir em Settings → Privacy & Security.
- [ ] Cadastrar a conta solicitante em `gallery_admins`. Bloqueado: não há contas; usuário precisa criar uma conta em More → Users e identificar seu e-mail.
- [ ] Testar login administrativo, bloqueio de usuário comum, upload de foto não explícita, exibição em `/previas` e exclusão. Bloqueado: cadastro da conta e permissão para armazenamento público.