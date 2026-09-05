/**
 * AlgoQuest v2: Multi-Language Coding Academy & Cloud Save
 * Main Application Controller
 */

class AlgoQuestApp {
  constructor() {
    this.currentLevel = null;
    this.activeTestTab = 0;
    this.lastTestRun = null;
    this.currentMode = 'dsa'; // 'dsa' | 'learn'

    // Player State
    this.player = this.loadPlayerData();

    // DOM Elements
    this.initDOMElements();

    // Setup Visualizer
    this.visualizer = new DSAVisualizer('visualizerMount');

    // Bind Event Listeners
    this.bindEvents();

    // Initialize Engines
    this.initEngines();

    // Initialize Auth
    this.initAuth();

    // Initialize CodeCombat Dungeon Canvas Arena
    if (window.dungeonArena) {
      window.dungeonArena.init('dungeonCanvas');
    }

    // Load initial level
    const savedLevelId = this.player.currentLevelId || 'level-1';
    this.loadLevel(savedLevelId);

    // Set initial language
    this.setLanguageUI(window.multiLangEngine.getLanguage());

    // Update HUD
    this.updateHUD();
    this.updateQuestChain();
    this.updateSupabaseStatusUI();
  }

  loadPlayerData() {
    let data = null;
    if (window.authSystem) {
      try {
        data = window.authSystem.loadProgress();
      } catch (e) {
        console.warn('Player auth load error:', e);
      }
    }
    if (!data) {
      const saved = localStorage.getItem('algoquest_player');
      if (saved) {
        try { data = JSON.parse(saved); } catch (e) { console.warn('Player data parse error:', e); }
      }
    }
    if (!data || typeof data !== 'object') {
      data = {};
    }
    data.xp = typeof data.xp === 'number' ? data.xp : 0;
    data.level = typeof data.level === 'number' ? data.level : 1;
    data.gold = typeof data.gold === 'number' ? data.gold : 0;
    data.playerHp = typeof data.playerHp === 'number' ? data.playerHp : 100;
    data.playerMaxHp = typeof data.playerMaxHp === 'number' ? data.playerMaxHp : 100;
    data.completedLevels = Array.isArray(data.completedLevels) ? data.completedLevels : [];
    data.relics = Array.isArray(data.relics) ? data.relics : [];
    data.currentLevelId = data.currentLevelId || 'level-1';
    data.langCompletions = (data.langCompletions && typeof data.langCompletions === 'object') ? data.langCompletions : {};
    return data;
  }

  savePlayerData() {
    if (window.authSystem) {
      window.authSystem.saveProgress(this.player);
    } else {
      localStorage.setItem('algoquest_player', JSON.stringify(this.player));
    }
    this.updateHUD();
  }

  initDOMElements() {
    // HUD
    this.playerLevelEl = document.getElementById('playerLevel');
    this.playerGoldEl = document.getElementById('playerGold');
    this.playerXpTextEl = document.getElementById('playerXpText');
    this.xpBarFillEl = document.getElementById('xpBarFill');
    this.realmBadgeNameEl = document.getElementById('realmBadgeName');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');

    // Arena
    this.enemyAvatarEl = document.getElementById('enemyAvatar');
    this.enemyNameEl = document.getElementById('enemyName');
    this.enemyHpTextEl = document.getElementById('enemyHpText');
    this.enemyHpFillEl = document.getElementById('enemyHpFill');
    this.heroAvatarEl = document.getElementById('heroAvatar');
    this.heroNameEl = document.getElementById('heroName');
    this.heroHpFillEl = document.getElementById('heroHpFill');
    this.combatLogEl = document.getElementById('combatLog');

    // Quest Details
    this.questTitleEl = document.getElementById('questTitle');
    this.questConceptEl = document.getElementById('questConcept');
    this.questDifficultyEl = document.getElementById('questDifficulty');
    this.questStoryEl = document.getElementById('questStory');
    this.questPromptEl = document.getElementById('questPrompt');
    this.teachingBlockEl = document.getElementById('teachingBlock');
    this.teachingContentEl = document.getElementById('teachingContent');

    // Code Editor
    this.codeEditorEl = document.getElementById('codeEditor');
    this.lineNumbersEl = document.getElementById('lineNumbers');
    this.runCodeBtn = document.getElementById('runCodeBtn');
    this.submitBtn = document.getElementById('submitBtn');
    this.resetCodeBtn = document.getElementById('resetCodeBtn');
    this.engineStatusDotEl = document.getElementById('engineStatusDot');
    this.engineStatusTextEl = document.getElementById('engineStatusText');
    this.editorLangIconEl = document.getElementById('editorLangIcon');
    this.editorFileNameEl = document.getElementById('editorFileName');

    // Test Results
    this.testTabsHeaderEl = document.getElementById('testTabsHeader');
    this.testDetailBodyEl = document.getElementById('testDetailBody');

    // Visualizer Controls
    this.vizPlayBtn = document.getElementById('vizPlayBtn');
    this.vizPrevBtn = document.getElementById('vizPrevBtn');
    this.vizNextBtn = document.getElementById('vizNextBtn');
    this.vizResetBtn = document.getElementById('vizResetBtn');
    this.vizSpeedSlider = document.getElementById('vizSpeedSlider');

    // Mode toggle
    this.modeDSABtn = document.getElementById('modeDSABtn');
    this.modeLearnBtn = document.getElementById('modeLearnBtn');

    // Auth
    this.authLoginBtn = document.getElementById('authLoginBtn');
    this.authBtnLabel = document.getElementById('authBtnLabel');
    this.loginModal = document.getElementById('loginModal');
    this.profileModal = document.getElementById('profileModal');

    // Modals
    this.realmMapModal = document.getElementById('realmMapModal');
    this.relicsModal = document.getElementById('relicsModal');
    this.hintsModal = document.getElementById('hintsModal');
    this.victoryModal = document.getElementById('victoryModal');
    this.supabaseModal = document.getElementById('supabaseModal');

    // Supabase UI
    this.supabaseBtn = document.getElementById('supabaseBtn');
    this.supabaseConfigForm = document.getElementById('supabaseConfigForm');
    this.supabaseUrlInput = document.getElementById('supabaseUrlInput');
    this.supabaseKeyInput = document.getElementById('supabaseKeyInput');
    this.testSupabaseConnBtn = document.getElementById('testSupabaseConnBtn');
    this.clearSupabaseConfigBtn = document.getElementById('clearSupabaseConfigBtn');
    this.copySqlSchemaBtn = document.getElementById('copySqlSchemaBtn');
    this.supabaseStatusDot = document.getElementById('supabaseStatusDot');
    this.supabaseStatusText = document.getElementById('supabaseStatusText');
    this.supabaseFeedbackMsg = document.getElementById('supabaseFeedbackMsg');
    this.sqlSchemaPre = document.getElementById('sqlSchemaPre');
  }

