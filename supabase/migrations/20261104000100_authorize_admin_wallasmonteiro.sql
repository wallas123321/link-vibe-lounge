-- Autoriza wallasmonteiro019@gmail.com como administradora do painel /admin.
-- O UUID vem do cadastro em auth.users (mesmo e-mail); se a conta não existir,
-- nada é inserido e a conta precisa ser criada antes em Authentication > Users.
insert into public.gallery_admins (user_id)
select id
from auth.users
where lower(email) = lower('wallasmonteiro019@gmail.com')
on conflict (user_id) do nothing;
