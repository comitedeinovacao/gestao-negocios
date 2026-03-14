// ============================================================
// main.js — Navegação entre páginas do Hub Gestão e Negócios
// Senac Araçatuba
// ============================================================

// Navega para uma página específica pelo ID
function navigateToPage(pageId) {
  document.querySelectorAll('.page-container').forEach(function(page) {
    page.classList.remove('active');
  });

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
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    b.classList.remove('bg-[#004587]/10', 'text-[#004587]', 'border-b-4', 'border-[#F7941D]');
  });

  btn.classList.add('bg-[#004587]/10', 'text-[#004587]', 'border-b-4', 'border-[#F7941D]');

  document.querySelectorAll('.tab-content').forEach(function(tab) {
    tab.classList.add('hidden');
  });

  var tabId = 'tab-' + btn.getAttribute('data-tab');
  var tabContent = document.getElementById(tabId);
  if (tabContent) {
    tabContent.classList.remove('hidden');
  }
}

// Abre uma visualização de consulta
function openConsultaView(viewId) {
  // Fecha todos os painéis primeiro
  var paineis = ['docentes-list', 'pctd-list', 'pitd-list', 'representantes-filter'];
  paineis.forEach(function(id) {
    var painel = document.getElementById(id);
    if (painel) {
      painel.classList.add('hidden');
    }
  });

  // Abre apenas o selecionado
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

// Filtra representantes (stub local — substituir por lógica real se necessário)
function filterRepresentantes() {
  console.log('[filterRepresentantes] Filtro aplicado');
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ main.js carregado com sucesso — Hub Gestão e Negócios Senac Araçatuba');

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