  bindEvents() {
    // Code Editor
    this.codeEditorEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.codeEditorEl.selectionStart;
        const end = this.codeEditorEl.selectionEnd;
        const lang = window.multiLangEngine.getLanguage();
        const indent = (lang === 'python') ? '    ' : '  ';
        this.codeEditorEl.value = this.codeEditorEl.value.substring(0, start) + indent + this.codeEditorEl.value.substring(end);
        this.codeEditorEl.selectionStart = this.codeEditorEl.selectionEnd = start + indent.length;
        this.updateLineNumbers();
      } else if (e.key === 'Enter') {
        const start = this.codeEditorEl.selectionStart;
        const currentLine = this.codeEditorEl.value.substring(0, start).split('\n').pop();
        const match = currentLine.match(/^\s*/);
        let indent = match ? match[0] : '';
        const lang = window.multiLangEngine.getLanguage();
        const trimmed = currentLine.trim();
        if (lang === 'python' && trimmed.endsWith(':')) indent += '    ';
        else if ((lang === 'javascript' || lang === 'java' || lang === 'cpp') && trimmed.endsWith('{')) indent += '  ';
        if (indent.length > 0) {
          e.preventDefault();
          const insertText = '\n' + indent;
          this.codeEditorEl.value = this.codeEditorEl.value.substring(0, start) + insertText + this.codeEditorEl.value.substring(start);
          this.codeEditorEl.selectionStart = this.codeEditorEl.selectionEnd = start + insertText.length;
          this.updateLineNumbers();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
    });

    this.draftSaveTimer = null;
    this.codeEditorEl.addEventListener('input', () => {
      this.updateLineNumbers();
      if (this.currentLevel) {
        clearTimeout(this.draftSaveTimer);
        this.draftSaveTimer = setTimeout(() => {
          const lang = window.multiLangEngine.getLanguage();
          localStorage.setItem(`algoquest_draft_${this.currentLevel.id}_${lang}`, this.codeEditorEl.value);
        }, 400);
      }
    });

    this.codeEditorEl.addEventListener('scroll', () => {
      this.lineNumbersEl.scrollTop = this.codeEditorEl.scrollTop;
    });

    // Run & Submit
    this.runCodeBtn.addEventListener('click', () => this.runCode());
    this.submitBtn.addEventListener('click', () => this.submitSolution());
    this.resetCodeBtn.addEventListener('click', () => this.resetStarterCode());

