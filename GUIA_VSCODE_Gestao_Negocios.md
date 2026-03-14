# 📋 Guia de Orientações — Site Hub Gestão e Negócios | Senac Araçatuba

> **Para usar com o GitHub Copilot / ChatGPT no VS Code**  
> Cole este guia como contexto ao pedir ajuda ao assistente de IA.

---

## 🗂️ Visão Geral do Projeto

Este é um site HTML/CSS/JS de página única (SPA) para a área de **Gestão e Negócios do Senac Araçatuba**.  
O site possui múltiplas "páginas" controladas por JavaScript (sem framework), usando **Tailwind CSS via CDN** e fonte **Montserrat** do Google Fonts.

### Cores padrão do projeto
| Elemento | Cor (hex) |
|---|---|
| Azul primário Senac | `#004587` |
| Laranja Senac | `#F7941D` |
| Azul escuro (fundo hero) | `#0a1628` / `#0f2847` |
| Cinza texto | `#F2F2F2` |

---

## 📁 Estrutura de Arquivos Necessária no VS Code

```
projeto/
│
├── index.html          ← Arquivo principal (o HTML fornecido)
├── main.js             ← Script de navegação entre páginas (ver código abaixo)
└── favicon.ico         ← Ícone do site (opcional)
```

> ⚠️ O arquivo `index.html` faz referência a `main.js` na linha `<script src="main.js" defer></script>`.  
> O arquivo `main.js` **PRECISA existir** na mesma pasta, caso contrário o site não funciona.

---

## 🔧 Problema 1 — SDKs externos que não existem localmente

### O que está errado
O HTML original contém duas linhas que referenciam scripts de uma plataforma externa (provavelmente o ambiente onde o site foi criado):

```html
<script src="/_sdk/element_sdk.js" defer></script>
<script src="/_sdk/data_sdk.js" type="text/javascript" defer></script>
```

Esses arquivos **não existem** quando você abre o site no VS Code / navegador local. Isso causa erros no console e quebra funcionalidades como salvar/consultar dados.

### ✅ Solução — Substituir pelos stubs locais

Remova as duas linhas acima do `<head>` e substitua por este trecho logo antes de `</head>`:

```html
<!-- Stubs locais para desenvolvimento no VS Code -->
<script>
  // Simula o dataSdk para desenvolvimento local
  window.dataSdk = {
    create: async function(data) {
      console.log('[dataSdk.create] Dados recebidos:', data);
      return { isOk: true, data: { id: 'local_' + Date.now(), ...data } };
    },
    list: async function(filter) {
      console.log('[dataSdk.list] Filtro:', filter);
      return { isOk: true, data: [] };
    },
    update: async function(id, data) {
      console.log('[dataSdk.update] ID:', id, 'Dados:', data);
      return { isOk: true, data: { id, ...data } };
    },
    delete: async function(id) {
      console.log('[dataSdk.delete] ID:', id);
      return { isOk: true };
    }
  };

  // Simula o elementSdk para desenvolvimento local
  window.elementSdk = {
    getUser: function() { return { name: 'Usuário Teste', email: 'teste@senac.br' }; }
  };
</script>
```

---

## 🔧 Problema 2 — Arquivo `main.js` ausente

### O que está errado
O arquivo `main.js` é referenciado no HTML mas não existe na pasta do projeto.

### ✅ Solução — Criar o arquivo `main.js`

Crie um arquivo chamado `main.js` na mesma pasta do `index.html` com o seguinte conteúdo:

```javascript
// ============================================================
// main.js — Navegação entre páginas do Hub Gestão e Negócios
// Senac Araçatuba
// ============================================================

// Navega para uma página específica pelo ID
function navigateToPage(pageId) {
  // Esconde todas as páginas
  document.querySelectorAll('.page-container').forEach(function(page) {
    page.classList.remove('active');
  });

  // Mostra a página solicitada
  var targetPage = document.getElementById(pageId + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    console.warn('[navigateToPage] Página não encontrada: ' + pageId + '-page');
  }
}

// Rola a tela até a seção de Gestão na Home
function scrollToGestao() {
  navigateToPage('home');
  setTimeout(function() {
    var gestaoSection = document.getElementById('gestao');
    if (gestaoSection) {
      gestaoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

// Rola até o rodapé (Contato)
function scrollToFooter() {
  navigateToPage('home');
  setTimeout(function() {
    var footer = document.getElementById('contato');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

// Alterna abas na página de Cadastro
function switchCadastroTab(btn) {
  // Remove estilo ativo de todos os botões
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    b.classList.remove('bg-[#004587]/10', 'text-[#004587]', 'border-b-4', 'border-[#F7941D]');
  });

  // Adiciona estilo ativo no botão clicado
  btn.classList.add('bg-[#004587]/10', 'text-[#004587]', 'border-b-4', 'border-[#F7941D]');

  // Esconde todos os conteúdos de aba
  document.querySelectorAll('.tab-content').forEach(function(tab) {
    tab.classList.add('hidden');
  });

  // Mostra o conteúdo da aba selecionada
  var tabId = 'tab-' + btn.getAttribute('data-tab');
  var tabContent = document.getElementById(tabId);
  if (tabContent) {
    tabContent.classList.remove('hidden');
  }
}

// Abre uma visualização de consulta
function openConsultaView(viewId) {
  var view = document.getElementById(viewId);
  if (view) {
    view.classList.remove('hidden');
    view.scrollIntoView({ behavior: 'smooth' });
  }
}

// Fecha uma visualização de consulta
function closeConsultaView(viewId) {
  var view = document.getElementById(viewId);
  if (view) {
    view.classList.add('hidden');
  }
}

// Filtra representantes (stub local)
function filterRepresentantes() {
  console.log('[filterRepresentantes] Filtro aplicado');
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ main.js carregado com sucesso');

  // Ativa a primeira aba de cadastro por padrão
  var firstTabBtn = document.querySelector('.tab-btn[data-tab="cad-docentes"]');
  if (firstTabBtn) {
    firstTabBtn.classList.add('bg-[#004587]/10', 'text-[#004587]', 'border-b-4', 'border-[#F7941D]');
  }

  // Garante que apenas a home está visível ao carregar
  var activePage = document.querySelector('.page-container.active');
  if (!activePage) {
    var homePage = document.getElementById('home-page');
    if (homePage) homePage.classList.add('active');
  }
});
```

