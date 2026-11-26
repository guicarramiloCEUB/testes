(() => {
  "use strict";

  const STORAGE_KEY = "urgen_uc005_mock_v2";

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

  // ==================== MASSA DE DADOS MOCKADA (UC005: CT-01 a CT-07) ====================
  const createInitialDB = () => ({
    regrasPorAno: {
      "2026": {
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
        cargo: {
          "Coordenação Setorial": 12,
        },
        avaliacaoExcelenteMin: 9.0,
        avaliacaoBonusExcelente: 8,
        avaliacaoBoaMin: 7.0,
        avaliacaoBonusBoa: 4,
      },
      // Ano 2027 propositalmente sem regras parametrizadas para testar E1 (CT-06)
    },
    usuarios: [
      {
        id: "USR-RH",
        email: "rh.teste@urgen.edu.br",
        senha: "Urgen@2026",
        nome: "Fernanda Martins (RH)",
        perfil: "RH",
      },
      {
        id: "USR-PROF",
        email: "joao.silva@urgen.edu.br",
        senha: "Urgen@2026",
        nome: "Prof. João Silva",
        perfil: "Professor",
        servidorId: "SRV-01",
      },
      {
        id: "USR-FUNC-ANA",
        email: "ana.costa@urgen.edu.br",
        senha: "Urgen@2026",
        nome: "Ana Paula Costa",
        perfil: "Funcionário",
        servidorId: "SRV-02",
      },
      {
        id: "USR-FUNC-CARLOS",
        email: "carlos.mendes@urgen.edu.br",
        senha: "Urgen@2026",
        nome: "Carlos Mendes",
        perfil: "Funcionário",
        servidorId: "SRV-03",
      },
    ],
    servidores: [
      {
        id: "SRV-01",
        matricula: "MAT-1002",
        nome: "Prof. João Silva",
        categoria: "Professor",
        setor: "Depto. Ciência da Computação",
        salarioBase: 8500.0,
        salarioAtual: 8500.0,
      },
      {
        id: "SRV-02",
        matricula: "MAT-2001",
        nome: "Ana Paula Costa",
        categoria: "Funcionário",
        setor: "Setor Financeiro",
        salarioBase: 5200.0,
        salarioAtual: 5200.0,
      },
      {
        id: "SRV-03",
        matricula: "MAT-2002",
        nome: "Carlos Mendes",
        categoria: "Funcionário",
        setor: "Setor Acadêmico",
        salarioBase: 6000.0,
        salarioAtual: 6000.0,
      },
      {
        id: "SRV-04",
        matricula: "MAT-2003",
        nome: "Marcos Pereira",
        categoria: "Funcionário",
        setor: "Setor Administrativo",
        salarioBase: 4800.0,
        salarioAtual: 4800.0,
      },
    ],
    evolucoes: [
      // CT-01: Professor com Doutorado (+25%) e Produção Científica (+10%) aprovados -> R$ 11.475,00
      {
        id: "EV-01",
        servidorId: "SRV-01",
        ano: "2026",
        tipo: "Titulação",
        detalhe: "Doutorado",
        descricao: "Doutorado em Ciência da Computação (diploma.pdf)",
        status: "Aprovado",
      },
      {
        id: "EV-02",
        servidorId: "SRV-01",
        ano: "2026",
        tipo: "Produção Científica",
        detalhe: "2 Artigos Qualis A1",
        descricao: "Artigos publicados em periódico (artigos.pdf)",
        status: "Aprovado",
      },
      // CT-02: Funcionária Ana Paula com Função Financeira (+15%) aprovada + Aval 9,5 (+8%) -> R$ 6.396,00
      {
        id: "EV-03",
        servidorId: "SRV-02",
        ano: "2026",
        tipo: "Função Exercida",
        detalhe: "Financeira",
        descricao: "Portaria de função financeira (portaria_fin.pdf)",
        status: "Aprovado",
      },
      // CT-03 (DEF-01): Carlos Mendes possui 1 Aprovada, 1 Pendente e 1 Recusada
      {
        id: "EV-04",
        servidorId: "SRV-03",
        ano: "2026",
        tipo: "Função Exercida",
        detalhe: "Acadêmica",
        descricao: "Função acadêmica aprovada pelo RH",
        status: "Aprovado",
      },
      {
        id: "EV-05",
        servidorId: "SRV-03",
        ano: "2026",
        tipo: "Novo Cargo",
        detalhe: "Coordenação Setorial",
        descricao: "Solicitação aguardando validação do RH",
        status: "Pendente",
      },
      {
        id: "EV-06",
        servidorId: "SRV-03",
        ano: "2026",
        tipo: "Função Exercida",
        detalhe: "Financeira",
        descricao: "Recusada por ausência de portaria assinada",
        status: "Recusado",
      },
    ],
    avaliacoes: [
      {
        id: "AV-01",
        servidorId: "SRV-02",
        ano: "2026",
        data: "15/10/2026",
        nota: 9.5,
      },
    ],
    historicoSalarial: [
      {
        id: "HS-2025-01",
        ano: "2025",
        servidorId: "SRV-01",
        salarioBase: 8500.0,
        acrescimosDesc: "Salário inicial de ingresso",
        novoSalario: 8500.0,
      },
      {
        id: "HS-2025-02",
        ano: "2025",
        servidorId: "SRV-02",
        salarioBase: 5200.0,
        acrescimosDesc: "Salário inicial de ingresso",
        novoSalario: 5200.0,
      },
    ],
    anosProcessados: [],
    logs: [
      {
        id: "LOG-001",
        dataHora: "25/11/2026, 08:00:00",
        usuario: "SISTEMA",
        acao: "BASE_MOCKADA",
        detalhe: "Massa de dados inicial do UC005 carregada (sem backend).",
      },
    ],
  });

  // Persistência leve opcional em localStorage (funciona normalmente mesmo se bloqueado em file://)
  const loadDB = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : createInitialDB();
    } catch {
      return createInitialDB();
    }
  };

  let db = loadDB();
  let currentUser = null;
  let currentTab = "";
  let selectedYear = "2026";
  let selectedCategory = "Todos";
  let lastCalcPreview = null;

  const saveDB = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Fallback apenas em memória se o navegador restringir localStorage em file://
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

  // ==================== ELEMENTOS DE UI ====================
  const pageTitle = document.getElementById("page-title");
  const statusBanner = document.getElementById("status-banner");
  const statusBannerText = document.getElementById("status-banner-text");
  const navBar = document.getElementById("app-nav");
  const navList = document.getElementById("nav-list");
  const appViews = document.getElementById("app-views");
  const loginSection = document.getElementById("view-login");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const pwdInput = document.getElementById("login-password");
  const togglePwdBtn = document.getElementById("btn-toggle-pwd");
  const demoContainer = document.getElementById("demo-accounts");
  const userPill = document.getElementById("user-pill");
  const logoutBtn = document.getElementById("btn-logout");
  const confirmDialog = document.getElementById("confirm-dialog");
  const confirmTitle = document.getElementById("confirm-title");
  const confirmMsg = document.getElementById("confirm-message");

  const showBanner = (msg, type = "info") => {
    statusBanner.className = `status-banner ${type}`;
    statusBannerText.textContent = msg;
    statusBanner.hidden = false;
  };

  const hideBanner = () => {
    statusBanner.hidden = true;
  };

  document.getElementById("btn-dismiss-banner").addEventListener("click", hideBanner);

  const askConfirmation = (title, message) =>
    new Promise((resolve) => {
      confirmTitle.textContent = title;
      confirmMsg.textContent = message;
      const onClose = () => {
        confirmDialog.removeEventListener("close", onClose);
        resolve(confirmDialog.returnValue === "confirm");
      };
      confirmDialog.addEventListener("close", onClose);
      confirmDialog.showModal();
    });

  const renderBadge = (status) => {
    if (status === "Aprovado") return `<span class="badge badge-success">Aprovado</span>`;
    if (status === "Pendente") return `<span class="badge badge-warning">Pendente</span>`;
    if (status === "Recusado") return `<span class="badge badge-danger">Recusado</span>`;
    return `<span class="badge badge-info">${escapeHtml(status)}</span>`;
  };

  // ==================== MOTOR DE CÁLCULO SALARIAL (UC005 / RF009) ====================
  const computeSalaryPreview = (ano, categoriaFiltro) => {
    const regras = db.regrasPorAno[ano];
    if (!regras) return null;

    return db.servidores
      .filter((s) => categoriaFiltro === "Todos" || s.categoria === categoriaFiltro)
      .map((srv) => {
        // DEF-01 (documentado no TCD / CT-03 e Slide 9):
        // A consulta filtra apenas status !== "Recusado" em vez de status === "Aprovado",
        // incluindo indevidamente evoluções com status "Pendente" na prévia!
        const evos = db.evolucoes.filter(
          (e) => e.servidorId === srv.id && e.ano === ano && e.status !== "Recusado"
        );

        let pctTotal = 0;
        const detalhes = [];
        let incluiuPendente = false;

        if (srv.categoria === "Professor") {
          for (const ev of evos) {
            if (ev.status === "Pendente") incluiuPendente = true;
            if (ev.tipo === "Titulação") {
              const p = regras.titulacao[ev.detalhe] || 0;
              pctTotal += p;
              detalhes.push(`${ev.detalhe} (+${p}%)`);
            } else if (ev.tipo === "Produção Científica") {
              const p = regras.producaoCientifica;
              pctTotal += p;
              detalhes.push(`Produção Científica (+${p}%)`);
            }
          }
        } else {
          for (const ev of evos) {
            if (ev.status === "Pendente") incluiuPendente = true;
            const p =
              ev.tipo === "Novo Cargo"
                ? regras.cargo[ev.detalhe] || 12
                : regras.funcao[ev.detalhe] || 10;
            pctTotal += p;
            const tagPendente = ev.status === "Pendente" ? " [Pendente]" : "";
            detalhes.push(`${ev.tipo} ${ev.detalhe}${tagPendente} (+${p}%)`);
          }
          const avals = db.avaliacoes.filter((a) => a.servidorId === srv.id && a.ano === ano);
          if (avals.length > 0) {
            const maxNota = Math.max(...avals.map((a) => a.nota));
            if (maxNota >= regras.avaliacaoExcelenteMin) {
              pctTotal += regras.avaliacaoBonusExcelente;
              detalhes.push(`Avaliação ${maxNota.toFixed(1).replace(".", ",")} (+${regras.avaliacaoBonusExcelente}%)`);
            } else if (maxNota >= regras.avaliacaoBoaMin) {
              pctTotal += regras.avaliacaoBonusBoa;
              detalhes.push(`Avaliação ${maxNota.toFixed(1).replace(".", ",")} (+${regras.avaliacaoBonusBoa}%)`);
            }
          }
        }

        const novoSalario =
          pctTotal > 0
            ? Math.round(srv.salarioBase * (1 + pctTotal / 100) * 100) / 100
            : srv.salarioAtual;

        return {
          servidorId: srv.id,
          nome: srv.nome,
          categoria: srv.categoria,
          salarioBase: srv.salarioBase,
          detalhes: detalhes.length ? detalhes.join(" + ") : "Sem novas evoluções no ano",
          novoSalario,
          incluiuPendente,
        };
      });
  };

  // ==================== NAVEGAÇÃO POR PERFIL (RBAC) ====================
  const getTabsForRole = (perfil) => {
    if (perfil === "RH") {
      return [
        { id: "rh-calculo", label: "Processamento Anual (UC005)" },
        { id: "rh-evolucoes", label: "Base de Evoluções (Mock)" },
        { id: "rh-logs", label: "Logs de Auditoria (RF017)" },
      ];
    }
    return [{ id: "srv-historico", label: "Meu Histórico Salarial (RF010)" }];
  };

  const renderNav = () => {
    if (!currentUser) {
      navBar.hidden = true;
      navList.innerHTML = "";
      return;
    }
    const tabs = getTabsForRole(currentUser.perfil);
    navBar.hidden = false;
    navList.innerHTML = tabs
      .map(
        (t) =>
          `<li><button type="button" class="nav-btn" data-tab="${escapeHtml(t.id)}" ${
            t.id === currentTab ? 'aria-current="page"' : ""
          }>${escapeHtml(t.label)}</button></li>`
      )
      .join("");
  };

  // ==================== VIEWS ====================
  const renderRHCalculo = () => {
    pageTitle.textContent = "RH – Processamento Anual de Salários (UC005)";

    const previewRows = lastCalcPreview
      ? lastCalcPreview.items
          .map(
            (it) => `
          <tr class="${it.incluiuPendente ? "row-warning" : ""}">
            <th scope="row">${escapeHtml(it.nome)}</th>
            <td>${escapeHtml(it.categoria)}</td>
            <td>${formatBRL(it.salarioBase)}</td>
            <td>${escapeHtml(it.detalhes)}</td>
            <td><strong>${formatBRL(it.novoSalario)}</strong></td>
          </tr>`
          )
          .join("")
      : "";

    const fechado2026 = db.anosProcessados.includes("2026");

    appViews.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><span>Servidores Ativos</span><strong>${db.servidores.length}</strong></div>
        <div class="stat-card"><span>Evoluções na Base</span><strong>${db.evolucoes.length} (1 Pendente, 1 Recusada)</strong></div>
        <div class="stat-card"><span>Status Ano-Base 2026</span><strong>${fechado2026 ? "Fechado" : "Em Aberto"}</strong></div>
      </div>

      <div class="card">
        <h2>Executar Cálculo Anual Acumulado (RF009, RF017)</h2>
        <p class="card-subtitle">Fórmulas por categoria: <strong>Professor</strong> (titulação + produção científica) e <strong>Funcionário</strong> (função/cargo + avaliação da chefia).</p>
        <form id="form-calculo" novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="calc-ano">Ano-Base <span class="req">*</span></label>
              <select id="calc-ano" name="ano">
                <option value="2026" ${selectedYear === "2026" ? "selected" : ""}>2026 (Com regras e evoluções)</option>
                <option value="2027" ${selectedYear === "2027" ? "selected" : ""}>2027 (Sem regras cadastradas – Teste E1)</option>
              </select>
            </div>
            <div class="field">
              <label for="calc-cat">Filtro de Categoria</label>
              <select id="calc-cat" name="categoria">
                <option value="Todos" ${selectedCategory === "Todos" ? "selected" : ""}>Todos (Professores e Funcionários)</option>
                <option value="Professor" ${selectedCategory === "Professor" ? "selected" : ""}>Professor</option>
                <option value="Funcionário" ${selectedCategory === "Funcionário" ? "selected" : ""}>Funcionário</option>
              </select>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn-primary" id="btn-executar-calculo">Executar Cálculo Anual</button>
            ${
              lastCalcPreview
                ? `<button type="button" class="btn btn-success" id="btn-confirmar-calculo">Confirmar e Gravar Histórico (${escapeHtml(
                    lastCalcPreview.ano
                  )})</button>`
                : ""
            }
          </div>
        </form>
      </div>

      ${
        lastCalcPreview
          ? `<div class="card">
              <h2>Prévia do Novo Salário Acumulado – Ano-Base ${escapeHtml(lastCalcPreview.ano)}</h2>
              <p class="card-subtitle">Valores calculados com precisão de duas casas decimais (RNF004).</p>
              <div class="table-wrapper">
                <table>
                  <caption>Confira os valores antes de gravar o histórico salarial</caption>
                  <thead>
                    <tr>
                      <th scope="col">Servidor</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Salário Base</th>
                      <th scope="col">Adicionais / Extras Considerados</th>
                      <th scope="col">Novo Salário</th>
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

  const renderRHEvolucoes = () => {
    pageTitle.textContent = "Base Mockada de Evoluções e Avaliações (2026)";
    const rows = db.evolucoes
      .map((ev) => {
        const srv = db.servidores.find((s) => s.id === ev.servidorId);
        return `
          <tr>
            <th scope="row">${escapeHtml(srv?.nome || ev.servidorId)}</th>
            <td>${escapeHtml(srv?.categoria || "—")}</td>
            <td><strong>${escapeHtml(ev.tipo)}: ${escapeHtml(ev.detalhe)}</strong><br><small>${escapeHtml(ev.descricao)}</small></td>
            <td>${escapeHtml(ev.ano)}</td>
            <td>${renderBadge(ev.status)}</td>
          </tr>`;
      })
      .join("");

    appViews.innerHTML = `
      <div class="card">
        <h2>Registros de Entrada Utilizados pelo Cálculo Anual (UC005)</h2>
        <p class="card-subtitle">Regra esperada: apenas evoluções <strong>Aprovadas</strong> devem entrar no cálculo. O registro <strong>EV-05 (Carlos Mendes)</strong> está propositalmente como <em>Pendente</em> para reproduzir o defeito <strong>DEF-01 (CT-03)</strong>.</p>
        <div class="table-wrapper">
          <table>
            <caption>Evoluções mockadas para o ano-base 2026</caption>
            <thead>
              <tr>
                <th scope="col">Servidor</th>
                <th scope="col">Categoria</th>
                <th scope="col">Evolução</th>
                <th scope="col">Ano</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  const renderRHLogs = () => {
    pageTitle.textContent = "Logs de Auditoria do Sistema (RF017)";
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
        <h2>Trilha de Auditoria</h2>
        <div class="table-wrapper">
          <table>
            <caption>Registro cronológico de autenticações, fechamentos salariais e bloqueios RBAC</caption>
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

  const renderServidorHistorico = () => {
    const srv = db.servidores.find((s) => s.id === currentUser.servidorId);
    pageTitle.textContent = "Meu Histórico Salarial (UC005 / RF010)";

    const histRows = db.historicoSalarial
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
        <div class="stat-card"><span>Categoria / Setor</span><strong>${escapeHtml(srv?.categoria)} • ${escapeHtml(srv?.setor)}</strong></div>
        <div class="stat-card"><span>Salário Base</span><strong>${formatBRL(srv?.salarioBase)}</strong></div>
        <div class="stat-card"><span>Salário Vigente</span><strong>${formatBRL(srv?.salarioAtual)}</strong></div>
      </div>
      <div class="card">
        <h2>Extrato Anual Individual</h2>
        <p class="card-subtitle">Por controle de acesso (RBAC / RNF001), você visualiza exclusivamente seus próprios registros salariais.</p>
        <div class="table-wrapper">
          <table>
            <caption>Histórico salarial de ${escapeHtml(srv?.nome)}</caption>
            <thead>
              <tr>
                <th scope="col">Ano-Base</th>
                <th scope="col">Salário Base</th>
                <th scope="col">Acréscimos Aplicados</th>
                <th scope="col">Novo Salário</th>
              </tr>
            </thead>
            <tbody>${histRows}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  const renderActiveTab = () => {
    if (!currentUser) return;
    if (currentTab === "rh-calculo" && currentUser.perfil === "RH") renderRHCalculo();
    else if (currentTab === "rh-evolucoes" && currentUser.perfil === "RH") renderRHEvolucoes();
    else if (currentTab === "rh-logs" && currentUser.perfil === "RH") renderRHLogs();
    else if (currentTab === "srv-historico") renderServidorHistorico();
    else {
      addLog(currentUser.email, "RBAC_ACESSO_NEGADO", `Tentativa bloqueada de acesso à rota ${currentTab}.`);
      showBanner("Acesso negado: perfil sem permissão para esta funcionalidade (RBAC).", "error");
      currentTab = getTabsForRole(currentUser.perfil)[0].id;
      renderNav();
      renderActiveTab();
    }
  };

  // ==================== EVENTOS ====================
  navList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (!btn) return;
    currentTab = btn.dataset.tab;
    hideBanner();
    renderNav();
    renderActiveTab();
  });

  appViews.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.id !== "form-calculo") return;

    const fd = new FormData(form);
    selectedYear = String(fd.get("ano"));
    selectedCategory = String(fd.get("categoria"));

    const items = computeSalaryPreview(selectedYear, selectedCategory);
    if (!items) {
      lastCalcPreview = null;
      addLog(currentUser.email, "BLOQUEIO_SEM_REGRAS", `Ano-base ${selectedYear} sem tabela de regras configurada (E1).`);
      showBanner("Configure as regras do plano de carreira antes de executar o cálculo.", "error");
      renderRHCalculo();
      return;
    }

    lastCalcPreview = { ano: selectedYear, categoria: selectedCategory, items };
    const hasDef01 = items.some((i) => i.incluiuPendente);
    showBanner(
      hasDef01
        ? `Prévia do ano-base ${selectedYear} gerada! Atenção: note que Carlos Mendes incluiu item Pendente (DEF-01).`
        : `Prévia do ano-base ${selectedYear} calculada com sucesso!`,
      "info"
    );
    renderRHCalculo();
  });

  appViews.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn || btn.id !== "btn-confirmar-calculo" || !lastCalcPreview) return;

    const ano = lastCalcPreview.ano;
    if (db.anosProcessados.includes(ano)) {
      addLog(currentUser.email, "BLOQUEIO_DUPLICIDADE_ANUAL", `Tentativa de reprocessar ano-base ${ano} já encerrado (E2).`);
      showBanner(`O fechamento anual de ${ano} já foi processado anteriormente.`, "error");
      return;
    }

    const ok = await askConfirmation(
      "Confirmar e Gravar Histórico Anual (RF017)",
      `Deseja confirmar o fechamento salarial de ${ano} para ${lastCalcPreview.items.length} servidor(es)?`
    );
    if (!ok) {
      showBanner("Operação cancelada pelo RH. Nenhum salário foi alterado (Cenário C3 / CT-05).", "info");
      return;
    }

    for (const item of lastCalcPreview.items) {
      const srv = db.servidores.find((s) => s.id === item.servidorId);
      if (srv) srv.salarioAtual = item.novoSalario;
      db.historicoSalarial.unshift({
        id: `HS-${ano}-${item.servidorId}`,
        ano,
        servidorId: item.servidorId,
        salarioBase: item.salarioBase,
        acrescimosDesc: item.detalhes,
        novoSalario: item.novoSalario,
      });
    }
    db.anosProcessados.push(ano);
    addLog(currentUser.email, "FECHAMENTO_SALARIAL_ANUAL", `Fechamento de ${ano} confirmado e gravado no histórico.`);
    showBanner("Cálculo anual confirmado! Histórico gravado com sucesso.", "success");
    renderRHCalculo();
  });

  // ==================== LOGIN / LOGOUT / RESET ====================
  togglePwdBtn.addEventListener("click", () => {
    const showing = pwdInput.type === "text";
    pwdInput.type = showing ? "password" : "text";
    togglePwdBtn.setAttribute("aria-pressed", String(!showing));
    togglePwdBtn.textContent = showing ? "Mostrar" : "Ocultar";
  });

  const renderDemoAccounts = () => {
    demoContainer.innerHTML = db.usuarios
      .map(
        (u) => `
        <button type="button" class="account-chip" data-email="${escapeHtml(u.email)}" data-pwd="${escapeHtml(u.senha)}">
          <strong>${escapeHtml(u.perfil)}</strong>
          <small>${escapeHtml(u.nome)}<br>${escapeHtml(u.email)}</small>
        </button>`
      )
      .join("");
  };

  demoContainer.addEventListener("click", (e) => {
    const chip = e.target.closest("button[data-email]");
    if (!chip) return;
    emailInput.value = chip.dataset.email;
    pwdInput.value = chip.dataset.pwd;
    loginForm.requestSubmit();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const senha = pwdInput.value;

    const found = db.usuarios.find((u) => u.email.toLowerCase() === email && u.senha === senha);
    if (!found) {
      addLog(email || "ANÔNIMO", "LOGIN_FALHA", "Credenciais inválidas informadas.");
      showBanner("Login ou senha inválidos.", "error");
      return;
    }

    currentUser = found;
    lastCalcPreview = null;
    currentTab = getTabsForRole(found.perfil)[0].id;
    addLog(found.email, "LOGIN_SUCESSO", `Autenticado no perfil ${found.perfil}.`);

    loginSection.hidden = true;
    appViews.hidden = false;
    userPill.textContent = `${found.nome} • ${found.perfil}`;
    userPill.hidden = false;
    logoutBtn.hidden = false;

    showBanner(`Bem-vindo(a), ${found.nome}!`, "success");
    renderNav();
    renderActiveTab();
    pageTitle.focus();
  });

  logoutBtn.addEventListener("click", () => {
    if (currentUser) addLog(currentUser.email, "LOGOUT", "Sessão encerrada.");
    currentUser = null;
    currentTab = "";
    lastCalcPreview = null;
    loginForm.reset();
    appViews.hidden = true;
    appViews.innerHTML = "";
    loginSection.hidden = false;
    userPill.hidden = true;
    logoutBtn.hidden = true;
    pageTitle.textContent = "Autenticação de Usuário";
    renderNav();
    showBanner("Sessão encerrada com segurança.", "info");
  });

  document.getElementById("btn-reset-db").addEventListener("click", async () => {
    const ok = await askConfirmation(
      "Restaurar Base Inicial",
      "Deseja restaurar todos os dados mockados do UC005 para o estado inicial?"
    );
    if (!ok) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    db = createInitialDB();
    saveDB();
    lastCalcPreview = null;
    selectedYear = "2026";
    selectedCategory = "Todos";
    showBanner("Base de testes restaurada para o estado inicial limpo!", "success");
    if (currentUser) renderActiveTab();
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#/rh/calculo" && currentUser && currentUser.perfil !== "RH") {
      currentTab = "rh-calculo";
      renderActiveTab();
    }
  });

  renderDemoAccounts();
})();