    // Sound Toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = window.soundSystem.toggleMute();
      this.soundToggleBtn.innerHTML = isMuted ? '🔇' : '🔊';
      this.soundToggleBtn.classList.toggle('active', !isMuted);
    });

    // Visualizer Controls
    this.vizPlayBtn.addEventListener('click', () => this.visualizer.togglePlay());
    this.vizNextBtn.addEventListener('click', () => this.visualizer.next());
    this.vizPrevBtn.addEventListener('click', () => this.visualizer.prev());
    this.vizResetBtn.addEventListener('click', () => this.visualizer.reset());
    this.vizSpeedSlider.addEventListener('input', (e) => {
      this.visualizer.setSpeed(1400 - parseInt(e.target.value));
    });

    // Mode Toggle
    this.modeDSABtn.addEventListener('click', () => this.setMode('dsa'));
    this.modeLearnBtn.addEventListener('click', () => this.setMode('learn'));

    // Language Selector
    document.querySelectorAll('.lang-pill').forEach(btn => {
      btn.addEventListener('click', () => this.switchLanguage(btn.dataset.lang));
    });

    // Navigation Modals
    document.getElementById('realmMapBtn').addEventListener('click', () => this.openRealmMap());
    document.getElementById('realmPillBtn').addEventListener('click', () => this.openRealmMap());
    document.getElementById('relicsBtn').addEventListener('click', () => this.openRelicsModal());
    document.getElementById('hintBtn').addEventListener('click', () => this.openHintsModal());

    // Auth & Gmail Form
    this.authLoginBtn.addEventListener('click', () => this.handleAuthClick());
    document.getElementById('googleSignInBtn').addEventListener('click', () => this.doGoogleSignIn());

    const gmailForm = document.getElementById('gmailLoginForm');
    if (gmailForm) {
      gmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('gmailEmailInput').value.trim();
        const name = document.getElementById('gmailNameInput').value.trim();
        this.doGmailSignIn(email, name);
      });
    }

    document.getElementById('guestContinueBtn').addEventListener('click', () => {
      this.loginModal.classList.remove('active');
    });
    document.getElementById('signOutBtn').addEventListener('click', () => this.doSignOut());

    // Supabase Events
    if (this.supabaseBtn) {
      this.supabaseBtn.addEventListener('click', () => this.openSupabaseModal());
    }
    if (this.supabaseConfigForm) {
      this.supabaseConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSupabaseConfig();
      });
    }
    if (this.testSupabaseConnBtn) {
      this.testSupabaseConnBtn.addEventListener('click', () => this.testSupabaseConnection());
    }
    if (this.clearSupabaseConfigBtn) {
      this.clearSupabaseConfigBtn.addEventListener('click', () => this.clearSupabaseConfig());
    }
    if (this.copySqlSchemaBtn) {
      this.copySqlSchemaBtn.addEventListener('click', () => this.copySqlSchema());
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Victory next
    document.getElementById('victoryNextBtn').addEventListener('click', () => {
      this.victoryModal.classList.remove('active');
      this.advanceToNextLevel();
    });
  }

  // ==========================================
  // ENGINE INITIALIZATION
  // ==========================================
  initEngines() {
    // Non-blocking initialization to eliminate startup lag
    setTimeout(() => {
      window.pythonEngine.init((status, msg) => {
        if (window.multiLangEngine.getLanguage() === 'python') {
          this.engineStatusTextEl.textContent = msg;
          this.engineStatusDotEl.className = 'engine-status-dot ' + (status === 'ready' ? 'ready' : status === 'failed' ? 'failed' : '');
        }
      });
    }, 500);
    this.updateEngineStatus();
  }

  updateEngineStatus() {
    const lang = window.multiLangEngine.getLanguage();
    const meta = window.multiLangEngine.getLanguageMeta(lang);
    if (lang === 'python') {
      const s = window.pythonEngine.status;
      this.engineStatusDotEl.className = 'engine-status-dot ' + (s === 'ready' ? 'ready' : s === 'failed' ? 'failed' : '');
      this.engineStatusTextEl.textContent = s === 'ready' ? 'Python 3 Engine Ready 🚀' : 'Loading Python 3 (Pyodide)...';
    } else if (lang === 'javascript') {
      this.engineStatusDotEl.className = 'engine-status-dot ready';
      this.engineStatusTextEl.textContent = 'JavaScript Engine Ready (Native) 🚀';
    } else {
      this.engineStatusDotEl.className = 'engine-status-dot ready';
      this.engineStatusTextEl.textContent = `${meta.label} Engine Ready (Piston API) 🌐`;
    }
  }

  // ==========================================
  // AUTH
  // ==========================================
  initAuth() {
    window.authSystem.init((user, isGuest) => {
      this.updateAuthUI(user, isGuest);
      if (!isGuest && user) {
        const userProgress = window.authSystem.loadProgress();
        if (userProgress) {
          this.player = window.authSystem.mergeGuestProgress(this.player, userProgress);
        }
        this.savePlayerData();
        this.updateHUD();
        this.updateQuestChain();
      }
    });
  }

  updateAuthUI(user, isGuest) {
    if (!isGuest && user) {
      this.authBtnLabel.textContent = user.displayName?.split(' ')[0] || 'Hero';
      const placeholder = this.authLoginBtn.querySelector('.auth-avatar-placeholder');
      if (user.photoURL) {
        placeholder.innerHTML = `<img src="${user.photoURL}" alt="Avatar" style="width:24px;height:24px;border-radius:50%;">`;
      } else {
        placeholder.textContent = '🧙‍♂️';
      }
    } else {
      this.authBtnLabel.textContent = 'Sign In';
      const placeholder = this.authLoginBtn.querySelector('.auth-avatar-placeholder');
      placeholder.textContent = '👤';
    }

    // Update hero name
    if (this.heroNameEl) {
      const lang = window.multiLangEngine.getLanguage();
      const heroNames = { python: 'Py-Mage', javascript: 'JS-Knight', java: 'Java-Paladin', cpp: 'C++ Berserker' };
      this.heroNameEl.textContent = heroNames[lang] || 'Code Mage';
    }
  }

  handleAuthClick() {
    if (window.authSystem.isGuest) {
      this.renderRecentAccounts();
      const statusEl = document.getElementById('loginStatusMsg');
      if (statusEl) statusEl.textContent = '';
      this.loginModal.classList.add('active');
    } else {
      this.openProfileModal();
    }
  }

  renderRecentAccounts() {
    const container = document.getElementById('recentAccountsContainer');
    const list = document.getElementById('recentAccountsList');
    if (!container || !list) return;

    const accounts = window.authSystem.getRecentAccounts();
    if (!accounts || accounts.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    list.innerHTML = accounts.map(acc => `
      <div class="recent-account-card" data-email="${this.esc(acc.email)}" data-name="${this.esc(acc.displayName)}"
        style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 12px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); cursor:pointer; transition:all 0.2s;">
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="${acc.photoURL}" alt="" style="width:28px; height:28px; border-radius:50%;">
          <div style="text-align:left;">
            <div style="font-size:13px; font-weight:700; color:var(--text-primary);">${this.esc(acc.displayName)}</div>
            <div style="font-size:11px; color:var(--text-muted);">${this.esc(acc.email)}</div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:700; color:var(--cyan);">Log In →</span>
      </div>
    `).join('');

    list.querySelectorAll('.recent-account-card').forEach(item => {
      item.addEventListener('click', () => {
        this.doGmailSignIn(item.dataset.email, item.dataset.name);
      });
    });
  }

  doGmailSignIn(email, name) {
    const status = document.getElementById('loginStatusMsg');
    try {
      if (!email) throw new Error('Please enter your Gmail address.');
      if (status) status.innerHTML = `<span style="color:var(--cyan);">Signing in as ${this.esc(email)}...</span>`;

      const user = window.authSystem.signInWithGmail(email, name);

      // Load and merge saved progress for this Gmail account
      const userProgress = window.authSystem.loadProgress();
      if (userProgress) {
        this.player = window.authSystem.mergeGuestProgress(this.player, userProgress);
      }
      this.savePlayerData();
      this.updateHUD();
      this.updateQuestChain();

      if (this.currentLevel) {
        this.loadEditorCode(this.currentLevel, window.multiLangEngine.getLanguage());
      }

      this.loginModal.classList.remove('active');
      window.soundSystem?.playSuccess();
    } catch (err) {
      if (status) status.innerHTML = `<span style="color:var(--crimson);">${err.message}</span>`;
    }
  }

  async doGoogleSignIn() {
    const user = await window.authSystem.signInWithGoogle();
    if (user) {
      const userProgress = window.authSystem.loadProgress();
      if (userProgress) {
        this.player = window.authSystem.mergeGuestProgress(this.player, userProgress);
      }
      this.savePlayerData();
      this.updateHUD();
      this.updateQuestChain();

      if (this.currentLevel) {
        this.loadEditorCode(this.currentLevel, window.multiLangEngine.getLanguage());
      }

      this.loginModal.classList.remove('active');
      window.soundSystem?.playSuccess();
    }
  }

  doSignOut() {
    window.authSystem.signOut();
    this.player = this.loadPlayerData();
    this.savePlayerData();
    this.updateHUD();
    this.updateQuestChain();
    this.profileModal.classList.remove('active');
    window.soundSystem?.playClick();
  }

  openProfileModal() {
    const user = window.authSystem.user;
    const imgEl = document.getElementById('profileAvatarImg');
    const placeholderEl = document.getElementById('profileAvatarPlaceholder');

    if (user && user.photoURL) {
      imgEl.src = user.photoURL;
      imgEl.style.display = 'block';
      placeholderEl.style.display = 'none';
    } else {
      imgEl.style.display = 'none';
      placeholderEl.style.display = 'flex';
    }

    document.getElementById('profileName').textContent = window.authSystem.getDisplayName();
    document.getElementById('profileEmail').textContent = user ? user.email : 'Playing locally (guest mode)';
    document.getElementById('signOutBtn').style.display = window.authSystem.isGuest ? 'none' : 'flex';

    // Stats
    const allLevels = [...window.LEVELS, ...(window.LESSONS || [])];
    const totalQuests = allLevels.length;
    const completedList = Array.isArray(this.player?.completedLevels) ? this.player.completedLevels : [];
    const relicsList = Array.isArray(this.player?.relics) ? this.player.relics : [];
    const completedCount = completedList.length;
    const statsGrid = document.getElementById('profileStatsGrid');
    statsGrid.innerHTML = `
      <div class="profile-stat"><div class="stat-value">${this.player.level || 1}</div><div class="stat-label">Level</div></div>
      <div class="profile-stat"><div class="stat-value">${this.player.xp || 0}</div><div class="stat-label">Total XP</div></div>
      <div class="profile-stat"><div class="stat-value">${this.player.gold || 0}</div><div class="stat-label">Gold</div></div>
      <div class="profile-stat"><div class="stat-value">${completedCount} / ${totalQuests}</div><div class="stat-label">Quests Done</div></div>
      <div class="profile-stat"><div class="stat-value">${relicsList.length}</div><div class="stat-label">Relics</div></div>
      <div class="profile-stat"><div class="stat-value">${window.authSystem.isGuest ? 'Local' : 'Cloud ☁️'}</div><div class="stat-label">Save Mode</div></div>
    `;

    // Per-language progress
    const langProgress = document.getElementById('profileLangProgress');
    const langs = ['python', 'javascript', 'java', 'cpp'];
    const langLabels = { python: '🐍 Python', javascript: '📜 JavaScript', java: '☕ Java', cpp: '⚙️ C++' };
    langProgress.innerHTML = `<div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Language Mastery:</div>` +
      langs.map(l => {
        const completed = (this.player.langCompletions?.[l] || []).length;
        const pct = totalQuests > 0 ? Math.round((completed / totalQuests) * 100) : 0;
        return `
          <div class="lang-progress-row">
            <span class="lang-progress-label">${langLabels[l]}</span>
            <div class="lang-progress-bar-bg">
              <div class="lang-progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
            <span class="lang-progress-count">${completed}/${totalQuests}</span>
          </div>
        `;
      }).join('');

    this.profileModal.classList.add('active');
    window.soundSystem?.playClick();
  }

  // ==========================================
  // LANGUAGE SWITCHING
  // ==========================================
  switchLanguage(langId) {
    // Save current draft before switching
    if (this.currentLevel) {
      const oldLang = window.multiLangEngine.getLanguage();
      localStorage.setItem(`algoquest_draft_${this.currentLevel.id}_${oldLang}`, this.codeEditorEl.value);
    }

    window.multiLangEngine.setLanguage(langId);
    this.setLanguageUI(langId);

    // Load the level code in the new language
    if (this.currentLevel) {
      this.loadEditorCode(this.currentLevel, langId);
    }

    this.updateEngineStatus();
    window.soundSystem?.playClick();
  }

  setLanguageUI(langId) {
    const meta = window.multiLangEngine.getLanguageMeta(langId);
    document.querySelectorAll('.lang-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === langId);
    });
    this.editorLangIconEl.textContent = meta.icon;
    this.editorFileNameEl.textContent = 'solution' + meta.fileExt;
    this.codeEditorEl.placeholder = langId === 'python' ? '# Write your Python code here...'
      : langId === 'javascript' ? '// Write your JavaScript code here...'
      : langId === 'java' ? '// Write your Java code here...'
      : '// Write your C++ code here...';

    // Update hero name/avatar based on lang
    const heroNames = { python: 'Py-Mage', javascript: 'JS-Knight', java: 'Java-Paladin', cpp: 'C++ Berserker' };
    const heroAvatars = { python: '🧙‍♂️', javascript: '⚔️', java: '🛡️', cpp: '🗡️' };
    if (this.heroNameEl) this.heroNameEl.textContent = heroNames[langId] || 'Code Mage';
    if (this.heroAvatarEl) this.heroAvatarEl.textContent = heroAvatars[langId] || '🧙‍♂️';
  }

  loadEditorCode(level, langId) {
    // Check for saved draft first
    const draft = localStorage.getItem(`algoquest_draft_${level.id}_${langId}`);
    if (draft) {
      this.codeEditorEl.value = draft;
    } else if (level.starterCodes && level.starterCodes[langId]) {
      this.codeEditorEl.value = level.starterCodes[langId];
    } else if (level.starterCode && langId === 'python') {
      this.codeEditorEl.value = level.starterCode;
    } else {
      this.codeEditorEl.value = `// ${langId} starter code not yet available for this quest.\n// Try solving it in Python first!`;
    }
    this.updateLineNumbers();
  }

  // ==========================================
  // MODE SWITCHING (DSA Quests / Learn Coding)
  // ==========================================
  setMode(mode) {
    this.currentMode = mode;
    this.modeDSABtn.classList.toggle('active', mode === 'dsa');
    this.modeLearnBtn.classList.toggle('active', mode === 'learn');

    if (mode === 'learn') {
      // Load first learn lesson if not already on one
      const lessons = window.LESSONS || [];
      if (lessons.length > 0 && (!this.currentLevel || !this.currentLevel.isLesson)) {
        this.loadLevel(lessons[0].id);
      }
    } else {
      const levels = window.LEVELS || [];
      if (levels.length > 0 && this.currentLevel && this.currentLevel.isLesson) {
        this.loadLevel(levels[0].id);
      }
    }
    this.updateQuestChain();
    window.soundSystem?.playClick();
  }

  // ==========================================
  // QUEST CHAIN PROGRESS BAR
  // ==========================================
  updateQuestChain() {
    const bar = document.getElementById('questChainBar');
    if (!bar) return;

    const pool = this.currentMode === 'learn' ? (window.LESSONS || []) : (window.LEVELS || []);
    const currentId = this.currentLevel?.id;

    bar.innerHTML = pool.map((lvl, idx) => {
      const isCompleted = this.player.completedLevels.includes(lvl.id);
      const isCurrent = lvl.id === currentId;
      return `
        <div class="quest-chain-node ${isCompleted ? 'chain-completed' : ''} ${isCurrent ? 'chain-current' : ''}"
             data-level-id="${lvl.id}" title="${lvl.title}">
          <div class="chain-dot">${isCompleted ? '✓' : idx + 1}</div>
          ${idx < pool.length - 1 ? '<div class="chain-connector"></div>' : ''}
        </div>
      `;
    }).join('');

    // Click handlers
    bar.querySelectorAll('.quest-chain-node').forEach(node => {
      node.addEventListener('click', () => {
        this.loadLevel(node.dataset.levelId);
      });
    });
  }

  // ==========================================
  // LEVEL LOADING
  // ==========================================
  loadLevel(levelId) {
    const allLevels = [...(window.LEVELS || []), ...(window.LESSONS || [])];
    const level = allLevels.find(l => l.id === levelId) || window.LEVELS[0];
    this.currentLevel = level;
    this.player.currentLevelId = level.id;
    this.lastTestRun = null;

    // Detect mode
    if (level.isLesson) {
      this.currentMode = 'learn';
      this.modeDSABtn.classList.remove('active');
      this.modeLearnBtn.classList.add('active');
    }

    // Realm badge
    const allRealms = [...(window.REALMS || []), ...(window.LEARN_REALMS || [])];
    const realm = allRealms.find(r => r.id === level.realmId);
    this.realmBadgeNameEl.textContent = realm ? realm.name : 'Unknown Realm';

    // Quest details
    this.questTitleEl.textContent = level.title;
    this.questConceptEl.textContent = level.concept;
    this.questDifficultyEl.textContent = level.difficulty;
    const diffClass = { Easy: 'easy', Medium: 'medium', Hard: 'hard', Beginner: 'easy', Intermediate: 'medium', Advanced: 'hard' };
    this.questDifficultyEl.className = `panel-badge badge-${diffClass[level.difficulty] || 'easy'}`;
    this.questStoryEl.textContent = `"${level.story}"`;
    this.questPromptEl.textContent = level.prompt;

    // Teaching block
    if (level.teaching && level.isLesson) {
      this.teachingBlockEl.style.display = 'block';
      this.teachingContentEl.innerHTML = level.teaching.replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code>$1</code>');
    } else {
      this.teachingBlockEl.style.display = 'none';
    }

    // Enemy & Battle Arena Setup
    if (this.enemyAvatarEl) this.enemyAvatarEl.textContent = level.enemy.avatar;
    if (this.enemyNameEl) this.enemyNameEl.textContent = level.enemy.name;
    if (this.enemyHpTextEl) this.enemyHpTextEl.textContent = `${level.enemy.hp} / ${level.enemy.hp} HP`;
    if (this.enemyHpFillEl) this.enemyHpFillEl.style.width = '100%';
    if (this.combatLogEl) this.combatLogEl.textContent = `"${level.enemy.quote}"`;

    // CodeCombat 2D Dungeon Arena sync
    if (window.dungeonArena) {
      const currentLang = window.multiLangEngine ? window.multiLangEngine.getLanguage() : 'python';
      const isMage = (currentLang === 'python' || currentLang === 'javascript');
      window.dungeonArena.setCombatants({
        heroName: this.player?.heroName || (isMage ? 'Py-Mage' : 'Code-Knight'),
        heroRole: isMage ? 'mage' : 'knight',
        enemyName: level.enemy?.name || 'Dungeon Boss',
        enemyMaxHp: level.enemy?.hp || 100,
        enemyAvatar: level.enemy?.avatar || '👹'
      });
      window.dungeonArena.showCombatText(`⚔️ Challenge: ${level.title}`, '#ffb703');
    }

    // Code Editor
    const lang = window.multiLangEngine.getLanguage();
    this.loadEditorCode(level, lang);

    // Visualizer
    this.visualizer.setLevel(level);

    // Test tabs
    this.renderInitialTestTabs(level);

    // Quest chain
    this.updateQuestChain();

    this.savePlayerData();
    window.soundSystem?.playClick();
  }

  resetStarterCode() {
    if (!this.currentLevel) return;
    const lang = window.multiLangEngine.getLanguage();
    localStorage.removeItem(`algoquest_draft_${this.currentLevel.id}_${lang}`);
    this.loadEditorCode(this.currentLevel, lang);
    window.soundSystem?.playClick();

    // Visual feedback on button
    if (this.resetCodeBtn) {
      const originalHtml = this.resetCodeBtn.innerHTML;
      this.resetCodeBtn.innerHTML = '✓ Reset!';
      this.resetCodeBtn.style.borderColor = 'var(--green)';
      this.resetCodeBtn.style.color = 'var(--green)';
      setTimeout(() => {
        this.resetCodeBtn.innerHTML = originalHtml;
        this.resetCodeBtn.style.borderColor = '';
        this.resetCodeBtn.style.color = '';
      }, 1000);
    }
    if (window.dungeonArena) {
      window.dungeonArena.showCombatText('Code Reset to Default', '#00e5ff');
    }
  }

  updateLineNumbers() {
    const lines = this.codeEditorEl.value.split('\n').length;
    if (this._lastLineCount === lines) return;
    this._lastLineCount = lines;
    let numbers = '';
    const total = Math.max(lines, 14);
    for (let i = 1; i <= total; i++) numbers += i + '\n';
    this.lineNumbersEl.textContent = numbers;
  }

  renderInitialTestTabs(level) {
    this.testTabsHeaderEl.innerHTML = '';
    level.testCases.forEach((tc, idx) => {
      const btn = document.createElement('button');
      btn.className = `test-tab-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<span>Case ${idx + 1}</span>`;
      btn.addEventListener('click', () => this.setActiveTestTab(idx));
      this.testTabsHeaderEl.appendChild(btn);
    });
    this.activeTestTab = 0;
    this.renderTestDetailBody(level.testCases[0]);
  }

  setActiveTestTab(idx) {
    this.activeTestTab = idx;
    document.querySelectorAll('.test-tab-btn').forEach((btn, i) => btn.classList.toggle('active', i === idx));
    if (this.lastTestRun && this.lastTestRun.results[idx]) {
      this.renderTestRunResult(this.lastTestRun.results[idx]);
    } else {
      this.renderTestDetailBody(this.currentLevel.testCases[idx]);
    }
  }

  renderTestDetailBody(tc) {
    this.testDetailBodyEl.innerHTML = `
      <div class="test-io-grid">
        <div class="test-io-box"><span class="io-label">Input</span><span class="io-content">${this.esc(JSON.stringify(tc.input))}</span></div>
        <div class="test-io-box"><span class="io-label">Expected Output</span><span class="io-content">${this.esc(JSON.stringify(tc.expected))}</span></div>
      </div>
      <div style="font-size:12px; color:var(--text-muted);">Run code to inspect actual output and execution timing.</div>
    `;
  }

  renderTestRunResult(result) {
    this.testDetailBodyEl.innerHTML = `
      <div class="test-verdict-banner ${result.passed ? 'banner-passed' : 'banner-failed'}">
        <span>${result.passed ? '✓ Passed' : '✗ Failed'} (${result.label})</span>
        <span style="font-family:var(--font-mono); font-size:11px;">⏱ ${result.timeMs} ms</span>
      </div>
      <div class="test-io-grid">
        <div class="test-io-box"><span class="io-label">Input</span><span class="io-content">${this.esc(JSON.stringify(result.input))}</span></div>
        <div class="test-io-box"><span class="io-label">Expected</span><span class="io-content">${this.esc(JSON.stringify(result.expected))}</span></div>
        <div class="test-io-box" style="grid-column: 1 / -1;">
          <span class="io-label">Actual Output</span>
          <span class="io-content ${result.passed ? '' : 'error-content'}">
            ${result.error ? `Error: ${this.esc(result.error)}` : this.esc(JSON.stringify(result.actual))}
          </span>
        </div>
      </div>
      ${this.lastTestRun?.stdout ? `<div style="display:flex;flex-direction:column;gap:4px;"><span class="io-label">stdout:</span><div class="stdout-box">${this.esc(this.lastTestRun.stdout)}</div></div>` : ''}
    `;
  }

  // ==========================================
  // CODE EXECUTION
  // ==========================================
  async runCode() {
    if (!this.currentLevel) return;
    this.runCodeBtn.disabled = true;
    this.runCodeBtn.innerHTML = '⏳ Testing...';

    const userCode = this.codeEditorEl.value;
    const runResult = await window.multiLangEngine.runTests(userCode, this.currentLevel);
    this.lastTestRun = runResult;

    this.runCodeBtn.disabled = false;
    this.runCodeBtn.innerHTML = '▶ Run Code';

    // Update tabs
    const tabBtns = document.querySelectorAll('.test-tab-btn');
    runResult.results.forEach((r, idx) => {
      if (tabBtns[idx]) {
        tabBtns[idx].classList.remove('tab-passed', 'tab-failed');
        tabBtns[idx].classList.add(r.passed ? 'tab-passed' : 'tab-failed');
        tabBtns[idx].innerHTML = `<span>${r.passed ? '✓' : '✗'} Case ${idx + 1}</span>`;
      }
    });

    if (runResult.error) {
      this.testDetailBodyEl.innerHTML = `
        <div class="test-verdict-banner banner-failed"><span>Error Detected</span></div>
        <div class="stdout-box" style="color:var(--crimson); max-height:160px;">${this.esc(runResult.error)}</div>
      `;
      window.soundSystem?.playDefeat();
      if (window.dungeonArena) {
        window.dungeonArena.enemyAttack(12, 'Runtime Error Detected!');
      }
    } else {
      this.renderTestRunResult(runResult.results[this.activeTestTab]);
      window.soundSystem?.[runResult.passed ? 'playSuccess' : 'playDefeat']();
      if (window.dungeonArena) {
        if (runResult.passed) {
          const dmg = 15 + Math.floor(Math.random() * 15);
          window.dungeonArena.heroAttack(dmg, 'strike');
        } else {
          window.dungeonArena.enemyAttack(10, 'Tests Failed!');
        }
      }
    }
  }

  async submitSolution() {
    if (!this.currentLevel) return;
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '⚔️ Attacking...';

    const userCode = this.codeEditorEl.value;
    const runResult = await window.multiLangEngine.runTests(userCode, this.currentLevel);
    this.lastTestRun = runResult;

    this.submitBtn.disabled = false;
    this.submitBtn.innerHTML = '⚔️ Submit Solution';

    if (runResult.passed) {
      if (this.heroAvatarEl) this.heroAvatarEl.classList.add('attack-lunge-right');
      window.soundSystem?.playAttack();
      if (window.dungeonArena) {
        window.dungeonArena.heroAttack(999, 'magic');
      }

      setTimeout(() => {
        if (this.heroAvatarEl) this.heroAvatarEl.classList.remove('attack-lunge-right');
        if (this.enemyAvatarEl) this.enemyAvatarEl.classList.add('hit-shake');
        window.soundSystem?.playMonsterHit();
        if (this.enemyHpFillEl) this.enemyHpFillEl.style.width = '0%';
        if (this.enemyHpTextEl) this.enemyHpTextEl.textContent = '0 HP (Defeated!)';
        if (this.combatLogEl) this.combatLogEl.textContent = `💥 ${this.currentLevel.enemy.name} was vanquished!`;

        setTimeout(() => {
          if (this.enemyAvatarEl) this.enemyAvatarEl.classList.remove('hit-shake');
          if (window.dungeonArena) {
            window.dungeonArena.celebrateVictory();
          }
          this.handleQuestVictory();
        }, 700);
      }, 350);
    } else {
      if (this.combatLogEl) this.combatLogEl.textContent = `🛡️ Attack Deflected! Fix failing tests first!`;
      if (this.enemyAvatarEl) {
        this.enemyAvatarEl.classList.add('hit-shake');
        setTimeout(() => this.enemyAvatarEl.classList.remove('hit-shake'), 400);
      }
      window.soundSystem?.playDefeat();
      if (window.dungeonArena) {
        window.dungeonArena.enemyAttack(18, 'Solution Deflected!');
      }
      const firstFail = runResult.results.findIndex(r => !r.passed);
      if (firstFail !== -1) this.setActiveTestTab(firstFail);
    }
  }

  handleQuestVictory() {
    const level = this.currentLevel;
    const lang = window.multiLangEngine.getLanguage();
    if (!Array.isArray(this.player.completedLevels)) this.player.completedLevels = [];
    if (!Array.isArray(this.player.relics)) this.player.relics = [];
    const isFirstTime = !this.player.completedLevels.includes(level.id);

    if (isFirstTime) {
      this.player.completedLevels.push(level.id);
      this.player.xp += level.xpReward;
      this.player.gold += level.goldReward;
      if (level.relicUnlock && !this.player.relics.some(r => r.name === level.relicUnlock.name)) {
        this.player.relics.push(level.relicUnlock);
      }
      const newLevel = Math.floor(this.player.xp / 100) + 1;
      if (newLevel > this.player.level) {
        this.player.level = newLevel;
        window.soundSystem?.playLevelUp();
      } else {
        window.soundSystem?.playSuccess();
      }
    } else {
      window.soundSystem?.playSuccess();
    }

    // Track per-language completion
    if (!this.player.langCompletions) this.player.langCompletions = {};
    if (!this.player.langCompletions[lang]) this.player.langCompletions[lang] = [];
    if (!this.player.langCompletions[lang].includes(level.id)) {
      this.player.langCompletions[lang].push(level.id);
    }

    this.savePlayerData();
    this.updateQuestChain();

    // Victory modal
    document.getElementById('victoryQuestTitle').textContent = level.title;
    document.getElementById('victoryXpReward').textContent = `+${level.xpReward} XP`;
    document.getElementById('victoryGoldReward').textContent = `+${level.goldReward} Gold`;

    const langMeta = window.multiLangEngine.getLanguageMeta(lang);
    document.getElementById('victoryLangBadge').textContent = `Solved in ${langMeta.label} ${langMeta.icon}`;

    const relicSection = document.getElementById('victoryRelicSection');
    if (level.relicUnlock) {
      relicSection.style.display = 'block';
      document.getElementById('victoryRelicName').textContent = level.relicUnlock.name;
      document.getElementById('victoryRelicDesc').textContent = level.relicUnlock.description;
    } else {
      relicSection.style.display = 'none';
    }

    this.victoryModal.classList.add('active');
  }

  advanceToNextLevel() {
    const pool = this.currentMode === 'learn' ? (window.LESSONS || []) : (window.LEVELS || []);
    const idx = pool.findIndex(l => l.id === this.currentLevel.id);
    if (idx < pool.length - 1) {
      this.loadLevel(pool[idx + 1].id);
    } else {
      alert('🎉 INCREDIBLE! You have conquered all quests in this realm! You are a true Code Master!');
    }
  }

  updateHUD() {
    this.playerLevelEl.textContent = `Lvl ${this.player.level}`;
    this.playerGoldEl.textContent = `${this.player.gold}`;
    const currentXp = this.player.xp;
    const nextLevelXp = this.player.level * 100;
    const prevLevelXp = (this.player.level - 1) * 100;
    const progress = Math.min(100, Math.max(0, ((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));
    this.playerXpTextEl.textContent = `${currentXp} / ${nextLevelXp} XP`;
    this.xpBarFillEl.style.width = `${progress}%`;
  }

  // ==========================================
  // MODALS
  // ==========================================
  openRealmMap() {
    const grid = document.getElementById('realmMapGrid');
    grid.innerHTML = '';

    const pool = this.currentMode === 'learn' ? (window.LESSONS || []) : (window.LEVELS || []);
    const allRealms = this.currentMode === 'learn' ? (window.LEARN_REALMS || []) : (window.REALMS || []);

    // Group by realm
    const realmGroups = {};
    pool.forEach(level => {
      if (!realmGroups[level.realmId]) realmGroups[level.realmId] = [];
      realmGroups[level.realmId].push(level);
    });

    for (const realm of allRealms) {
      const levels = realmGroups[realm.id] || [];
      if (levels.length === 0) continue;

      const realmHeader = document.createElement('div');
      realmHeader.className = 'realm-header-card';
      realmHeader.style.gridColumn = '1 / -1';
      realmHeader.innerHTML = `
        <span style="font-size: 22px;">${realm.icon}</span>
        <span style="font-family: var(--font-display); font-weight: 800; font-size: 16px; color: ${realm.color};">${realm.name}</span>
        <span style="font-size: 12px; color: var(--text-secondary);">— ${realm.description}</span>
      `;
      grid.appendChild(realmHeader);

      const completedList = Array.isArray(this.player?.completedLevels) ? this.player.completedLevels : [];
      levels.forEach(level => {
        const isCompleted = completedList.includes(level.id);
        const isActive = this.currentLevel && this.currentLevel.id === level.id;
        const lang = window.multiLangEngine.getLanguage();
        const langCompleted = (this.player.langCompletions?.[lang] || []).includes(level.id);

        const card = document.createElement('div');
        card.className = `quest-card ${isActive ? 'quest-active' : ''} ${isCompleted ? 'quest-completed' : ''}`;
        const diffClass = { Easy: 'easy', Medium: 'medium', Hard: 'hard', Beginner: 'easy', Intermediate: 'medium', Advanced: 'hard' };
        card.innerHTML = `
          <div class="quest-card-header">
            <span class="quest-card-realm">${level.isLesson ? '📚 Lesson' : '⚔️ Quest'}</span>
            <span class="panel-badge badge-${diffClass[level.difficulty] || 'easy'}">${level.difficulty}</span>
          </div>
          <div class="quest-card-title">${level.title}</div>
          <div class="quest-card-concept">${level.concept}</div>
          <div style="font-size:11px; color:var(--text-muted); display:flex; justify-content: space-between;">
            <span>${level.enemy.name} ${level.enemy.avatar}</span>
            ${langCompleted ? '<span style="color:var(--green);">✓ ' + window.multiLangEngine.getLanguageMeta(lang).icon + '</span>' : ''}
          </div>
        `;
        card.addEventListener('click', () => {
          this.realmMapModal.classList.remove('active');
          this.loadLevel(level.id);
        });
        grid.appendChild(card);
      });
    }

    this.realmMapModal.classList.add('active');
    window.soundSystem?.playClick();
  }

  openRelicsModal() {
    const grid = document.getElementById('relicsGrid');
    if (!grid) return;
    const relics = Array.isArray(this.player?.relics) ? this.player.relics : [];
    grid.innerHTML = relics.length === 0
      ? `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:30px;">No relics yet. Slay bosses to claim artifacts!</div>`
      : relics.map(r => `
        <div class="relic-card unlocked">
          <div class="relic-icon">👑</div>
          <div class="relic-name">${r.name || 'Ancient Relic'}</div>
          <div class="relic-desc">${r.description || ''}</div>
        </div>
      `).join('');
    this.relicsModal.classList.add('active');
    window.soundSystem?.playClick();
  }

  openHintsModal() {
    if (!this.currentLevel) return;
    const body = document.getElementById('hintsModalBody');
    const lang = window.multiLangEngine.getLanguage();
    const theory = this.currentLevel.theory || this.currentLevel.teaching || 'No theory available for this quest.';
    const solution = this.currentLevel.solutions?.[lang] || this.currentLevel.solution || 'Solution not available for this language.';

    body.innerHTML = `
      <div class="theory-box">${theory.replace(/\n/g, '<br>')}</div>
      <div style="margin-top:20px;border-top:1px solid var(--border-subtle);padding-top:16px;">
        <button id="viewSolutionToggleBtn" class="btn-secondary" style="width:100%;justify-content:center;">
          🔓 Reveal ${window.multiLangEngine.getLanguageMeta(lang).label} Solution
        </button>
        <div id="solutionCodeBlock" style="display:none;margin-top:14px;">
          <pre><code>${this.esc(solution)}</code></pre>
        </div>
      </div>
    `;
    document.getElementById('viewSolutionToggleBtn').addEventListener('click', () => {
      const block = document.getElementById('solutionCodeBlock');
      const visible = block.style.display === 'block';
      block.style.display = visible ? 'none' : 'block';
      document.getElementById('viewSolutionToggleBtn').textContent = visible ? '🔓 Reveal Solution' : '🔒 Hide Solution';
    });
    this.hintsModal.classList.add('active');
    window.soundSystem?.playClick();
  }

  // ==========================================
  // SUPABASE CLOUD INTEGRATION
  // ==========================================
  openSupabaseModal() {
    if (!window.supabaseManager) return;
    const creds = window.supabaseManager.getCredentials();
    if (this.supabaseUrlInput) this.supabaseUrlInput.value = window.supabaseManager.isValidUrl(creds.url) ? creds.url : '';
    if (this.supabaseKeyInput) this.supabaseKeyInput.value = window.supabaseManager.isValidKey(creds.anonKey) ? creds.anonKey : '';
    if (this.sqlSchemaPre) this.sqlSchemaPre.textContent = window.supabaseManager.getSQLSchema();
    if (this.supabaseFeedbackMsg) this.supabaseFeedbackMsg.textContent = '';

    this.updateSupabaseStatusUI();
    if (this.supabaseModal) this.supabaseModal.classList.add('active');
    window.soundSystem?.playClick();
  }

  updateSupabaseStatusUI() {
    if (!window.supabaseManager) return;
    const isConfigured = window.supabaseManager.isConfigured();
    if (this.supabaseStatusDot) {
      this.supabaseStatusDot.style.background = isConfigured ? 'var(--green)' : 'var(--gold)';
    }
    if (this.supabaseStatusText) {
      this.supabaseStatusText.textContent = isConfigured
        ? 'Supabase: Configured (Online Cloud Sync Active) 🟢'
        : 'Supabase: Not Configured (Using Local Storage) ⚙️';
    }
    if (this.supabaseBtn) {
      this.supabaseBtn.innerHTML = isConfigured ? '⚡ Supabase 🟢' : '⚡ Supabase';
    }
  }

  async testSupabaseConnection() {
    if (!window.supabaseManager) return;
    if (this.supabaseFeedbackMsg) {
      this.supabaseFeedbackMsg.innerHTML = `<span style="color:var(--cyan);">Testing connection to Supabase...</span>`;
    }
    const res = await window.supabaseManager.testConnection();
    if (this.supabaseFeedbackMsg) {
      const color = res.ok ? (res.warning ? 'var(--gold)' : 'var(--green)') : 'var(--crimson)';
      this.supabaseFeedbackMsg.innerHTML = `<span style="color:${color}; font-weight:600;">${res.message}</span>`;
    }
    this.updateSupabaseStatusUI();
  }

  async saveSupabaseConfig() {
    if (!window.supabaseManager) return;
    const url = this.supabaseUrlInput ? this.supabaseUrlInput.value.trim() : '';
    const key = this.supabaseKeyInput ? this.supabaseKeyInput.value.trim() : '';

    try {
      window.supabaseManager.saveCredentials(url, key);
      if (this.supabaseFeedbackMsg) {
        this.supabaseFeedbackMsg.innerHTML = `<span style="color:var(--green); font-weight:600;">Credentials saved! Verifying connection...</span>`;
      }
      await this.testSupabaseConnection();

      // Trigger cloud sync of current player state
      if (this.player) {
        await window.authSystem.saveProgress(this.player);
      }
      this.updateSupabaseStatusUI();
      window.soundSystem?.playSuccess();
    } catch (err) {
      if (this.supabaseFeedbackMsg) {
        this.supabaseFeedbackMsg.innerHTML = `<span style="color:var(--crimson);">${err.message}</span>`;
      }
    }
  }

  clearSupabaseConfig() {
    if (!window.supabaseManager) return;
    window.supabaseManager.clearCredentials();
    if (this.supabaseUrlInput) this.supabaseUrlInput.value = '';
    if (this.supabaseKeyInput) this.supabaseKeyInput.value = '';
    if (this.supabaseFeedbackMsg) {
      this.supabaseFeedbackMsg.innerHTML = `<span style="color:var(--text-muted);">Supabase credentials cleared. Switched back to local mode.</span>`;
    }
    this.updateSupabaseStatusUI();
    window.soundSystem?.playClick();
  }

  copySqlSchema() {
    if (!window.supabaseManager) return;
    const sql = window.supabaseManager.getSQLSchema();
    navigator.clipboard.writeText(sql).then(() => {
      if (this.copySqlSchemaBtn) {
        const oldText = this.copySqlSchemaBtn.textContent;
        this.copySqlSchemaBtn.textContent = '✓ Copied!';
        setTimeout(() => { this.copySqlSchemaBtn.textContent = oldText; }, 2000);
      }
    }).catch(() => {
      alert('Could not copy to clipboard. Please select the text in the box and copy manually.');
    });
  }

  esc(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
}

document.addEventListener('DOMContentLoaded', () => { window.app = new AlgoQuestApp(); });
