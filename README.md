Central de Materiais e Esterilização (CME)
Descrição

Este projeto é uma aplicação desenvolvida com Django (backend) e React (frontend), com o objetivo de gerenciar o processo de esterilização de materiais em uma Central de Materiais e Esterilização (CME). O sistema permite o cadastro e acompanhamento dos materiais, o gerenciamento dos processos de esterilização, e a geração de relatórios em PDF e XSLX sobre o andamento das atividades.
Requisitos

    Docker
    O projeto utiliza Docker para facilitar a configuração e execução dos serviços de backend
    e frontend em contêineres isolados. Certifique-se de ter o Docker instalado em seu sistema.

Como Executar o Projeto

    Clone o repositório:

git clone <url-do-repositorio>
cd <diretorio-do-repositorio>

Certifique-se de que o Docker esteja instalado e funcionando no seu sistema.

Construa e inicie os contêineres com o comando:

    docker-compose up --build

    O Docker irá construir os contêineres para o backend (Django) e frontend (React) e iniciá-los. Após o build, os serviços estarão disponíveis nas seguintes rotas:
        Backend: http://localhost:8001/admin/ (painel django-admin)
        Frontend: http://localhost/ (login)

Criação do Primeiro Usuário

Após rodar o projeto pela primeira vez, o primeiro usuário deve ser criado diretamente no painel de administração do Django. Para isso:

    Acesse o painel de administração do Django em http://localhost:8001/admin/.
    Utilize as credenciais padrão para fazer o login:
        Usuário: admin
        Senha: admin

Após o login, você poderá criar o primeiro usuário para o sistema.

Regras de Cadastro de Usuários

Os usuários do sistema devem atender aos seguintes requisitos:

    Nome: mínimo de 5 caracteres.
    Email: deve ser válido, no formato example@domain.com.
    Senha: mínimo de 6 caracteres.

Tipos de Usuários e Permissões

Existem 3 tipos de usuários no sistema, cada um com diferentes permissões:

Técnico

    Pode listar e criar materiais no sistema.
    Pode iniciar processos de esterilização para um material.
    Pode avançar nas etapas de um processo de esterilização.
    Pode relatar falhas nas etapas do processo de esterilização.

Enfermagem

    Pode listar todos os materiais e listar todos os processos de esterilização.
    Pode gerar relatórios gerais de todos os materiais.
    Pode gerar relatórios de um material específico.
    Pode gerar relatórios de um processo de esterilização.

Administrativo

    Pode criar, editar materiais e atribuir cargos a novos usuários.
    Pode editar usuários já cadastrados.

Home Inicial

Após o login, a tela inicial será definida de acordo com o tipo de usuário. Cada tipo de usuário terá uma interface específica com funcionalidades e permissões de acordo com seu cargo.