---

## 🔧 Problema 3 — Formulário Banco de Ideias (Formspree)

### O que está configurado
O formulário de "Banco de Ideias" já está corretamente apontado para o Formspree:

```html
<form id="ideiaForm" action="https://formspree.io/f/xeerznrl" method="POST">
```

### ✅ Como verificar se funciona

1. Abra o site no navegador (com o VS Code Live Server ou abrindo o arquivo direto)
2. Preencha o formulário com Nome, E-mail e Ideia
3. Clique em Enviar
4. Verifique no painel do Formspree: [https://formspree.io/forms/xeerznrl/submissions](https://formspree.io/forms/xeerznrl/submissions)

### ⚠️ Atenção — Botão de envio

O formulário precisa de um botão de envio `type="submit"`. Se ele não aparecer no seu arquivo, adicione ao final do formulário (antes de `</form>`):

```html
<button type="submit" class="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#004587] to-[#F7941D] hover:opacity-90 transition-opacity">
  💡 Enviar Ideia
</button>
```

---

## 🔧 Problema 4 — E-mail no rodapé com proteção Cloudflare

### O que está errado
O e-mail no rodapé aparece como:
```html
<span class="__cf_email__" data-cfemail="...">[email protected]</span>
```
Isso é a proteção anti-bot do Cloudflare. No ambiente local, o e-mail não é descriptografado.

### ✅ Solução — Substituir pelo e-mail real

Localize no `index.html` a linha do rodapé com `__cf_email__` e substitua por:

```html
<a href="mailto:gestaonegocios@sp.senac.br" class="text-gray-300 hover:text-[#F7941D] transition-colors">
  gestaonegocios@sp.senac.br
</a>
```
> Substitua `gestaonegocios@sp.senac.br` pelo e-mail real da coordenação.

---

## 🔧 Problema 5 — Como visualizar o site localmente no VS Code

### Opção A — Extensão Live Server (Recomendada)
1. No VS Code, instale a extensão **Live Server** (de Ritwick Dey)
2. Clique com o botão direito no `index.html`
3. Selecione **"Open with Live Server"**
4. O site abre automaticamente em `http://127.0.0.1:5500`

### Opção B — Abrir diretamente no navegador
1. Abra o Explorador de Arquivos do Windows
2. Navegue até a pasta do projeto
3. Dê duplo clique no `index.html`
4. O site abre no navegador padrão

> ⚠️ Algumas funcionalidades (como fetch/AJAX) podem ser bloqueadas ao abrir direto como arquivo. Prefira o Live Server.

---

## 📋 Checklist de Verificação

Antes de testar o site, confirme:

- [ ] `index.html` e `main.js` estão na **mesma pasta**
- [ ] Os scripts `/_sdk/element_sdk.js` e `/_sdk/data_sdk.js` foram **substituídos pelos stubs**
- [ ] O `main.js` foi criado com as funções de navegação
- [ ] O e-mail no rodapé foi substituído pelo e-mail real
- [ ] O formulário Formspree tem o botão de envio `type="submit"`
- [ ] Você está visualizando com o **Live Server** (não abrindo o arquivo direto)

---

## 🧪 Como testar cada seção

| Seção | O que testar |
|---|---|
| **Home** | Navegação pelos botões "Explorar Plataforma" e "Agenda de Eventos" |
| **Gestão** | Clique em "Acessar Cadastro" e "Acessar Consulta" |
| **Cadastro** | Clique nas abas (Docentes, Turmas, PITD, PCTD, Representante) |
| **Consulta** | Clique nos cards e verifique se as seções abrem/fecham |
| **Eventos** | Acesse via menu superior |
| **Banco de Ideias** | Preencha e envie — verifique no painel Formspree |
| **Contato** | Clique em "Contato" no menu — deve rolar até o rodapé |

---

## 💬 Prompt sugerido para o GitHub Copilot no VS Code

Você pode usar o texto abaixo para pedir ajuda ao Copilot/ChatGPT dentro do VS Code:

```
Tenho um site HTML de página única (SPA) para o Hub Gestão e Negócios do Senac Araçatuba.
O arquivo principal é index.html e preciso de um arquivo main.js com as funções:
- navigateToPage(pageId): mostra/oculta divs com classe 'page-container' e id '{pageId}-page'
- scrollToGestao(): volta para home e rola até id='gestao'
- scrollToFooter(): volta para home e rola até id='contato'
- switchCadastroTab(btn): ativa abas pelo atributo data-tab
- openConsultaView(viewId) e closeConsultaView(viewId): mostra/oculta seções de consulta
As páginas disponíveis são: home, cadastro, consulta, eventos.
O site usa Tailwind CSS via CDN. Gere o main.js completo e funcional.
```

---

## 📞 Suporte

Dúvidas sobre o Formspree: [https://formspree.io/help](https://formspree.io/help)  
Documentação Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)  
Live Server no VS Code: [https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
