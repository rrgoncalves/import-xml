---
mode: agent
---
Crie uma aplicação utilizando Electron e TypeScript, utilizando o yarn.

A aplicação deve ser executada também através do system tray (bandeja do sistema), permitindo ao usuário abrir, esconder e encerrar a aplicação a partir do ícone na bandeja.  
O menu da bandeja deve conter as opções: Mostrar, Esconder e Encerrar.  
Ao fechar a janela principal, a aplicação deve apenas esconder a janela e permanecer ativa na bandeja do sistema.

Crie uma tela principal utilizando um estilo através de uma classe CSS em arquivo separado do HTML, utilizando o Google Material.

A tela principal deve conter:
- Um campo de seleção de diretório, com um botão (ícone de pasta) ao lado do campo de texto, que ao ser clicado abre o diálogo de seleção de diretório do sistema operacional. O caminho selecionado deve ser exibido no campo de texto.
- Um campo para informar o documento de identificação (CPF ou CNPJ), com validação em TypeScript e exibição de mensagem de erro se inválido.
- Botões de salvar e cancelar, sendo que o botão de salvar só deve funcionar se o documento for válido.
