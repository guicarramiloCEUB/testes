(() => {
  "use strict";

  const STORAGE_KEY = "urgen_g16_db_v1";

  // ==================== SAFE HTML ESCAPE ====================
  const escapeHtml = (val) =>
    String(val ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatBRL = (num) =>
    Number(num || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const nowBR = () => new Date().toLocaleString("pt-BR");

  // ==================== INITIAL SEED DATA (MATCHES TEMPLATES 01–06 & TCD) ====================
  const createInitialDB = () => ({
    unidades: [
      { id: "UA-01", nome: "Faculdade de Ciências Exatas" },
      { id: "UA-02", nome: "Faculdade de Ciências Humanas" },
      { id: "UA-03", nome: "Diretoria Administrativa e Financeira" },
    ],
    setores: [
      { id: "SET-01", nome: "Departamento de Ciência da Computação", unidadeId: "UA-01" },
      { id: "SET-02", nome: "Departamento de Letras e Educação", unidadeId: "UA-02" },
      { id: "SET-03", nome: "Setor Financeiro", unidadeId: "UA-03" },
      { id: "SET-04", nome: "Setor de Recursos Humanos", unidadeId: "UA-03" },
    ],
    regras: {
      titulacao: {
        "Especialização": 10,
        "Mestrado": 18,
        "Doutorado": 25,
        "Pós-Doutorado": 35,
      },
      producaoCientifica: 10,
      funcao: {
        "Administrativa": 10,
        "Acadêmica": 12,
        "Financeira": 15,
      },
      avaliacaoExcelenteMin: 9.0,
      avaliacaoBonusExcelente: 8,
      avaliacaoBoaMin: 7.0,
      avaliacaoBonusBoa: 4,
    },
    usuarios: [
      { id: "USR-RH", email: "rh.teste@urgen.edu.br", senha: "Urgen@2026", nome: "Fernanda Martins (RH)", perfil: "RH", ativo: true },
      { id: "USR-PROF", email: "joao.silva@urgen.edu.br", senha: "Urgen@2026", nome: "Prof. João Silva", perfil: "Professor", servidorId: "SRV-01", ativo: true },
      { id: "USR-FUNC", email: "ana.costa@urgen.edu.br", senha: "Urgen@2026", nome: "Ana Paula Costa", perfil: "Funcionário", servidorId: "SRV-03", ativo: true },
      { id: "USR-CHEF", email: "chefia.fin@urgen.edu.br", senha: "Urgen@2026", nome: "Roberto Almeida (Chefia Fin.)", perfil: "Chefia", setorId: "SET-03", ativo: true },
      { id: "USR-REIT", email: "reitor@urgen.edu.br", senha: "Urgen@2026", nome: "Magnífico Reitor Dr. Henrique", perfil: "Reitor", ativo: true },
      { id: "USR-SECR", email: "secretaria@urgen.edu.br", senha: "Urgen@2026", nome: "Carla Souza (Secretaria)", perfil: "Secretaria", ativo: true },
      { id: "USR-ALUN", email: "rafael.oliveira@urgen.edu.br", senha: "Urgen@2026", nome: "Rafael Oliveira (RA 22600123)", perfil: "Aluno", alunoRa: "22600123", ativo: true },
      { id: "USR-INAT", email: "inativo@urgen.edu.br", senha: "Urgen@2026", nome: "Servidor Afastado (Conta Inativa)", perfil: "Funcionário", ativo: false },
    ],
    servidores: [
      {
        id: "SRV-00",
        matricula: "MAT-1001",
        nome: "Prof. Ricardo Alves",
        endereco: "SQS 308, Bloco A – Brasília/DF",
        nascimento: "1975-06-12",
        admissao: "2010-02-01",
        salarioBase: 10259.26,
        salarioAtual: 13850.0,
        setorId: "SET-01",
        categoria: "Professor",
        titulacaoAtual: "Pós-Doutorado",
        ativo: true,
      },
      {
        id: "SRV-01",
        matricula: "MAT-1002",
        nome: "Prof. João Silva",
        endereco: "SQN 205, Bloco D – Brasília/DF",
        nascimento: "1982-09-20",
        admissao: "2016-03-10",
        salarioBase: 8500.0,
        salarioAtual: 8500.0,
        setorId: "SET-01",
        categoria: "Professor",
        titulacaoAtual: "Doutorado",
        ativo: true,
      },
      {
        id: "SRV-02",
        matricula: "MAT-1003",
        nome: "Profa. Maria Clara",
        endereco: "SHIN QI 05 – Lago Norte, Brasília/DF",
        nascimento: "1984-04-15",
        admissao: "2018-03-01",
        salarioBase: 8000.0,
        salarioAtual: 9840.0,
        setorId: "SET-02",
        categoria: "Professor",
        titulacaoAtual: "Mestrado",
        ativo: true,
      },
      {
        id: "SRV-03",
        matricula: "MAT-2001",
        nome: "Ana Paula Costa",
        endereco: "Águas Claras, Rua 14 Norte – DF",
        nascimento: "1990-11-03",
        admissao: "2019-08-15",
        salarioBase: 5200.0,
        salarioAtual: 5200.0,
        setorId: "SET-03",
        categoria: "Funcionário",
        funcaoAtual: "Financeira",
        ativo: true,
      },
      {
        id: "SRV-04",
        matricula: "MAT-2002",
        nome: "Marcos Pereira",
        endereco: "Guará II, QE 28 – Brasília/DF",
        nascimento: "1988-02-19",
        admissao: "2020-01-20",
        salarioBase: 4800.0,
        salarioAtual: 4800.0,
        setorId: "SET-03",
        categoria: "Funcionário",
        funcaoAtual: "Administrativa",
        ativo: true,
      },
    ],
    evolucoes: [
      {
        id: "EV-01",
        servidorId: "SRV-01",
        ano: "2026",
        tipo: "Titulação",
        detalhe: "Doutorado",
        descricao: "Conclusão de Doutorado em Ciência da Computação",
        comprovante: "diploma_doutorado.pdf",
        data: "2026-08-10",
        status: "Aprovado",
        justificativa: "",
      },
      {
        id: "EV-02",
        servidorId: "SRV-01",
        ano: "2026",
        tipo: "Produção Científica",
        detalhe: "Artigos Publicados",
        descricao: "2 Artigos em periódico Qualis A1",
        comprovante: "artigos_2026.pdf",
        data: "2026-09-12",
        status: "Aprovado",
        justificativa: "",
      },
      {
        id: "EV-03",
        servidorId: "SRV-03",
        ano: "2026",
        tipo: "Função Exercida",
        detalhe: "Financeira",
        descricao: "Designação para função estratégica financeira",
        comprovante: "portaria_fin_2026.pdf",
        data: "2026-07-05",
        status: "Aprovado",
        justificativa: "",
      },
      {
        id: "EV-04",
        servidorId: "SRV-02",
        ano: "2026",
        tipo: "Produção Científica",
        detalhe: "Livro Publicado",
        descricao: "Livro Engenharia e Qualidade de Software",
        comprovante: "isbn_livro.pdf",
        data: "2026-10-02",
        status: "Pendente",
        justificativa: "",
      },
    ],
    avaliacoes: [
      {
        id: "AV-01",
        servidorId: "SRV-03",
        ano: "2026",
        data: "2026-10-15",
        nota: 9.5,
        observacao: "Excelente desempenho na gestão orçamentária semestral.",
        avaliador: "Roberto Almeida (Chefia Fin.)",
      },
    ],
    historicoSalarial: [
      {
        id: "HS-00",
        ano: "2025",
        servidorId: "SRV-00",
        salarioBase: 10259.26,
        acrescimosDesc: "Pós-Doutorado (+35%)",
        novoSalario: 13850.0,
      },
      {
        id: "HS-01",
        ano: "2025",
        servidorId: "SRV-02",
        salarioBase: 8000.0,
        acrescimosDesc: "Mestrado + Produção (+23%)",
        novoSalario: 9840.0,
      },
    ],
    anosProcessados: [],
    cursos: [
      { id: "CUR-101", codigo: "CUR-101", nome: "Engenharia de Qualidade de Software", semestre: "2026/2", prazoAberto: true, status: "Aberto", baseInscritos: 20, dataCancelamento: "" },
      { id: "CUR-102", codigo: "CUR-102", nome: "Automação de Testes com Selenium", semestre: "2026/2", prazoAberto: true, status: "Aberto", baseInscritos: 22, dataCancelamento: "" },
      { id: "CUR-103", codigo: "CUR-103", nome: "Métricas e Estimativas de Software", semestre: "2026/2", prazoAberto: true, status: "Aberto", baseInscritos: 19, dataCancelamento: "" },
      { id: "CUR-104", codigo: "CUR-104", nome: "Auditoria e Conformidade LGPD", semestre: "2026/2", prazoAberto: true, status: "Aberto", baseInscritos: 19, dataCancelamento: "" },
    ],
    inscricoes: [
      {
        id: "INS-01",
        cursoId: "CUR-104",
        alunoRa: "22600123",
        alunoNome: "Rafael Oliveira",
        semestre: "2026/2",
        data: "02/08/2026",
        status: "Ativo",
        dataCancelamento: "",
      },
      {
        id: "INS-02",
        cursoId: "CUR-102",
        alunoRa: "22600123",
        alunoNome: "Rafael Oliveira",
        semestre: "2026/2",
        data: "01/08/2026",
        status: "Cancelado",
        dataCancelamento: "05/08/2026",
      },
    ],
    logs: [
      { id: "LOG-01", dataHora: "24/11/2026, 09:00:00", usuario: "SISTEMA", acao: "SEED_INICIAL", detalhe: "Base de homologação URGEN (Grupo 16) inicializada." },
    ],
  });

  let db = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : createInitialDB();
    } catch {
      return createInitialDB();
    }
  })();

  const saveDB = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Ignore storage quota issues in restricted contexts
    }
  };

  const addLog = (usuario, acao, detalhe) => {
    db.logs.unshift({
      id: `LOG-${String(db.logs.length + 1).padStart(3, "0")}`,
      dataHora: nowBR(),
      usuario,
      acao,
      detalhe,
    });
    saveDB();
  };

  let currentUser = null;
  let currentTab = "";
  let courseStatusFilter = "Todos";
  let reportFilter = { semestre: "2026/2", tipo: "professores" };
  let lastCalcPreview = null;

  // ==================== DEFERRED VALIDATION (:user-invalid) + ARIA SYNC ====================
  const linkError = (el, shown) => {
    const errorId = el.dataset?.error;
    if (!errorId) return;
    const ids = (el.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
    else el.removeAttribute("aria-describedby");
  };

  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.classList.add("visually-hidden");
  document.body.append(announcer);
  let announceTimer;
  let announcedField;

  const spokenText = (node) => {
    const copy = node.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    copy.querySelectorAll('[role="img"][aria-label]').forEach((n) =>
      n.replaceWith(`${n.getAttribute("aria-label")}: `)
    );
    return copy.textContent.replace(/\s+/g, " ").trim();
  };

  const announceError = (el) => {
    const error = document.getElementById(el.dataset.error);
    if (!error) return;
    const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : "";
    clearTimeout(announceTimer);
    announcer.textContent = "";
    announcedField = el;
    announceTimer = setTimeout(() => {
      announcer.textContent = label + spokenText(error);
    }, 500);
  };

  const supportsUserInvalid = CSS.supports("selector(:user-invalid)");
  const dirtyMap = new WeakMap();
  const flagged = new WeakSet();
  const announced = new WeakSet();

  const syncAria = (el, announce = false) => {
    if (!el.matches?.("input, select, textarea")) return;
    let invalid = false;
    if (supportsUserInvalid) {
      invalid = el.matches(":user-invalid");
    } else {
      const st = dirtyMap.get(el);
      invalid = Boolean(st?.hasInteracted && st?.hasBlurred && !el.validity.valid);
      el.classList.toggle("user-invalid-fallback", invalid);
    }

    if (invalid) {
      if (announce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute("aria-invalid", "true");
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute("aria-invalid") !== "true") {
      el.setAttribute("aria-invalid", "false");
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el) {
        clearTimeout(announceTimer);
        announcer.textContent = "";
      }
    }
  };

  const initAriaFields = (root = document) => {
    root.querySelectorAll("input, select, textarea").forEach((el) => syncAria(el));
  };

  document.addEventListener(
    "blur",
    (e) => {
      if (!e.target.matches?.("input, select, textarea")) return;
      const st = dirtyMap.get(e.target) || { hasInteracted: false, hasBlurred: false };
      st.hasBlurred = true;
      dirtyMap.set(e.target, st);
      syncAria(e.target, true);
    },
    true
  );

  document.addEventListener("input", (e) => {
    if (!e.target.matches?.("input, select, textarea")) return;
    const st = dirtyMap.get(e.target) || { hasInteracted: false, hasBlurred: false };
    st.hasInteracted = true;
    dirtyMap.set(e.target, st);
    e.target.setCustomValidity("");
    if (e.target.hasAttribute("aria-invalid")) syncAria(e.target);
  });

  document.addEventListener("change", (e) => {
    if (!e.target.matches?.("input, select, textarea")) return;
    const st = dirtyMap.get(e.target) || { hasInteracted: true, hasBlurred: true };
    st.hasInteracted = true;
    dirtyMap.set(e.target, st);
    syncAria(e.target, true);
  });

  document.addEventListener(
    "invalid",
    (e) => {
      if (!e.target.matches?.("input, select, textarea")) return;
      dirtyMap.set(e.target, { hasInteracted: true, hasBlurred: true });
      announced.add(e.target);
      syncAria(e.target);
    },
    true
  );

  document.addEventListener(
    "reset",
    (e) => {
      setTimeout(() => {
        [...(e.target.elements || [])].forEach((el) => {
          dirtyMap.delete(el);
          el.classList?.remove("user-invalid-fallback");
          syncAria(el);
        });
      });
    },
    true
  );

  // ==================== MODAL CONFIRMATION HELPER (<dialog>) ====================
  const confirmDialog = document.getElementById("confirm-dialog");
  const confirmTitle = document.getElementById("confirm-title");
  const confirmMessage = document.getElementById("confirm-message");
  let pendingConfirmResolve = null;

  confirmDialog.addEventListener("close", () => {
    const choice = confirmDialog.returnValue === "confirm";
    // Reset returnValue so Esc / subsequent dismissals never leak stale state
    confirmDialog.returnValue = "";
    if (pendingConfirmResolve) {
      const resolve = pendingConfirmResolve;
      pendingConfirmResolve = null;
      resolve(choice);
    }
  });

  const askConfirmation = (title, message) =>
    new Promise((resolve) => {
      pendingConfirmResolve = resolve;
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      confirmDialog.showModal();
    });

  // RH Rejection Modal with mandatory justification
  const rejectDialog = document.getElementById("reject-dialog");
  const rejectForm = document.getElementById("reject-form");
  const rejectReasonInput = document.getElementById("reject-reason");
  let pendingRejectEvoId = null;

  document.getElementById("btn-reject-cancel").addEventListener("click", () => {
    rejectDialog.returnValue = "";
    rejectDialog.close();
  });

  rejectDialog.addEventListener("close", () => {
    rejectDialog.returnValue = "";
  });

  rejectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const reason = rejectReasonInput.value.trim();
    if (reason.length < 5) {
      rejectReasonInput.reportValidity();
      rejectReasonInput.focus();
      return;
    }
    const evo = db.evolucoes.find((ev) => ev.id === pendingRejectEvoId);
    if (evo) {
      evo.status = "Recusado";
      evo.justificativa = reason;
      addLog(currentUser.email, "RECUSA_EVOLUCAO", `Evolução ${evo.id} recusada. Motivo: ${reason}`);
      showBanner("Evolução recusada. Justificativa registrada e enviada ao servidor.", "info");
    }
    pendingRejectEvoId = null;
    rejectForm.reset();
    rejectDialog.close();
    renderActiveTab();
  });

  // ==================== STATUS BANNER ====================
  const statusBanner = document.getElementById("status-banner");
  const statusBannerText = document.getElementById("status-banner-text");

  const showBanner = (msg, kind = "success") => {
    statusBanner.className = `status-banner ${kind}`;
    statusBannerText.textContent = msg;
    statusBanner.hidden = false;
  };

  document.getElementById("btn-dismiss-banner").addEventListener("click", () => {
    statusBanner.hidden = true;
  });

  // ==================== HELPERS FOR DOMAIN ====================
  const getSetorLabel = (setorId) => {
    const setor = db.setores.find((s) => s.id === setorId);
    if (!setor) return "—";
    const ua = db.unidades.find((u) => u.id === setor.unidadeId);
    return ua ? `${setor.nome} (${ua.nome})` : setor.nome;
  };

  const countActiveEnrollments = (curso) => {
    const extraActive = db.inscricoes.filter(
      (i) => i.cursoId === curso.id && i.status === "Ativo"
    ).length;
    return curso.baseInscritos + extraActive;
  };

  const renderBadge = (status) => {
    if (status === "Aprovado" || status === "Ativo") {
      return `<span class="badge badge-active"><span aria-hidden="true">✔</span> ${escapeHtml(status)}</span>`;
    }
    if (status === "Cancelado" || status === "Recusado" || status === "Inativo") {
      return `<span class="badge badge-cancelled"><span aria-hidden="true">✖</span> ${escapeHtml(status)}</span>`;
    }
    return `<span class="badge badge-pending"><span aria-hidden="true">⏳</span> ${escapeHtml(status)}</span>`;
  };

  // ==================== NAVIGATION BY PROFILE (RBAC - RF001) ====================
  const getTabsForRole = (role) => {
    switch (role) {
      case "RH":
        return [
          { id: "rh-servidores", label: "Estrutura & Servidores (UC002)" },
          { id: "rh-validacoes", label: "Validar Evoluções (UC003)" },
          { id: "rh-calculo", label: "Cálculo Salarial Anual (UC005)" },
          { id: "rh-logs", label: "Logs de Auditoria (RF017)" },
        ];
      case "Professor":
      case "Funcionário":
        return [
          { id: "srv-evolucoes", label: "Minhas Evoluções (UC003)" },
          { id: "srv-historico", label: "Meus Dados & Histórico Salarial (UC005)" },
          { id: "rbac-test", label: "Testar Rota Restrita Reitor (CT-12)" },
        ];
      case "Chefia":
        return [
          { id: "chefia-avaliacoes", label: "Avaliações do Setor (UC004)" },
        ];
      case "Reitor":
        return [
          { id: "reitor-relatorios", label: "Relatórios Semestrais (UC006)" },
        ];
      case "Secretaria":
        return [
          { id: "sec-cursos", label: "Cursos Semestrais (< 20 Alunos) (UC007)" },
          { id: "sec-inscricoes", label: "Histórico de Inscrições (RF016)" },
        ];
      case "Aluno":
        return [
          { id: "aluno-inscricoes", label: "Inscrições em Cursos (UC008)" },
          { id: "rbac-test", label: "Testar Rota Restrita Reitor (CT-20)" },
        ];
      default:
        return [];
    }
  };

  const renderNav = () => {
    const nav = document.getElementById("app-nav");
    const navList = document.getElementById("nav-list");
    if (!currentUser) {
      nav.hidden = true;
      navList.innerHTML = "";
      return;
    }
    const tabs = getTabsForRole(currentUser.perfil);
    nav.hidden = false;
    navList.innerHTML = tabs
      .map(
        (t) =>
          `<li><button type="button" class="nav-btn" data-tab="${escapeHtml(t.id)}" ${
            t.id === currentTab ? 'aria-current="page"' : ""
          }>${escapeHtml(t.label)}</button></li>`
      )
      .join("");
  };

  document.getElementById("nav-list").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (!btn) return;
    currentTab = btn.dataset.tab;
    statusBanner.hidden = true;
    renderNav();
    renderActiveTab();
  });

  // ==================== VIEWS RENDERING ====================
  const appViews = document.getElementById("app-views");
  const pageTitle = document.getElementById("page-title");

  const renderActiveTab = () => {
    if (!currentUser) return;

    // RBAC Check for restricted Rector report tab (CT-12 / CT-19 / CT-20)
    if (currentTab === "rbac-test" || (currentTab === "reitor-relatorios" && currentUser.perfil !== "Reitor")) {
      addLog(currentUser.email, "ACESSO_NEGADO_403", `Tentativa bloqueada de acesso a /reitor/relatorios pelo perfil ${currentUser.perfil}.`);
      pageTitle.textContent = "HTTP 403 – Acesso Negado (RBAC – RF001)";
      appViews.innerHTML = `
        <div class="card">
          <h2>Bloqueio de Segurança (Controle de Acesso Baseado em Perfis)</h2>
          <p class="card-subtitle">Acesso negado: o perfil <strong>${escapeHtml(currentUser.perfil)}</strong> não possui permissão para visualizar os Relatórios Semestrais exclusivos da Reitoria (RNF001).</p>
          <p>Esta tentativa foi registrada automaticamente no <strong>Log de Auditoria</strong> (RF017).</p>
        </div>
      `;
      pageTitle.focus();
      return;
    }

    if (currentTab === "rh-servidores") renderRHServidores();
    else if (currentTab === "rh-validacoes") renderRHValidacoes();
    else if (currentTab === "rh-calculo") renderRHCalculo();
    else if (currentTab === "rh-logs") renderRHLogs();
    else if (currentTab === "srv-evolucoes") renderServidorEvolucoes();
    else if (currentTab === "srv-historico") renderServidorHistorico();
    else if (currentTab === "chefia-avaliacoes") renderChefiaAvaliacoes();
    else if (currentTab === "reitor-relatorios") renderReitorRelatorios();
    else if (currentTab === "sec-cursos") renderSecretariaCursos();
    else if (currentTab === "sec-inscricoes") renderSecretariaInscricoes();
    else if (currentTab === "aluno-inscricoes") renderAlunoInscricoes();

    initAriaFields(appViews);
  };

  // ---------- 1) RH: ESTRUTURA & SERVIDORES (UC002) ----------
  const renderRHServidores = () => {
    pageTitle.textContent = "Recursos Humanos – Estrutura Organizacional e Servidores (UC002)";
    const setorOpts = db.setores
      .map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(getSetorLabel(s.id))}</option>`)
      .join("");

    const rows = db.servidores
      .map(
        (s) => `
        <tr>
          <th scope="row">${escapeHtml(s.nome)} <small>(${escapeHtml(s.matricula)})</small></th>
          <td>${escapeHtml(s.categoria)}</td>
          <td>${escapeHtml(getSetorLabel(s.setorId))}</td>
          <td>${formatBRL(s.salarioBase)}</td>
          <td><strong>${formatBRL(s.salarioAtual)}</strong></td>
          <td>
            ${renderBadge(s.ativo ? "Ativo" : "Inativo")}
            ${
              s.ativo
                ? `<button type="button" class="btn btn-secondary btn-sm" data-action="inativar-servidor" data-id="${escapeHtml(s.id)}">Inativar</button>`
                : ""
            }
          </td>
        </tr>`
      )
      .join("");

    appViews.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><span>Unidades Administrativas</span><strong>${db.unidades.length}</strong></div>
        <div class="stat-card"><span>Setores Vinculados</span><strong>${db.setores.length}</strong></div>
        <div class="stat-card"><span>Servidores Cadastrados</span><strong>${db.servidores.length}</strong></div>
      </div>

      <div class="card">
        <h2 id="form-srv-title">Cadastrar Novo Servidor Público (RF002, RF003, RF017)</h2>
        <p class="card-subtitle">Valida campos obrigatórios, vínculo Setor → Unidade Administrativa, bloqueio de matrícula duplicada e confirmação crítica.</p>
        <form id="form-servidor" action="#/rh/servidores" method="POST" aria-labelledby="form-srv-title" novalidate>
          <fieldset class="radio-group">
            <legend>Categoria do Servidor <span class="req" aria-hidden="true">*</span></legend>
            <div class="radio-options">
              <div class="radio-item">
                <input type="radio" id="cat-prof" name="categoria" value="Professor" checked required>
                <label for="cat-prof">Professor (Titulação + Produção Científica)</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="cat-func" name="categoria" value="Funcionário" required>
                <label for="cat-func">Funcionário (Função Exercida + Avaliação Chefia)</label>
              </div>
            </div>
          </fieldset>

          <div class="form-grid">
            <div class="field">
              <label for="srv-matricula">Matrícula Institucional <span class="req" aria-hidden="true">*</span></label>
              <span id="srv-mat-hint" class="hint">Ex.: MAT-1009 (teste duplicidade com MAT-1001)</span>
              <input type="text" id="srv-matricula" name="matricula" required autocorrect="off" autocapitalize="characters" spellcheck="false" aria-describedby="srv-mat-hint" data-error="srv-mat-err">
              <div id="srv-mat-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe a matrícula institucional.</div>
            </div>

            <div class="field">
              <label for="srv-nome">Nome Completo <span class="req" aria-hidden="true">*</span></label>
              <span id="srv-nome-hint" class="hint">Nome civil completo do servidor</span>
              <input type="text" id="srv-nome" name="nome" required autocomplete="name" aria-describedby="srv-nome-hint" data-error="srv-nome-err">
              <div id="srv-nome-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe o nome completo do servidor.</div>
            </div>

            <div class="field">
              <label for="srv-salario">Salário Base (R$) <span class="req" aria-hidden="true">*</span></label>
              <span id="srv-sal-hint" class="hint">Valor positivo (ex.: 8500)</span>
              <input type="number" id="srv-salario" name="salarioBase" required min="1412" step="0.01" aria-describedby="srv-sal-hint" data-error="srv-sal-err">
              <div id="srv-sal-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe um salário base válido (mín. R$ 1.412,00).</div>
            </div>

            <div class="field">
              <label for="srv-nasc">Data de Nascimento <span class="req" aria-hidden="true">*</span></label>
              <span class="hint">Data de nascimento do servidor</span>
              <input type="date" id="srv-nasc" name="nascimento" required data-error="srv-nasc-err">
              <div id="srv-nasc-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe uma data de nascimento válida.</div>
            </div>

            <div class="field">
              <label for="srv-adm">Data de Admissão <span class="req" aria-hidden="true">*</span></label>
              <span class="hint">Data de ingresso na URGEN</span>
              <input type="date" id="srv-adm" name="admissao" required data-error="srv-adm-err">
              <div id="srv-adm-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe a data de admissão.</div>
            </div>

            <div class="field">
              <label for="srv-setor">Setor de Lotação (Unidade Administrativa) <span class="req" aria-hidden="true">*</span></label>
              <span class="hint">Todo setor pertence a uma unidade administrativa</span>
              <select id="srv-setor" name="setorId" required data-error="srv-setor-err">
                <option value="">Selecione um setor...</option>
                ${setorOpts}
              </select>
              <div id="srv-setor-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Selecione obrigatoriamente o setor de lotação.</div>
            </div>
          </div>

          <div class="field">
            <label for="srv-endereco">Endereço Residencial <span class="req" aria-hidden="true">*</span></label>
            <input type="text" id="srv-endereco" name="endereco" required autocomplete="street-address" data-error="srv-end-err">
            <div id="srv-end-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe o endereço residencial.</div>
          </div>

          <div class="btn-row">
            <button type="submit" class="btn btn-success">Salvar Servidor</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h2>Servidores Públicos Cadastrados</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-servidores" class="table-wrapper">
          <table style="--label-2:'Categoria'; --label-3:'Setor / Unidade'; --label-4:'Salário Base'; --label-5:'Salário Atual'; --label-6:'Status';">
            <caption id="cap-servidores">Quadro de servidores públicos ativos e inativos da URGEN</caption>
            <thead>
              <tr>
                <th scope="col">Servidor</th>
                <th scope="col">Categoria</th>
                <th scope="col">Setor (Unidade Administrativa)</th>
                <th scope="col">Salário Base</th>
                <th scope="col">Salário Vigente</th>
                <th scope="col">Status / Ação</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 2) RH: VALIDAR EVOLUÇÕES (UC003 / RF008) ----------
  const renderRHValidacoes = () => {
    pageTitle.textContent = "Recursos Humanos – Validação de Evoluções de Carreira (UC003 / RF008)";
    const rows = db.evolucoes
      .map((ev) => {
        const srv = db.servidores.find((s) => s.id === ev.servidorId);
        return `
          <tr>
            <th scope="row">${escapeHtml(srv?.nome || ev.servidorId)}</th>
            <td>${escapeHtml(srv?.categoria || "—")}</td>
            <td><strong>${escapeHtml(ev.tipo)}: ${escapeHtml(ev.detalhe)}</strong><br><small>${escapeHtml(ev.descricao)} (${escapeHtml(ev.comprovante)})</small></td>
            <td>${escapeHtml(ev.ano)}</td>
            <td>${renderBadge(ev.status)}${ev.justificativa ? `<br><small>Motivo: ${escapeHtml(ev.justificativa)}</small>` : ""}</td>
            <td>
              ${
                ev.status === "Pendente"
                  ? `<button type="button" class="btn btn-success btn-sm" data-action="aprovar-evo" data-id="${escapeHtml(ev.id)}">Aprovar</button>
                     <button type="button" class="btn btn-danger btn-sm" data-action="recusar-evo" data-id="${escapeHtml(ev.id)}">Recusar</button>`
                  : "—"
              }
            </td>
          </tr>`;
      })
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2>Evoluções Voluntárias Encaminhadas pelos Servidores</h2>
        <p class="card-subtitle">Apenas evoluções com status <strong>Aprovado</strong> são contabilizadas no cálculo salarial anual (UC005). A recusa exige justificativa obrigatória.</p>
        <div tabindex="0" role="region" aria-labelledby="cap-evos-rh" class="table-wrapper">
          <table style="--label-2:'Categoria'; --label-3:'Evolução'; --label-4:'Ano'; --label-5:'Status'; --label-6:'Ação RH';">
            <caption id="cap-evos-rh">Solicitações de evolução funcional registradas no sistema</caption>
            <thead>
              <tr>
                <th scope="col">Servidor</th>
                <th scope="col">Categoria</th>
                <th scope="col">Evolução e Comprovante</th>
                <th scope="col">Ano</th>
                <th scope="col">Status RH</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 3) RH: CÁLCULO SALARIAL ANUAL ACUMULADO (UC005 / RF009) ----------
  const computeSalaryPreview = (ano) =>
    db.servidores
      .filter((s) => s.ativo)
      .map((srv) => {
        const evos = db.evolucoes.filter(
          (e) => e.servidorId === srv.id && e.ano === ano && e.status === "Aprovado"
        );
        let pctTotal = 0;
        const detalhes = [];

        if (srv.categoria === "Professor") {
          for (const ev of evos) {
            if (ev.tipo === "Titulação") {
              const p = db.regras.titulacao[ev.detalhe] || 0;
              pctTotal += p;
              detalhes.push(`${ev.detalhe} (+${p}%)`);
            } else if (ev.tipo === "Produção Científica") {
              const p = db.regras.producaoCientifica;
              pctTotal += p;
              detalhes.push(`Produção Científica (+${p}%)`);
            }
          }
        } else {
          for (const ev of evos) {
            const p = db.regras.funcao[ev.detalhe] || 10;
            pctTotal += p;
            detalhes.push(`Função ${ev.detalhe} (+${p}%)`);
          }
          const avals = db.avaliacoes.filter((a) => a.servidorId === srv.id && a.ano === ano);
          if (avals.length > 0) {
            const maxNota = Math.max(...avals.map((a) => a.nota));
            if (maxNota >= db.regras.avaliacaoExcelenteMin) {
              pctTotal += db.regras.avaliacaoBonusExcelente;
              detalhes.push(`Avaliação ${maxNota.toFixed(1)} (+${db.regras.avaliacaoBonusExcelente}%)`);
            } else if (maxNota >= db.regras.avaliacaoBoaMin) {
              pctTotal += db.regras.avaliacaoBonusBoa;
              detalhes.push(`Avaliação ${maxNota.toFixed(1)} (+${db.regras.avaliacaoBonusBoa}%)`);
            }
          }
        }

        const base = srv.salarioAtual;
        const novoSalario =
          pctTotal > 0 ? Math.round(srv.salarioBase * (1 + pctTotal / 100) * 100) / 100 : base;

        return {
          servidorId: srv.id,
          nome: srv.nome,
          categoria: srv.categoria,
          salarioBase: srv.salarioBase,
          salarioAnterior: base,
          detalhes: detalhes.length > 0 ? detalhes.join(" + ") : "Sem novas evoluções no ano",
          novoSalario,
          teveEvolucao: pctTotal > 0,
        };
      });

  const renderRHCalculo = () => {
    pageTitle.textContent = "Recursos Humanos – Processamento Anual de Salários (UC005)";
    const previewRows = lastCalcPreview
      ? lastCalcPreview.items
          .map(
            (it) => `
          <tr>
            <th scope="row">${escapeHtml(it.nome)}</th>
            <td>${escapeHtml(it.categoria)}</td>
            <td>${formatBRL(it.salarioBase)}</td>
            <td>${escapeHtml(it.detalhes)}</td>
            <td><strong>${formatBRL(it.novoSalario)}</strong></td>
          </tr>`
          )
          .join("")
      : "";

    appViews.innerHTML = `
      <div class="card">
        <h2 id="calc-heading">Executar Cálculo Anual Acumulado (RF009, RF010, RF017)</h2>
        <p class="card-subtitle">Aplica fórmulas distintas por categoria: <strong>Professor</strong> (titulação + produção científica) e <strong>Funcionário</strong> (função exercida + melhoria na avaliação da Chefia).</p>
        <form id="form-calculo" action="#/rh/calculo" method="POST" aria-labelledby="calc-heading">
          <div class="form-grid">
            <div class="field">
              <label for="calc-ano">Ano-Base de Referência <span class="req" aria-hidden="true">*</span></label>
              <select id="calc-ano" name="ano" required>
                <option value="2026" selected>2026 (Com evoluções aprovadas)</option>
                <option value="2027">2027 (Sem regras/evoluções cadastradas)</option>
              </select>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn-primary">Simular Prévia do Cálculo Anual</button>
            ${
              lastCalcPreview
                ? `<button type="button" class="btn btn-success" id="btn-confirmar-calculo">Confirmar e Gravar Histórico (${escapeHtml(lastCalcPreview.ano)})</button>`
                : ""
            }
          </div>
        </form>
      </div>

      ${
        lastCalcPreview
          ? `<div class="card">
              <h2>Prévia Calculada – Ano-Base ${escapeHtml(lastCalcPreview.ano)}</h2>
              <div tabindex="0" role="region" aria-labelledby="cap-previa" class="table-wrapper">
                <table style="--label-2:'Categoria'; --label-3:'Salário Base'; --label-4:'Adicionais Validados'; --label-5:'Novo Salário';">
                  <caption id="cap-previa">Valores acumulados calculados com precisão de duas casas decimais (RNF004)</caption>
                  <thead>
                    <tr>
                      <th scope="col">Servidor</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Salário Base</th>
                      <th scope="col">Adicionais / Extras Aprovados</th>
                      <th scope="col">Novo Salário Calculado</th>
                    </tr>
                  </thead>
                  <tbody>${previewRows}</tbody>
                </table>
              </div>
            </div>`
          : ""
      }
    `;
  };

  // ---------- 4) RH: LOGS DE AUDITORIA (RF017) ----------
  const renderRHLogs = () => {
    pageTitle.textContent = "Trilha de Auditoria do Sistema (RF017)";
    const rows = db.logs
      .map(
        (l) => `
        <tr>
          <th scope="row">${escapeHtml(l.id)}</th>
          <td>${escapeHtml(l.dataHora)}</td>
          <td>${escapeHtml(l.usuario)}</td>
          <td><code>${escapeHtml(l.acao)}</code></td>
          <td>${escapeHtml(l.detalhe)}</td>
        </tr>`
      )
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2>Eventos Registrados em Log</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-logs" class="table-wrapper">
          <table style="--label-2:'Data/Hora'; --label-3:'Usuário'; --label-4:'Operação'; --label-5:'Detalhe';">
            <caption id="cap-logs">Registro cronológico de autenticações, alterações críticas e bloqueios RBAC</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Data / Hora</th>
                <th scope="col">Usuário</th>
                <th scope="col">Operação</th>
                <th scope="col">Detalhes</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 5) SERVIDOR: MINHAS EVOLUÇÕES (UC003 / RF005 / RF006) ----------
  const renderServidorEvolucoes = () => {
    const srv = db.servidores.find((s) => s.id === currentUser.servidorId);
    const isProf = srv?.categoria === "Professor";
    pageTitle.textContent = `Minhas Evoluções de Carreira – ${srv?.categoria || ""}`;

    const tipoOptions = isProf
      ? `
        <option value="Titulação|Especialização">Titulação – Especialização (+10%)</option>
        <option value="Titulação|Mestrado">Titulação – Mestrado (+18%)</option>
        <option value="Titulação|Doutorado">Titulação – Doutorado (+25%)</option>
        <option value="Titulação|Pós-Doutorado">Titulação – Pós-Doutorado (+35%)</option>
        <option value="Produção Científica|Livro Publicado">Produção Científica – Livro Publicado (+10%)</option>
        <option value="Produção Científica|Artigos Publicados">Produção Científica – Artigo Científico (+10%)</option>
        <option value="Produção Científica|Palestra">Produção Científica – Palestra (+10%)</option>
      `
      : `
        <option value="Função Exercida|Administrativa">Função Exercida – Administrativa (+10%)</option>
        <option value="Função Exercida|Acadêmica">Função Exercida – Acadêmica (+12%)</option>
        <option value="Função Exercida|Financeira">Função Exercida – Financeira (+15%)</option>
        <option value="Novo Cargo|Coordenação Setorial">Novo Cargo – Coordenação Setorial (+12%)</option>
      `;

    const myEvos = db.evolucoes
      .filter((e) => e.servidorId === srv?.id)
      .map(
        (e) => `
        <tr>
          <th scope="row">${escapeHtml(e.tipo)} – ${escapeHtml(e.detalhe)}</th>
          <td>${escapeHtml(e.descricao)}</td>
          <td>${escapeHtml(e.comprovante)}</td>
          <td>${escapeHtml(e.ano)}</td>
          <td>${renderBadge(e.status)}${e.justificativa ? `<br><small>Justificativa RH: ${escapeHtml(e.justificativa)}</small>` : ""}</td>
        </tr>`
      )
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2 id="evo-form-title">Informar Voluntariamente Nova Evolução ao RH (${isProf ? "RF005 – Professor" : "RF006 – Funcionário"})</h2>
        <p class="card-subtitle">O formulário exibe dinamicamente apenas os critérios aplicáveis à sua categoria funcional (RNF003).</p>
        <form id="form-evolucao" action="#/carreira/evolucoes" method="POST" aria-labelledby="evo-form-title" novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="evo-tipo">Tipo de Evolução <span class="req" aria-hidden="true">*</span></label>
              <select id="evo-tipo" name="tipoComposto" required data-error="evo-tipo-err">
                <option value="">Selecione...</option>
                ${tipoOptions}
              </select>
              <div id="evo-tipo-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Selecione o tipo de evolução.</div>
            </div>

            <div class="field">
              <label for="evo-data">Data de Obtenção <span class="req" aria-hidden="true">*</span></label>
              <input type="date" id="evo-data" name="data" required data-error="evo-data-err">
              <div id="evo-data-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe uma data válida.</div>
            </div>

            <div class="field">
              <label for="evo-comp">Documento Comprobatório (Nome PDF) <span class="req" aria-hidden="true">*</span></label>
              <span id="evo-comp-hint" class="hint">Ex.: certificado_doutorado.pdf</span>
              <input type="text" id="evo-comp" name="comprovante" required aria-describedby="evo-comp-hint" data-error="evo-comp-err">
              <div id="evo-comp-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe o comprovante anexado.</div>
            </div>
          </div>

          <div class="field">
            <label for="evo-desc">Descrição Detalhada <span class="req" aria-hidden="true">*</span></label>
            <input type="text" id="evo-desc" name="descricao" required minlength="5" data-error="evo-desc-err">
            <div id="evo-desc-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Descreva a evolução (mínimo 5 caracteres).</div>
          </div>

          <div class="btn-row">
            <button type="submit" class="btn btn-primary">Enviar Evolução ao RH</button>
            <button type="reset" class="btn btn-secondary">Limpar / Cancelar</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h2>Minhas Solicitações Enviadas</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-minhas-evos" class="table-wrapper">
          <table style="--label-2:'Descrição'; --label-3:'Comprovante'; --label-4:'Ano'; --label-5:'Status RH';">
            <caption id="cap-minhas-evos">Acompanhamento das evoluções enviadas por ${escapeHtml(srv?.nome)}</caption>
            <thead>
              <tr>
                <th scope="col">Tipo / Grau</th>
                <th scope="col">Descrição</th>
                <th scope="col">Comprovante</th>
                <th scope="col">Ano</th>
                <th scope="col">Status no RH</th>
              </tr>
            </thead>
            <tbody>${myEvos || '<tr><td colspan="5">Nenhuma evolução enviada.</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 6) SERVIDOR: HISTÓRICO SALARIAL INDIVIDUAL (RF010) ----------
  const renderServidorHistorico = () => {
    const srv = db.servidores.find((s) => s.id === currentUser.servidorId);
    pageTitle.textContent = "Meus Dados Funcionais e Histórico Salarial (RF010)";
    const hist = db.historicoSalarial
      .filter((h) => h.servidorId === srv?.id)
      .map(
        (h) => `
        <tr>
          <th scope="row">${escapeHtml(h.ano)}</th>
          <td>${formatBRL(h.salarioBase)}</td>
          <td>${escapeHtml(h.acrescimosDesc)}</td>
          <td><strong>${formatBRL(h.novoSalario)}</strong></td>
        </tr>`
      )
      .join("");

    appViews.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><span>Servidor</span><strong>${escapeHtml(srv?.nome)}</strong></div>
        <div class="stat-card"><span>Categoria / Setor</span><strong>${escapeHtml(srv?.categoria)}</strong></div>
        <div class="stat-card"><span>Salário Base</span><strong>${formatBRL(srv?.salarioBase)}</strong></div>
        <div class="stat-card"><span>Salário Vigente</span><strong>${formatBRL(srv?.salarioAtual)}</strong></div>
      </div>
      <div class="card">
        <h2>Meu Extrato Anual de Evolução Salarial</h2>
        <p class="card-subtitle">Por segurança e conformidade LGPD (RNF001 / RNF005), você visualiza exclusivamente seus próprios registros remuneratórios.</p>
        <div tabindex="0" role="region" aria-labelledby="cap-meu-hist" class="table-wrapper">
          <table style="--label-2:'Salário Base'; --label-3:'Acréscimos'; --label-4:'Salário Calculado';">
            <caption id="cap-meu-hist">Histórico salarial anual consolidado</caption>
            <thead>
              <tr>
                <th scope="col">Ano-Base</th>
                <th scope="col">Salário Base</th>
                <th scope="col">Acréscimos Validados</th>
                <th scope="col">Novo Salário</th>
              </tr>
            </thead>
            <tbody>${hist || '<tr><td colspan="4">Execute o fechamento de 2026 com o perfil RH para visualizar o novo registro anual aqui.</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 7) CHEFIA: AVALIAÇÕES DE DESEMPENHO (UC004 / RF007) ----------
  const renderChefiaAvaliacoes = () => {
    pageTitle.textContent = "Chefia de Setor – Avaliação Periódica de Funcionários (UC004)";
    const funcionariosSetor = db.servidores.filter(
      (s) => s.ativo && s.categoria === "Funcionário" && s.setorId === currentUser.setorId
    );
    const funcOpts = funcionariosSetor
      .map((f) => `<option value="${escapeHtml(f.id)}">${escapeHtml(f.nome)} (${escapeHtml(f.matricula)})</option>`)
      .join("");

    const avalRows = db.avaliacoes
      .filter((a) => funcionariosSetor.some((f) => f.id === a.servidorId))
      .map((a) => {
        const f = db.servidores.find((s) => s.id === a.servidorId);
        return `
          <tr>
            <th scope="row">${escapeHtml(f?.nome || a.servidorId)}</th>
            <td>${escapeHtml(a.data)}</td>
            <td><strong>${a.nota.toFixed(1)}</strong></td>
            <td>${escapeHtml(a.observacao)}</td>
          </tr>`;
      })
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2 id="aval-form-title">Registrar Avaliação no ${escapeHtml(getSetorLabel(currentUser.setorId))} (RF007)</h2>
        <p class="card-subtitle">Escopo estrito: lista apenas servidores da categoria <strong>Funcionário</strong> lotados neste setor. Análise de Valor Limite: nota entre <strong>0,0 e 10,0</strong> (teste digitar 10,5 ou -0,5).</p>
        <form id="form-avaliacao" action="#/chefia/avaliacoes" method="POST" aria-labelledby="aval-form-title" novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="aval-srv">Funcionário do Setor <span class="req" aria-hidden="true">*</span></label>
              <select id="aval-srv" name="servidorId" required data-error="aval-srv-err">
                <option value="">Selecione...</option>
                ${funcOpts}
              </select>
              <div id="aval-srv-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Selecione um funcionário do setor.</div>
            </div>

            <div class="field">
              <label for="aval-data">Data da Avaliação <span class="req" aria-hidden="true">*</span></label>
              <input type="date" id="aval-data" name="data" value="2026-10-20" required data-error="aval-dt-err">
              <div id="aval-dt-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Informe a data da avaliação.</div>
            </div>

            <div class="field">
              <label for="aval-nota">Nota de Desempenho (0,0 a 10,0) <span class="req" aria-hidden="true">*</span></label>
              <span id="aval-nota-hint" class="hint">Intervalo válido exato: 0,0 até 10,0</span>
              <input type="number" id="aval-nota" name="nota" required min="0" max="10" step="0.1" aria-describedby="aval-nota-hint" data-error="aval-nota-err">
              <div id="aval-nota-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Erro: A nota de avaliação deve estar estritamente entre 0,0 e 10,0.</div>
            </div>
          </div>

          <div class="field">
            <label for="aval-obs">Observações da Chefia <span class="req" aria-hidden="true">*</span></label>
            <textarea id="aval-obs" name="observacao" required minlength="5" data-error="aval-obs-err"></textarea>
            <div id="aval-obs-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Registre observações sobre o desempenho avaliado.</div>
          </div>

          <div class="btn-row">
            <button type="submit" class="btn btn-success">Registrar Avaliação</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h2>Histórico de Avaliações do Setor</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-avals" class="table-wrapper">
          <table style="--label-2:'Data'; --label-3:'Nota'; --label-4:'Observações';">
            <caption id="cap-avals">Avaliações registradas pela chefia no setor atual</caption>
            <thead>
              <tr>
                <th scope="col">Funcionário</th>
                <th scope="col">Data</th>
                <th scope="col">Nota (0–10)</th>
                <th scope="col">Observações</th>
              </tr>
            </thead>
            <tbody>${avalRows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 8) REITOR: RELATÓRIOS SEMESTRAIS (UC006 / RF011 / RF012) ----------
  const renderReitorRelatorios = () => {
    pageTitle.textContent = "Reitoria – Relatórios Gerenciais Semestrais (UC006)";
    const sem = reportFilter.semestre;
    const isProfReport = reportFilter.tipo === "professores";

    let contentHtml = "";
    if (sem === "2028/1") {
      contentHtml = `<div class="card"><p><strong>Informação:</strong> Nenhum registro salarial encontrado para o semestre selecionado (${escapeHtml(sem)}).</p></div>`;
    } else if (isProfReport) {
      const profs = db.servidores
        .filter((s) => s.ativo && s.categoria === "Professor")
        .sort((a, b) => b.salarioAtual - a.salarioAtual);
      const rows = profs
        .map(
          (p) => `
          <tr>
            <th scope="row">${escapeHtml(p.titulacaoAtual || "Especialização")}</th>
            <td>${escapeHtml(p.nome)}</td>
            <td>${escapeHtml(getSetorLabel(p.setorId))}</td>
            <td><strong>${formatBRL(p.salarioAtual)}</strong></td>
          </tr>`
        )
        .join("");
      contentHtml = `
        <div class="card">
          <h2>Relatório Semestral 1: Professores com Maiores Salários Classificados por Titulação (${escapeHtml(sem)})</h2>
          <div tabindex="0" role="region" aria-labelledby="cap-rel-prof" class="table-wrapper">
            <table style="--label-2:'Professor'; --label-3:'Setor / Unidade'; --label-4:'Salário Vigente';">
              <caption id="cap-rel-prof">Ordenação decrescente de remuneração agrupada por titulação (RF011)</caption>
              <thead>
                <tr>
                  <th scope="col">Grau de Titulação</th>
                  <th scope="col">Professor</th>
                  <th scope="col">Setor / Unidade Administrativa</th>
                  <th scope="col">Salário Atual</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`;
    } else {
      const funcs = db.servidores
        .filter((s) => s.ativo && s.categoria === "Funcionário")
        .sort((a, b) => b.salarioAtual - a.salarioAtual);
      const rows = funcs
        .map(
          (f) => `
          <tr>
            <th scope="row">${escapeHtml(getSetorLabel(f.setorId))}</th>
            <td>${escapeHtml(f.nome)}</td>
            <td>${escapeHtml(f.funcaoAtual || "Administrativa")}</td>
            <td><strong>${formatBRL(f.salarioAtual)}</strong></td>
          </tr>`
        )
        .join("");
      contentHtml = `
        <div class="card">
          <h2>Relatório Semestral 2: Funcionários com Maiores Salários Classificados por Setor (${escapeHtml(sem)})</h2>
          <div tabindex="0" role="region" aria-labelledby="cap-rel-func" class="table-wrapper">
            <table style="--label-2:'Funcionário'; --label-3:'Função'; --label-4:'Salário Vigente';">
              <caption id="cap-rel-func">Ordenação decrescente de remuneração classificada por setor e unidade administrativa (RF012)</caption>
              <thead>
                <tr>
                  <th scope="col">Setor (Unidade Administrativa)</th>
                  <th scope="col">Funcionário</th>
                  <th scope="col">Função Exercida</th>
                  <th scope="col">Salário Atual</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`;
    }

    appViews.innerHTML = `
      <search class="filter-bar">
        <form id="form-relatorio" action="#/reitor/relatorios" method="GET">
          <div class="form-grid">
            <div class="field">
              <label for="rel-semestre">Semestre Letivo</label>
              <select id="rel-semestre" name="semestre">
                <option value="2026/2" ${sem === "2026/2" ? "selected" : ""}>2026/2 (Vigente)</option>
                <option value="2028/1" ${sem === "2028/1" ? "selected" : ""}>2028/1 (Sem dados – Teste CT-21)</option>
              </select>
            </div>
            <div class="field">
              <label for="rel-tipo">Tipo de Relatório Gerencial</label>
              <select id="rel-tipo" name="tipo">
                <option value="professores" ${isProfReport ? "selected" : ""}>1. Professores – Maiores Salários por Titulação (RF011)</option>
                <option value="funcionarios" ${!isProfReport ? "selected" : ""}>2. Funcionários – Maiores Salários por Setor (RF012)</option>
              </select>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn-primary">Gerar Relatório</button>
            <button type="button" class="btn btn-secondary" id="btn-print-report">Exportar PDF / Imprimir</button>
          </div>
        </form>
      </search>
      ${contentHtml}
    `;
  };

  // ---------- 9) SECRETARIA: GESTÃO DE CURSOS (< 20 ALUNOS) (UC007) ----------
  const renderSecretariaCursos = () => {
    pageTitle.textContent = "Secretaria Acadêmica – Gestão de Cursos Semestrais (UC007)";
    const filtered = db.cursos.filter((c) => {
      if (courseStatusFilter === "Todos") return true;
      if (courseStatusFilter === "Cancelados") return c.status === "Cancelado";
      return c.status !== "Cancelado";
    });

    const rows = filtered
      .map((c) => {
        const totalAtivos = countActiveEnrollments(c);
        return `
          <tr>
            <th scope="row">${escapeHtml(c.codigo)} – ${escapeHtml(c.nome)}</th>
            <td>${escapeHtml(c.semestre)}</td>
            <td><strong>${totalAtivos} alunos ativos</strong></td>
            <td>${renderBadge(c.status)}${c.dataCancelamento ? `<br><small>Cancelado em ${escapeHtml(c.dataCancelamento)}</small>` : ""}</td>
            <td>
              <button type="button" class="btn btn-secondary btn-sm" data-action="tentar-excluir-curso" data-id="${escapeHtml(c.id)}">Tentar Excluir Fisicamente</button>
            </td>
          </tr>`;
      })
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2>Controle de Encerramento de Inscrições (RF013, RF015, RF016)</h2>
        <p class="card-subtitle">Regra de fronteira: cursos com <strong>menos de 20 alunos ativos</strong> ao encerrar as inscrições são marcados como <strong>Cancelado</strong> (soft delete), mantendo todo o histórico durante o semestre.</p>
        <div class="btn-row">
          <button type="button" class="btn btn-danger" id="btn-encerrar-cursos">Encerrar Inscrições 2026/2 (&lt; 20 Alunos = Cancelar)</button>
        </div>
      </div>

      <search class="filter-bar">
        <form id="form-filtro-cursos" action="#/cursos" method="GET">
          <div class="form-grid">
            <div class="field">
              <label for="sel-filtro-curso">Filtrar Cursos do Semestre (Ativos e Cancelados Preservados)</label>
              <select id="sel-filtro-curso" name="status">
                <option value="Todos" ${courseStatusFilter === "Todos" ? "selected" : ""}>Todos (Ativos, Abertos e Cancelados)</option>
                <option value="Ativos" ${courseStatusFilter === "Ativos" ? "selected" : ""}>Somente Abertos / Ativos</option>
                <option value="Cancelados" ${courseStatusFilter === "Cancelados" ? "selected" : ""}>Somente Cancelados (Histórico Semestral)</option>
              </select>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn-primary btn-sm">Aplicar Filtro</button>
          </div>
        </form>
      </search>

      <div class="card">
        <h2>Cursos Ofertados no Semestre 2026/2</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-cursos" class="table-wrapper">
          <table style="--label-2:'Semestre'; --label-3:'Inscritos Ativos'; --label-4:'Status'; --label-5:'Proteção Histórico';">
            <caption id="cap-cursos">Listagem integral de cursos (inclusive cancelados preservados no semestre)</caption>
            <thead>
              <tr>
                <th scope="col">Curso</th>
                <th scope="col">Semestre</th>
                <th scope="col">Inscritos Ativos</th>
                <th scope="col">Status</th>
                <th scope="col">Teste Retenção (RF016)</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 10) SECRETARIA: HISTÓRICO DE INSCRIÇÕES (RF016) ----------
  const renderSecretariaInscricoes = () => {
    pageTitle.textContent = "Secretaria Acadêmica – Histórico Integral de Inscrições (RF016)";
    const rows = db.inscricoes
      .map((ins) => {
        const c = db.cursos.find((cu) => cu.id === ins.cursoId);
        return `
          <tr>
            <th scope="row">${escapeHtml(ins.alunoNome)} (${escapeHtml(ins.alunoRa)})</th>
            <td>${escapeHtml(c ? `${c.codigo} – ${c.nome}` : ins.cursoId)}</td>
            <td>${escapeHtml(ins.data)}</td>
            <td>${renderBadge(ins.status)}${ins.dataCancelamento ? ` <small>(em ${escapeHtml(ins.dataCancelamento)})</small>` : ""}</td>
          </tr>`;
      })
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2>Todas as Inscrições do Semestre (Ativas e Canceladas)</h2>
        <p class="card-subtitle">Conforme RF016 e correção do DEF-02 do TCD, todas as inscrições canceladas permanecem visíveis e auditáveis durante todo o semestre.</p>
        <div tabindex="0" role="region" aria-labelledby="cap-sec-ins" class="table-wrapper">
          <table style="--label-2:'Curso'; --label-3:'Data Inscrição'; --label-4:'Status';">
            <caption id="cap-sec-ins">Registro histórico de matrículas e cancelamentos de alunos</caption>
            <thead>
              <tr>
                <th scope="col">Aluno (RA)</th>
                <th scope="col">Curso</th>
                <th scope="col">Data da Inscrição</th>
                <th scope="col">Status Semestral</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ---------- 11) ALUNO: INSCRIÇÃO E CANCELAMENTO (UC008 / RF014 / RF016) ----------
  const renderAlunoInscricoes = () => {
    pageTitle.textContent = "Portal do Aluno – Inscrições em Cursos Semestrais (UC008)";
    const abertos = db.cursos.filter((c) => c.status === "Aberto");
    const opts = abertos
      .map(
        (c) =>
          `<option value="${escapeHtml(c.id)}">${escapeHtml(c.codigo)} – ${escapeHtml(c.nome)} (${countActiveEnrollments(c)} inscritos)</option>`
      )
      .join("");

    const myRows = db.inscricoes
      .filter((i) => i.alunoRa === currentUser.alunoRa)
      .map((i) => {
        const c = db.cursos.find((cu) => cu.id === i.cursoId);
        return `
          <tr>
            <th scope="row">${escapeHtml(c ? `${c.codigo} – ${c.nome}` : i.cursoId)}</th>
            <td>${escapeHtml(i.semestre)}</td>
            <td>${escapeHtml(i.data)}</td>
            <td>${renderBadge(i.status)}${i.dataCancelamento ? `<br><small>Cancelada em ${escapeHtml(i.dataCancelamento)}</small>` : ""}</td>
            <td>
              ${
                i.status === "Ativo"
                  ? `<button type="button" class="btn btn-danger btn-sm" data-action="cancelar-inscricao" data-id="${escapeHtml(i.id)}">Cancelar Inscrição</button>`
                  : "Histórico Preservado"
              }
            </td>
          </tr>`;
      })
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2 id="aluno-ins-title">Nova Inscrição em Curso (RF014)</h2>
        <p class="card-subtitle">Dica de teste (CT-25 / CT008): Cancele sua inscrição em <strong>CUR-104</strong> abaixo (cairá de 20 para 19 alunos ativos) e depois encerre as inscrições no perfil Secretaria!</p>
        <form id="form-inscricao" action="#/aluno/inscricoes" method="POST" aria-labelledby="aluno-ins-title" novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="ins-curso">Curso com Inscrições Abertas (2026/2) <span class="req" aria-hidden="true">*</span></label>
              <select id="ins-curso" name="cursoId" required data-error="ins-curso-err">
                <option value="">Selecione um curso...</option>
                ${opts}
              </select>
              <div id="ins-curso-err" class="error-msg"><span role="img" aria-label="Erro">❌</span> Selecione um curso disponível.</div>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn-success" ${abertos.length === 0 ? "disabled" : ""}>Confirmar Inscrição</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h2>Minhas Inscrições no Semestre (Ativas e Canceladas Mantidas – RF016)</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-aluno-ins" class="table-wrapper">
          <table style="--label-2:'Semestre'; --label-3:'Data'; --label-4:'Status'; --label-5:'Ação';">
            <caption id="cap-aluno-ins">Inscrições vinculadas ao aluno ${escapeHtml(currentUser.nome)}</caption>
            <thead>
              <tr>
                <th scope="col">Curso</th>
                <th scope="col">Semestre</th>
                <th scope="col">Data</th>
                <th scope="col">Status</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>${myRows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ==================== EVENT DELEGATION FOR FORMS & ACTIONS ====================
  appViews.addEventListener("submit", async (e) => {
    const form = e.target;
    e.preventDefault();

    // Validate form and focus first invalid control if needed
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid");
      form.querySelectorAll("input, select, textarea").forEach((el) => {
        dirtyMap.set(el, { hasInteracted: true, hasBlurred: true });
        syncAria(el);
      });
      firstInvalid?.focus();
      return;
    }

    // 1. Cadastrar Servidor (UC002)
    if (form.id === "form-servidor") {
      const fd = new FormData(form);
      const matricula = String(fd.get("matricula")).trim().toUpperCase();
      if (db.servidores.some((s) => s.matricula.toUpperCase() === matricula)) {
        showBanner(`Erro: Servidor com matrícula ${matricula} já cadastrado na base de dados (RNF004).`, "error");
        return;
      }
      const nome = String(fd.get("nome")).trim();
      const ok = await askConfirmation(
        "Confirmar Cadastro de Servidor",
        `Confirma a inclusão do servidor "${nome}" (${fd.get("categoria")}) na base da URGEN?`
      );
      if (!ok) {
        showBanner("Operação cancelada pelo usuário.", "info");
        return;
      }
      const sal = Number(fd.get("salarioBase"));
      db.servidores.push({
        id: `SRV-${String(db.servidores.length + 1).padStart(2, "0")}`,
        matricula,
        nome,
        endereco: String(fd.get("endereco")).trim(),
        nascimento: String(fd.get("nascimento")),
        admissao: String(fd.get("admissao")),
        salarioBase: sal,
        salarioAtual: sal,
        setorId: String(fd.get("setorId")),
        categoria: String(fd.get("categoria")),
        titulacaoAtual: "Especialização",
        funcaoAtual: "Administrativa",
        ativo: true,
      });
      addLog(currentUser.email, "CADASTRO_SERVIDOR", `Servidor ${nome} (${matricula}) cadastrado.`);
      showBanner("Servidor cadastrado com sucesso!", "success");
      renderRHServidores();
    }

    // 2. Simular Cálculo Anual (UC005)
    else if (form.id === "form-calculo") {
      const ano = String(new FormData(form).get("ano"));
      if (ano === "2027") {
        lastCalcPreview = null;
        showBanner("Configure as regras do plano de carreira antes de executar o cálculo para 2027 (Fluxo de Exceção E1).", "error");
        renderRHCalculo();
        return;
      }
      lastCalcPreview = { ano, items: computeSalaryPreview(ano) };
      showBanner(`Prévia salarial do ano-base ${ano} calculada em menos de 1 segundo! Revise e confirme abaixo.`, "info");
      renderRHCalculo();
    }

    // 3. Informar Evolução pelo Servidor (UC003)
    else if (form.id === "form-evolucao") {
      const fd = new FormData(form);
      const [tipo, detalhe] = String(fd.get("tipoComposto")).split("|");
      const newEv = {
        id: `EV-${String(db.evolucoes.length + 1).padStart(2, "0")}`,
        servidorId: currentUser.servidorId,
        ano: "2026",
        tipo,
        detalhe,
        descricao: String(fd.get("descricao")).trim(),
        comprovante: String(fd.get("comprovante")).trim(),
        data: String(fd.get("data")),
        status: "Pendente",
        justificativa: "",
      };
      db.evolucoes.unshift(newEv);
      addLog(currentUser.email, "ENVIO_EVOLUCAO", `Evolução ${tipo} (${detalhe}) enviada ao RH com status Pendente.`);
      showBanner("Evolução enviada voluntariamente ao RH com status Pendente!", "success");
      renderServidorEvolucoes();
    }

    // 4. Registrar Avaliação pela Chefia (UC004)
    else if (form.id === "form-avaliacao") {
      const fd = new FormData(form);
      const nota = Number(fd.get("nota"));
      if (Number.isNaN(nota) || nota < 0 || nota > 10) {
        showBanner("Erro: A nota de avaliação deve estar estritamente entre 0,0 e 10,0.", "error");
        return;
      }
      db.avaliacoes.unshift({
        id: `AV-${String(db.avaliacoes.length + 1).padStart(2, "0")}`,
        servidorId: String(fd.get("servidorId")),
        ano: "2026",
        data: String(fd.get("data")),
        nota,
        observacao: String(fd.get("observacao")).trim(),
        avaliador: currentUser.nome,
      });
      addLog(currentUser.email, "REGISTRO_AVALIACAO", `Avaliação nota ${nota.toFixed(1)} registrada.`);
      showBanner("Avaliação de desempenho registrada com sucesso!", "success");
      renderChefiaAvaliacoes();
    }

    // 5. Filtrar Relatórios Reitor (UC006)
    else if (form.id === "form-relatorio") {
      const fd = new FormData(form);
      reportFilter = {
        semestre: String(fd.get("semestre")),
        tipo: String(fd.get("tipo")),
      };
      renderReitorRelatorios();
    }

    // 6. Filtrar Cursos Secretaria (UC007)
    else if (form.id === "form-filtro-cursos") {
      courseStatusFilter = String(new FormData(form).get("status"));
      renderSecretariaCursos();
    }

    // 7. Nova Inscrição pelo Aluno (UC008)
    else if (form.id === "form-inscricao") {
      const cursoId = String(new FormData(form).get("cursoId"));
      const dup = db.inscricoes.some(
        (i) => i.alunoRa === currentUser.alunoRa && i.cursoId === cursoId && i.status === "Ativo"
      );
      if (dup) {
        showBanner("Erro: Você já possui inscrição ativa neste curso (bloqueio de duplicidade – RNF004).", "error");
        return;
      }
      db.inscricoes.unshift({
        id: `INS-${String(db.inscricoes.length + 1).padStart(2, "0")}`,
        cursoId,
        alunoRa: currentUser.alunoRa,
        alunoNome: "Rafael Oliveira",
        semestre: "2026/2",
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Ativo",
        dataCancelamento: "",
      });
      addLog(currentUser.email, "INSCRICAO_CURSO", `Inscrição realizada no curso ${cursoId}.`);
      showBanner(`Inscrição confirmada com sucesso no curso ${cursoId}!`, "success");
      renderAlunoInscricoes();
    }
  });

  appViews.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    // Confirmar e Gravar Fechamento Anual (UC005)
    if (btn.id === "btn-confirmar-calculo" && lastCalcPreview) {
      const ano = lastCalcPreview.ano;
      if (db.anosProcessados.includes(ano)) {
        showBanner(`Bloqueado: O fechamento anual de ${ano} já foi processado anteriormente (Fluxo de Exceção E2).`, "error");
        return;
      }
      const ok = await askConfirmation(
        "Confirmar Fechamento Anual de Salários",
        `Deseja confirmar e gravar no histórico os novos salários acumulados de ${ano} para ${lastCalcPreview.items.length} servidores?`
      );
      if (!ok) {
        showBanner("Gravação cancelada na caixa de confirmação. Salários mantidos inalterados (Cenário C4).", "info");
        return;
      }
      for (const item of lastCalcPreview.items) {
        const srv = db.servidores.find((s) => s.id === item.servidorId);
        if (srv) srv.salarioAtual = item.novoSalario;
        db.historicoSalarial.unshift({
          id: `HS-${String(db.historicoSalarial.length + 1).padStart(2, "0")}`,
          ano,
          servidorId: item.servidorId,
          salarioBase: item.salarioBase,
          acrescimosDesc: item.detalhes,
          novoSalario: item.novoSalario,
        });
      }
      db.anosProcessados.push(ano);
      addLog(currentUser.email, "FECHAMENTO_SALARIAL_ANUAL", `Cálculo anual ${ano} confirmado e gravado.`);
      showBanner(`Cálculo anual de ${ano} confirmado! Histórico salarial atualizado com sucesso.`, "success");
      renderRHCalculo();
      return;
    }

    // Exportar / Imprimir Relatório Reitor (UC006)
    if (btn.id === "btn-print-report") {
      addLog(currentUser.email, "EXPORTACAO_RELATORIO_PDF", `Impressão/PDF do relatório ${reportFilter.tipo} (${reportFilter.semestre}).`);
      window.print();
      return;
    }

    // Encerrar Inscrições de Cursos (< 20 Alunos = Cancelado) (UC007)
    if (btn.id === "btn-encerrar-cursos") {
      const ok = await askConfirmation(
        "Encerrar Período de Inscrições (2026/2)",
        "Cursos com menos de 20 alunos ativos serão marcados como Cancelado (mantendo o histórico durante todo o semestre). Deseja prosseguir?"
      );
      if (!ok) {
        showBanner("Operação de encerramento cancelada pela Secretaria.", "info");
        return;
      }
      let canceladosCount = 0;
      let ativosCount = 0;
      const hoje = new Date().toLocaleDateString("pt-BR");
      for (const c of db.cursos) {
        const qtd = countActiveEnrollments(c);
        c.prazoAberto = false;
        if (qtd < 20) {
          c.status = "Cancelado";
          c.dataCancelamento = hoje;
          canceladosCount++;
        } else {
          c.status = "Ativo";
          ativosCount++;
        }
      }
      addLog(currentUser.email, "ENCERRAMENTO_CURSOS", `Cursos ativos (>=20): ${ativosCount}; Cursos cancelados (<20): ${canceladosCount}.`);
      showBanner(
        `Encerramento concluído! ${ativosCount} curso(s) mantido(s) Ativo(s) (>= 20 alunos) e ${canceladosCount} curso(s) Cancelado(s) (< 20 alunos) com histórico preservado.`,
        "success"
      );
      renderSecretariaCursos();
      return;
    }

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (!action) return;

    // Inativar Servidor (UC002)
    if (action === "inativar-servidor") {
      const srv = db.servidores.find((s) => s.id === id);
      if (!srv) return;
      const ok = await askConfirmation("Inativar Servidor", `Confirma a inativação cadastral de "${srv.nome}"?`);
      if (!ok) return;
      srv.ativo = false;
      addLog(currentUser.email, "INATIVACAO_SERVIDOR", `Servidor ${srv.nome} inativado.`);
      showBanner(`Servidor ${srv.nome} inativado com registro em log.`, "info");
      renderRHServidores();
    }

    // Aprovar Evolução (UC003)
    else if (action === "aprovar-evo") {
      const evo = db.evolucoes.find((ev) => ev.id === id);
      if (!evo) return;
      evo.status = "Aprovado";
      addLog(currentUser.email, "APROVACAO_EVOLUCAO", `Evolução ${evo.id} aprovada pelo RH.`);
      showBanner("Evolução aprovada e liberada para o cálculo salarial anual!", "success");
      renderRHValidacoes();
    }

    // Recusar Evolução com Justificativa (UC003)
    else if (action === "recusar-evo") {
      pendingRejectEvoId = id;
      rejectForm.reset();
      initAriaFields(rejectDialog);
      rejectDialog.showModal();
    }

    // Bloquear Exclusão Física de Curso (RF016 / RNF004)
    else if (action === "tentar-excluir-curso") {
      addLog(currentUser.email, "BLOQUEIO_EXCLUSAO_FISICA", `Tentativa bloqueada de exclusão física do curso ${id}.`);
      showBanner(
        "Operação bloqueada (RF016 / RNF004): A URGEN mantém obrigatoriamente todas as informações de cursos ativos e cancelados durante todo o semestre (soft delete).",
        "error"
      );
    }

    // Cancelar Inscrição pelo Aluno (UC008 / RF014 / RF016)
    else if (action === "cancelar-inscricao") {
      const ins = db.inscricoes.find((i) => i.id === id);
      if (!ins) return;
      const ok = await askConfirmation(
        "Cancelar Inscrição em Curso",
        `Deseja cancelar sua inscrição em ${ins.cursoId}? O registro permanecerá preservado no histórico deste semestre (RF016).`
      );
      if (!ok) return;
      ins.status = "Cancelado";
      ins.dataCancelamento = new Date().toLocaleDateString("pt-BR");
      addLog(currentUser.email, "CANCELAMENTO_INSCRICAO", `Inscrição ${ins.id} (${ins.cursoId}) marcada como Cancelado (soft delete).`);
      showBanner("Inscrição cancelada! O registro permanece preservado no histórico semestral.", "info");
      renderAlunoInscricoes();
    }
  });

  // ==================== AUTHENTICATION FLOW (UC001) ====================
  const loginSection = document.getElementById("view-login");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const pwdInput = document.getElementById("login-password");
  const togglePwdBtn = document.getElementById("btn-toggle-pwd");
  const userPill = document.getElementById("user-pill");
  const logoutBtn = document.getElementById("btn-logout");

  togglePwdBtn.addEventListener("click", () => {
    const showing = pwdInput.type === "text";
    pwdInput.type = showing ? "password" : "text";
    togglePwdBtn.setAttribute("aria-pressed", String(!showing));
    togglePwdBtn.textContent = showing ? "Mostrar" : "Ocultar";
  });

  // Render demo account chips
  const demoContainer = document.getElementById("demo-accounts");
  const renderDemoAccounts = () => {
    demoContainer.innerHTML = db.usuarios
      .map(
        (u) => `
        <button type="button" class="account-chip" data-demo-email="${escapeHtml(u.email)}" data-demo-pwd="${escapeHtml(u.senha)}">
          <strong>${escapeHtml(u.perfil)}${u.ativo ? "" : " (Inativo)"}</strong>
          <small>${escapeHtml(u.nome)}<br>${escapeHtml(u.email)}</small>
        </button>`
      )
      .join("");
  };

  demoContainer.addEventListener("click", (e) => {
    const chip = e.target.closest("button[data-demo-email]");
    if (!chip) return;
    emailInput.value = chip.dataset.demoEmail;
    pwdInput.value = chip.dataset.demoPwd;
    syncAria(emailInput);
    syncAria(pwdInput);
    document.getElementById("btn-login-submit").focus();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!loginForm.checkValidity()) {
      const firstInvalid = loginForm.querySelector(":invalid");
      loginForm.querySelectorAll("input").forEach((el) => {
        dirtyMap.set(el, { hasInteracted: true, hasBlurred: true });
        syncAria(el);
      });
      firstInvalid?.focus();
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const senha = pwdInput.value;
    const found = db.usuarios.find((u) => u.email.toLowerCase() === email && u.senha === senha);

    if (!found) {
      addLog(email || "ANÔNIMO", "LOGIN_FALHA", "Credenciais inválidas informadas na tela de login.");
      showBanner("Login ou senha inválidos (Cenário C2 – UC001).", "error");
      return;
    }

    if (!found.ativo) {
      addLog(found.email, "LOGIN_BLOQUEADO_INATIVO", "Tentativa de login em conta inativa.");
      showBanner("Acesso bloqueado: esta conta encontra-se inativa. Procure o RH (Cenário C3 – UC001).", "error");
      return;
    }

    currentUser = found;
    lastCalcPreview = null;
    const tabs = getTabsForRole(found.perfil);
    currentTab = tabs[0]?.id || "";

    addLog(found.email, "LOGIN_SUCESSO", `Autenticação realizada no perfil ${found.perfil}.`);
    loginSection.hidden = true;
    appViews.hidden = false;
    userPill.textContent = `${found.nome} • Perfil: ${found.perfil}`;
    userPill.hidden = false;
    logoutBtn.hidden = false;

    showBanner(`Bem-vindo(a), ${found.nome}! Sessão iniciada com perfil ${found.perfil}.`, "success");
    renderNav();
    renderActiveTab();
    pageTitle.focus();
  });

  logoutBtn.addEventListener("click", () => {
    if (currentUser) addLog(currentUser.email, "LOGOUT", "Sessão encerrada pelo usuário.");
    currentUser = null;
    currentTab = "";
    loginForm.reset();
    appViews.hidden = true;
    appViews.innerHTML = "";
    loginSection.hidden = false;
    userPill.hidden = true;
    logoutBtn.hidden = true;
    pageTitle.textContent = "Autenticação de Usuário";
    renderNav();
    showBanner("Sessão encerrada com segurança.", "info");
    initAriaFields(loginSection);
  });

  document.getElementById("btn-reset-db").addEventListener("click", async () => {
    const ok = await askConfirmation(
      "Restaurar Massa de Testes Inicial",
      "Deseja restaurar todos os dados da URGEN para o estado original de homologação (útil antes de reexecutar a bateria de testes)?"
    );
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    db = createInitialDB();
    saveDB();
    lastCalcPreview = null;
    showBanner("Base de dados de homologação restaurada para o estado inicial limpo!", "success");
    if (currentUser) renderActiveTab();
    else renderDemoAccounts();
  });

  // Support direct hash check #/reitor/relatorios for RBAC testing
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#/reitor/relatorios" && currentUser && currentUser.perfil !== "Reitor") {
      currentTab = "reitor-relatorios";
      renderActiveTab();
    }
  });

  // Boot
  renderDemoAccounts();
  initAriaFields(document);
})();
