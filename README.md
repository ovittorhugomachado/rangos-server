# Rangos
Bem vindo ao repositório back-end do projeto Rangos, é a partir do código contido aqui que é possível fazer a comunicação com o banco de dados, e também realizar operações, esse é um projeto que está na versão 1.0, então algumas funcionalizades ainda não foram implementadas, essa primeira versão conta com um modelo básico de como vai ser a Rangos, uma plataforma onde pequenos restaurantes podem criar um cardápio com identidade visual própria e gerir seus pedidos de forma gratuita.

Ao final desse arquivo está o link do repositório do front-end, caso queira testar a aplicação integralmente.

## Como usar

### Pré-requisitos

- **Docker** instalado na máquina - [Baixar Docker](https://www.docker.com/)
- **Node.js** instalado para rodar o frontend - [Baixar Node](https://nodejs.org/)

---

### Passo a passo para rodar o projeto

1. **Clonar o repositório:**

   > git clone https://github.com/ovittorhugomachado/rangos-server.git

   > cd rangos-server

   **IMPORTANTE:** Para testar a aplicação você precisa estar na branch develop, é ela que contém as variáveis de ambiente para rodar o servidor localmente, a branch main está configurada para rodar em produção, então as variáveis são inseridas direto no serviço de hospedagem.


3. **Instalar as dependências do back-end:**

   > npm install ou npm i


4. **Iniciar os containers do banco de dados e back-end:**
   (O terminal precisa ser executado como administrador!)

   > docker-compose up -d


   **Portas padrão utilizadas:**
   - `3000`: Serviço backend (definido em `docker-compose.yaml`)
   - `5432`: Banco de dados (definido em `docker-compose.yaml`)

   **IMPORTANTE:** Verifique se essas portas estão livres na sua máquina.  
   Não é recomendado alterar as portas no `docker-compose.yaml`.  
   Se precisar alterar, modifique apenas o primeiro valor do mapeamento, exemplo:  
   `3000:3000` → `5000:3000` (acessará pelo `localhost:5000`).


5. **Acessar a aplicação:**
   - Depois do container ser executado com sucesso a aplicação já vai ficar disponível na porta definida no `docker-compose.yaml` (por padrão 3000).
   - Acessando http://localhost:3000/api-docs é possível testar as rotas, podendo criar usuários, pratos e todas operações do projeto Rangos

---

## Comandos úteis

### Git
- **Consultar as branches**

  > git branch
  
- **Trocar de branch**

  > git checkout [nome-da-branch-destino]
  
### Docker

- **Listar containers ativos:**

  > docker ps


- **Listar todos os containers (inclusive parados):**

  > docker ps -a


- **Listar imagens:**

  > docker images


- **Parar um container:**

  > docker stop [nome-ou-id-do-container]


- **Executar (iniciar) um container parado:**

  > docker start [nome-ou-id-do-container]


- **Verificar versão do Docker:**

  > docker --version


- **Remover um container:**

  > docker rm [nome-ou-id-do-container]


- **Parar todos os containers do Docker Compose:**
  
  > docker-compose down


- **Remover uma imagem:**

  > docker rmi [nome-ou-id-da-imagem]


- **Ver logs de um container:**

  > docker logs [nome-ou-id-do-container]


---

### Outros serviços

- **Verificar versão do Node.js:**

  > node --version


- **Verificar versão do npm:**

  > npm --version


- **Instalar dependências:**

  > npm install ou npm i


- **Rodar o frontend em modo desenvolvimento:**

  > npm run dev



## Observações

- Se tiver problemas, verifique se o Docker está rodando e se as portas estão livres.
- Para parar os containers, use:
  docker-compose

### Aplicação em produção
- https://rangos.onrender.com

### Imagem docker
- https://hub.docker.com/r/ovittormachado/rangos-server-app

### Repositório front end
- https://github.com/ovittorhugomachado/rangos.git
