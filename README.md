# Rangos - Produção

Bem-vindo à branch `main` do projeto Rangos! Esta branch está configurada exclusivamente para o ambiente de **produção**.  
Se você está procurando rodar o projeto localmente para desenvolvimento, mude para a branch `develop`.

---

   **IMPORTANTE:** Como esee repositório **não está configurado para desenvolvimento local**.  
As variáveis de ambiente necessárias para o funcionamento do projeto devem ser configuradas diretamente no serviço de hospedagem.

### Variáveis de Ambiente Necessárias
Se quiser colocar o projeto em produção você precisa configurar as seguintes variáveis no ambiente de produção:

- **Banco de Dados**:
- Esses dados precisam vir de um banco de dados que esteja em produção, eu indico usar a Railway para fazer criar o banco
  - `DATABASE_URL`: `url-do-banco-de-dados`
  - `POSTGRES_PASSWORD`: `senha-do-banco-de-dados`
  - `POSTGRES_USER`: `usuario`
  - `POSTGRES_DB`: `banco-de-dados`

- **Autenticação**:
  - `JWT_SECRET`: `jwt_secret_default`
  - `REFRESH_SECRET`: `jwt_refresh_secret_default`

- **E-mail**:
- Aqui fica o email que vai enviar o link de redefinição de senha, também é preciso a senha de app, que pode ser gerada diretamente no seu email
  - `EMAIL_USER`: `email`
  - `EMAIL_PASS`: `senha-de-app`

- **Configurações da Aplicação**:
  - `APP_URL`: `link-d-front-end`
  - `STORAGE_TYPE`: `local-ou-s3`

- **AWS (opcional)**:
- Essas são as variáveis da conta aws, caso use o storage type s3, para armazenar os arquivos estáticos na nuvem
  - `AWS_ACCESS_KEY_ID`: `id-da-aws`
  - `AWS_SECRET_ACCESS_KEY`: `secret-key-aws`
  - `AWS_DEFAULT_REGION`: `regiao-aws`
  - `AWS_BUCKET_NAME`: `nome-bucket-s3`

---

## Aplicação em Produção

A aplicação está disponível no seguinte link:

- [https://rangos.onrender.com](https://rangos.onrender.com)

---

## Observações

- Caso precise realizar alterações ou rodar o projeto localmente, utilize a branch `develop`.
- Para dúvidas ou problemas, entre em contato com o responsável pelo projeto.

---
