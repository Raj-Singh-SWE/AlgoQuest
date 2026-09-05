/**
 * AlgoQuest Authentication & Cloud Save System
 * Integrates:
 * 1. Supabase PostgreSQL Database (`public.profiles`) & Supabase Auth (Google OAuth & Email)
 * 2. Direct Gmail / Google Account Sign-In with per-account progress isolation
 * 3. Seamless guest-to-account progress merging
 * 4. Multi-account remembering and instant offline/online sync
 */

class AuthSystem {
  constructor() {
    this.user = null;
    this.isGuest = true;
    this.onAuthChange = null;
  }

  async init(onAuthChangeCallback) {
    this.onAuthChange = onAuthChangeCallback;

    // 1. Check for active Supabase session if configured
    if (window.supabaseManager && window.supabaseManager.isConfigured()) {
      const supabase = window.supabaseManager.getClient();
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            this.user = this.formatSupabaseUser(session.user);
            this.isGuest = false;
            this.saveLocalSession(this.user);
            console.info('[Auth] Restored Supabase session for:', this.user.email);
            this.notifyAuthChange();
            return;
          }

          // Listen for OAuth redirects & auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
              this.user = this.formatSupabaseUser(session.user);
              this.isGuest = false;
              this.saveLocalSession(this.user);
              this.notifyAuthChange();
            } else if (event === 'SIGNED_OUT') {
              this.user = null;
              this.isGuest = true;
              this.notifyAuthChange();
            }
          });
        } catch (err) {
          console.warn('[Auth] Supabase session check error:', err);
        }
      }
    }

    // 2. Fallback: Check local saved session
    const savedSession = this.loadLocalSession();
    if (savedSession) {
      this.user = savedSession;
      this.isGuest = false;
      console.info(`[Auth] Restored active local session for: ${this.user.email}`);
    } else {
      this.isGuest = true;
      this.user = null;
    }

    this.notifyAuthChange();
  }

  formatSupabaseUser(sbUser) {
    const email = sbUser.email || 'hero@gmail.com';
    const metadata = sbUser.user_metadata || {};
    const name = metadata.full_name || metadata.name || email.split('@')[0];
    const photo = metadata.avatar_url || metadata.picture || this.generateAvatarUrl(email, name);

    return {
      uid: sbUser.id || 'sb_' + btoa(email).replace(/=/g, ''),
      displayName: name,
      email: email,
      photoURL: photo,
      isSupabase: true,
      lastLogin: new Date().toISOString()
    };
  }

  // Generate Google-style avatar badge
  generateAvatarUrl(email, name) {
    const initial = (name || email || 'G').charAt(0).toUpperCase();
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E24AA', '#0097A7', '#10B981'];
    let hash = 0;
    for (let i = 0; i < (email || '').length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
    const color = colors[Math.abs(hash) % colors.length];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="32" fill="${color}"/>
      <text x="32" y="40" font-size="28" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="700" fill="#ffffff" text-anchor="middle">${initial}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // Sign in with Gmail address and display name
  signInWithGmail(email, customName = '') {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email or Gmail address.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const derivedName = customName.trim() || cleanEmail.split('@')[0]
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const userObj = {
      uid: 'user_' + btoa(cleanEmail).replace(/=/g, ''),
      displayName: derivedName,
      email: cleanEmail,
      photoURL: this.generateAvatarUrl(cleanEmail, derivedName),
      isSupabase: window.supabaseManager?.isConfigured() || false,
      lastLogin: new Date().toISOString()
    };

    this.user = userObj;
    this.isGuest = false;

    // Save session & record into remembered accounts
    this.saveLocalSession(userObj);
    this.recordRecentAccount(userObj);

    this.notifyAuthChange();
    return userObj;
  }

  // Google Sign-In with Supabase OAuth or Fallback
  async signInWithGoogle() {
    if (window.supabaseManager && window.supabaseManager.isConfigured()) {
      const supabase = window.supabaseManager.getClient();
      if (supabase) {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + window.location.pathname
            }
          });
          if (error) {
            console.warn('[Supabase] OAuth trigger error:', error.message);
          } else {
            return null; // Redirect is taking place
          }
        } catch (err) {
          console.warn('[Supabase] Google OAuth failed, using Gmail fallback:', err.message);
        }
      }
    }

    // Interactive Gmail sign-in prompt
    const defaultEmail = this.getRecentAccounts()[0]?.email || '';
    const email = prompt('Enter your Google / Gmail address to sign in & sync your progress:', defaultEmail || 'hero@gmail.com');
    if (!email) return null;

    try {
      return this.signInWithGmail(email);
    } catch (err) {
      alert(err.message);
      return null;
    }
  }

  async signOut() {
    if (window.supabaseManager && window.supabaseManager.isConfigured()) {
      const supabase = window.supabaseManager.getClient();
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('[Supabase] Sign-out error:', e);
        }
      }
    }

    this.user = null;
    this.isGuest = true;
    localStorage.removeItem('algoquest_current_session');
    this.notifyAuthChange();
  }

  // Save session state to localStorage
  saveLocalSession(user) {
    try {
      localStorage.setItem('algoquest_current_session', JSON.stringify(user));
    } catch (e) {
      console.warn('[Auth] Could not save session:', e);
    }
  }

  loadLocalSession() {
    try {
      const data = localStorage.getItem('algoquest_current_session');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Save progress (both locally and to Supabase Cloud)
  async saveProgress(playerData) {
    if (!this.user || this.isGuest) {
      try {
        localStorage.setItem('algoquest_player', JSON.stringify(playerData));
      } catch (e) {}
      return;
    }

    // Save to user-specific local storage slot
    try {
      const key = `algoquest_player_${this.user.email}`;
      localStorage.setItem(key, JSON.stringify(playerData));
      localStorage.setItem('algoquest_player', JSON.stringify(playerData));
    } catch (e) {
      console.warn('[Auth] Could not save user progress locally:', e);
    }

    // Sync to Supabase PostgreSQL Database
    if (window.supabaseManager && window.supabaseManager.isConfigured()) {
      await this.saveToCloud(playerData);
    }
  }

  // Load progress (from Supabase Cloud or local account save)
  async loadProgress() {
    if (!this.user || this.isGuest) {
      try {
        const raw = localStorage.getItem('algoquest_player');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    // 1. Try loading from Supabase Cloud
    if (window.supabaseManager && window.supabaseManager.isConfigured()) {
      const cloudData = await this.loadFromCloud();
      if (cloudData) {
        return cloudData;
      }
    }

    // 2. Try loading from local account save
    try {
      const key = `algoquest_player_${this.user.email}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // 3. Fallback to generic slot
    try {
      const raw = localStorage.getItem('algoquest_player');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Write player record to Supabase public.profiles table
  async saveToCloud(playerData) {
    if (!this.user || !window.supabaseManager) return false;
    const supabase = window.supabaseManager.getClient();
    if (!supabase) return false;

    try {
      const row = {
        id: this.user.uid,
        email: this.user.email,
        display_name: this.user.displayName,
        avatar_url: this.user.photoURL,
        xp: playerData.xp || 0,
        level: playerData.level || 1,
        gold: playerData.gold || 0,
        player_hp: playerData.playerHp || 100,
        player_max_hp: playerData.playerMaxHp || 100,
        current_level_id: playerData.currentLevelId || 'level-1',
        completed_levels: playerData.completedLevels || [],
        relics: playerData.relics || [],
        lang_completions: playerData.langCompletions || {},
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('profiles').upsert(row);
      if (error) {
        console.warn('[Supabase] Cloud save error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] Cloud save exception:', err);
      return false;
    }
  }

  // Read player record from Supabase public.profiles table
  async loadFromCloud() {
    if (!this.user || !window.supabaseManager) return null;
    const supabase = window.supabaseManager.getClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.uid)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        xp: data.xp || 0,
        level: data.level || 1,
        gold: data.gold || 0,
        playerHp: data.player_hp || 100,
        playerMaxHp: data.player_max_hp || 100,
        currentLevelId: data.current_level_id || 'level-1',
        completedLevels: data.completed_levels || [],
        relics: data.relics || [],
        langCompletions: data.lang_completions || {}
      };
    } catch (err) {
      console.warn('[Supabase] Cloud load exception:', err);
      return null;
    }
  }

  // Save recent accounts for quick 1-click login
  recordRecentAccount(user) {
    try {
      let accounts = this.getRecentAccounts();
      accounts = accounts.filter(a => a.email !== user.email);
      accounts.unshift({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      });
      localStorage.setItem('algoquest_recent_accounts', JSON.stringify(accounts.slice(0, 5)));
    } catch (e) {}
  }

  getRecentAccounts() {
    try {
      const raw = localStorage.getItem('algoquest_recent_accounts');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  notifyAuthChange() {
    if (typeof this.onAuthChange === 'function') {
      this.onAuthChange(this.user, this.isGuest);
    }
  }

  getDisplayName() {
    if (this.user) return this.user.displayName || 'Hero';
    return 'Guest Adventurer';
  }

  getEmail() {
    if (this.user) return this.user.email;
    return null;
  }

  getPhotoURL() {
    if (this.user && this.user.photoURL) return this.user.photoURL;
    return null;
  }

  isSupabaseActive() {
    return window.supabaseManager?.isConfigured() || false;
  }

  mergeGuestProgress(localPlayer, accountPlayer) {
    if (!accountPlayer) return localPlayer;
    const merged = { ...accountPlayer };

    if (localPlayer.xp > merged.xp) merged.xp = localPlayer.xp;
    if (localPlayer.level > merged.level) merged.level = localPlayer.level;
    if (localPlayer.gold > merged.gold) merged.gold = localPlayer.gold;

    const allCompleted = new Set([
      ...(merged.completedLevels || []),
      ...(localPlayer.completedLevels || [])
    ]);
    merged.completedLevels = [...allCompleted];

    const relicNames = new Set((merged.relics || []).map(r => r.name));
    for (const relic of (localPlayer.relics || [])) {
      if (!relicNames.has(relic.name)) {
        merged.relics = merged.relics || [];
        merged.relics.push(relic);
        relicNames.add(relic.name);
      }
    }

    if (localPlayer.langCompletions) {
      merged.langCompletions = merged.langCompletions || {};
      for (const [lang, levels] of Object.entries(localPlayer.langCompletions)) {
        if (!merged.langCompletions[lang]) {
          merged.langCompletions[lang] = levels;
        } else {
          const union = new Set([...merged.langCompletions[lang], ...levels]);
          merged.langCompletions[lang] = [...union];
        }
      }
    }

    return merged;
  }
}

window.authSystem = new AuthSystem();
