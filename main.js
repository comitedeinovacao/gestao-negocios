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
  var paineis = ['docentes-list', 'representantes-filter'];
  paineis.forEach(function(id) {
    var painel = document.getElementById(id);
    if (painel) {
      painel.style.display = 'none';
    }
  });

  // Abre apenas o selecionado
  var view = document.getElementById(viewId);
  if (view) {
    view.style.display = 'block';
    view.scrollIntoView({ behavior: 'smooth' });
  }

  // Carrega os dados atuais para exibição
  if (viewId === 'docentes-list' && typeof loadDocentes === 'function') {
    loadDocentes();
  }
  if (viewId === 'representantes-filter' && typeof loadRepresentantes === 'function') {
    loadRepresentantes();
  }
}

// Abre modal de modalidade (tecnicos ou livres)
function openModalidade(modalidade) {
  const modal = document.getElementById('modal-cursos');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-cursos-content');
  
  title.textContent = modalidade === 'tecnicos' ? 'Cursos Técnicos' : 'Cursos Livres / Qualificação';
  modal.classList.remove('hidden');
  
  // Carregar cursos da modalidade
  loadCursosModalidade(modalidade);
}

// Fecha modal de cursos
function closeModal() {
  document.getElementById('modal-cursos').classList.add('hidden');
}

// Fecha modal de turmas
function closeModalTurmas() {
  document.getElementById('modal-turmas').classList.add('hidden');
}

// Carrega cursos da modalidade no modal
async function loadCursosModalidade(modalidade) {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    
    const cursos = modalidade === 'tecnicos' ? data.cursos_tecnicos : data.cursos_livres;
    const content = document.getElementById('modal-cursos-content');
    
    content.innerHTML = cursos.map(curso => `
      <div class="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors" onclick="openTurmasCurso('${curso.id}', '${curso.nome}')">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="font-bold text-[#004587] text-lg">${curso.nome}</h4>
            <p class="text-gray-600">Código da Ficha: ${curso.codigo_ficha}</p>
          </div>
          <svg class="w-6 h-6 text-[#F7941D]" fill="none" stroke="currentColor" viewbox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar cursos:', error);
    document.getElementById('modal-cursos-content').innerHTML = '<p class="text-red-600">Erro ao carregar cursos.</p>';
  }
}

// Abre modal de turmas para um curso específico
async function openTurmasCurso(cursoId, cursoNome) {
  const modal = document.getElementById('modal-turmas');
  const title = document.getElementById('modal-turmas-title');
  
  title.textContent = `Turmas - ${cursoNome}`;
  modal.classList.remove('hidden');
  
  // Carregar turmas do curso
  loadTurmasCurso(cursoId);
}

// Carrega turmas de um curso específico
async function loadTurmasCurso(cursoId) {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    
    const turmas = data.turmas.filter(turma => turma.curso_id === cursoId);
    const content = document.getElementById('modal-turmas-content');
    
    if (turmas.length === 0) {
      content.innerHTML = '<p class="text-gray-600 text-center py-8">Nenhuma turma cadastrada para este curso.</p>';
      return;
    }
    
    content.innerHTML = turmas.map(turma => `
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h4 class="font-bold text-[#004587] text-xl mb-2">${turma.nome_curso}</h4>
            <p class="text-gray-600 mb-1"><strong>Código da Oferta:</strong> ${turma.codigo_oferta}</p>
            <p class="text-gray-600 mb-1"><strong>Período:</strong> ${turma.periodo === 'manha' ? 'Manhã' : turma.periodo === 'tarde' ? 'Tarde' : 'Noite'}</p>
          </div>
          <input type="text" placeholder="Buscar por descrição..." class="px-3 py-2 border border-gray-300 rounded-lg text-sm" oninput="filterTurmaDocuments('${turma.id}', this.value)">
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
          <!-- PITD -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h5 class="font-semibold text-[#004587] mb-3">PITD</h5>
            <div id="pitd-${turma.id}" class="space-y-2">
              ${data.pitd.filter(pitd => pitd.turma_id === turma.id).map(pitd => `
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-sm text-gray-700">${pitd.docente_nome} - ${pitd.unidade_curricular}</span>
                  <button onclick="window.open('${pitd.link_arquivo}', '_blank')" class="px-3 py-1 bg-[#004587] text-white text-sm rounded-lg hover:bg-[#003366] transition-colors">
                    Abrir Documento
                  </button>
                </div>
              `).join('') || '<p class="text-gray-500 text-sm">Nenhum PITD cadastrado</p>'}
            </div>
          </div>
          
          <!-- PCTD -->
          <div class="bg-orange-50 rounded-lg p-4">
            <h5 class="font-semibold text-[#004587] mb-3">PCTD</h5>
            <div id="pctd-${turma.id}" class="space-y-2">
              ${data.pctd.filter(pctd => pctd.turma_id === turma.id).map(pctd => `
                <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span class="text-sm text-gray-700">${pctd.nome_curso} - ${pctd.periodo === 'manha' ? 'Manhã' : pctd.periodo === 'tarde' ? 'Tarde' : 'Noite'}</span>
                  <button onclick="window.open('${pctd.link_arquivo}', '_blank')" class="px-3 py-1 bg-[#F7941D] text-white text-sm rounded-lg hover:bg-[#E8850D] transition-colors">
                    Abrir Documento
                  </button>
                </div>
              `).join('') || '<p class="text-gray-500 text-sm">Nenhum PCTD cadastrado</p>'}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar turmas:', error);
    document.getElementById('modal-turmas-content').innerHTML = '<p class="text-red-600">Erro ao carregar turmas.</p>';
  }
}

// Filtra documentos da turma por descrição
function filterTurmaDocuments(turmaId, query) {
  const pitdContainer = document.getElementById(`pitd-${turmaId}`);
  const pctdContainer = document.getElementById(`pctd-${turmaId}`);
  
  if (!query) {
    // Mostrar todos
    pitdContainer.querySelectorAll('.flex').forEach(el => el.style.display = 'flex');
    pctdContainer.querySelectorAll('.flex').forEach(el => el.style.display = 'flex');
    return;
  }
  
  // Filtrar PITD
  pitdContainer.querySelectorAll('.flex').forEach(el => {
    const text = el.textContent.toLowerCase();
    el.style.display = text.includes(query.toLowerCase()) ? 'flex' : 'none';
  });
  
  // Filtrar PCTD
  pctdContainer.querySelectorAll('.flex').forEach(el => {
    const text = el.textContent.toLowerCase();
    el.style.display = text.includes(query.toLowerCase()) ? 'flex' : 'none';
  });
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
