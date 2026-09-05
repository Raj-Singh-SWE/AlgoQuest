/**
 * AlgoQuest: CodeCombat 2D RPG Dungeon Battlefield Engine
 * Renders a living dungeon battlefield with animated heroes, enemies, combat physics,
 * torchlight, weapon slashes, magic projectiles, floating combat text, and particle bursts.
 */

class DungeonArenaEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 720;
    this.height = 260;
    this.animId = null;
    this.lastTime = 0;

    // Combatants state
    this.hero = {
      x: 140,
      baseX: 140,
      y: 175,
      hp: 100,
      maxHp: 100,
      name: 'Code Knight',
      type: 'knight', // 'knight' | 'mage'
      state: 'idle', // 'idle' | 'running' | 'attacking' | 'hurt' | 'victory'
      frame: 0,
      facing: 1,
      targetX: 140,
      slashProgress: 0,
      shieldUp: false
    };

    this.enemy = {
      x: 580,
      baseX: 580,
      y: 175,
      hp: 100,
      maxHp: 100,
      name: 'Ogre Brute',
      avatar: '👹',
      state: 'idle', // 'idle' | 'hurt' | 'attacking' | 'defeated'
      frame: 0,
      facing: -1,
      flashTimer: 0
    };

    // Dungeon environment
    this.torches = [
      { x: 70, y: 55, flame: 0 },
      { x: 260, y: 55, flame: 0 },
      { x: 460, y: 55, flame: 0 },
      { x: 650, y: 55, flame: 0 }
    ];

    this.chest = {
      x: 360,
      y: 100,
      opened: false,
      glow: 0
    };

    // FX and dynamic entities
    this.projectiles = [];
    this.floatingTexts = [];
    this.particles = [];
    this.screenShake = 0;
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Start loop
    if (this.animId) cancelAnimationFrame(this.animId);
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = Math.max(rect.width || 720, 320);
    this.height = 240;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Reposition combatants relative to new width
    this.hero.baseX = Math.round(this.width * 0.18);
    this.hero.x = this.hero.baseX;
    this.hero.y = this.height - 75;

    this.enemy.baseX = Math.round(this.width * 0.82);
    this.enemy.x = this.enemy.baseX;
    this.enemy.y = this.height - 75;

    this.torches = [
      { x: Math.round(this.width * 0.1), y: 50, flame: 0 },
      { x: Math.round(this.width * 0.36), y: 50, flame: 0 },
      { x: Math.round(this.width * 0.64), y: 50, flame: 0 },
      { x: Math.round(this.width * 0.9), y: 50, flame: 0 }
    ];
    this.chest.x = Math.round(this.width * 0.5);
    this.chest.y = this.height - 110;
  }

  setCombatants(heroData, enemyData) {
    // If single merged config object was passed: { heroName, heroRole, enemyName, enemyMaxHp, enemyAvatar }
    if (heroData && !enemyData && (heroData.heroName || heroData.enemyName)) {
      enemyData = {
        name: heroData.enemyName,
        hp: heroData.enemyMaxHp,
        avatar: heroData.enemyAvatar
      };
      heroData = {
        name: heroData.heroName,
        type: heroData.heroRole,
        hp: heroData.heroHp || 100,
        maxHp: heroData.heroMaxHp || 100
      };
    }

    if (heroData) {
      this.hero.name = heroData.name || heroData.heroName || 'Hero';
      this.hero.hp = heroData.hp || 100;
      this.hero.maxHp = heroData.maxHp || 100;
      this.hero.type = heroData.type || heroData.heroRole || (heroData.lang === 'python' ? 'mage' : 'knight');
    }
    if (enemyData) {
      this.enemy.name = enemyData.name || enemyData.enemyName || 'Dungeon Boss';
      this.enemy.avatar = enemyData.avatar || enemyData.enemyAvatar || '👹';
      this.enemy.hp = enemyData.hp || enemyData.enemyMaxHp || 100;
      this.enemy.maxHp = enemyData.maxHp || enemyData.hp || enemyData.enemyMaxHp || 100;
      this.enemy.state = 'idle';
      this.enemy.flashTimer = 0;
    }
    this.hero.x = this.hero.baseX;
    this.enemy.x = this.enemy.baseX;
    this.chest.opened = false;
  }

  showCombatText(text, color = '#ffb703', size = 18) {
    this.addFloatingText(this.width * 0.5, this.height * 0.45, text, color, size);
  }

  // Hero attacks enemy
  heroAttack(damage = 35, isCrit = false, spellType = 'slash', onHit = null) {
    this.hero.state = 'running';
    const targetX = this.enemy.x - 70;

    // Tween to enemy
    const startTime = performance.now();
    const duration = 280;

    const stepTo = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.hero.x = this.hero.baseX + (targetX - this.hero.baseX) * ease;

      if (progress < 1) {
        requestAnimationFrame(stepTo);
      } else {
        // Execute strike
        this.hero.state = 'attacking';
        this.hero.slashProgress = 1;

        if (spellType === 'magic') {
          this.spawnMagicBurst(this.enemy.x, this.enemy.y);
        } else {
          this.spawnHitSparks(this.enemy.x, this.enemy.y - 20);
        }

        // Enemy reaction
        this.enemy.state = 'hurt';
        this.enemy.flashTimer = 18;
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        this.screenShake = isCrit ? 12 : 6;

        // Floating combat text
        const text = isCrit ? `CRITICAL -${damage}!` : `-${damage} HP`;
        const color = isCrit ? '#ffb703' : '#ff3366';
        this.addFloatingText(this.enemy.x, this.enemy.y - 65, text, color, isCrit ? 22 : 17);

        if (typeof onHit === 'function') onHit();

        // Retreat back
        setTimeout(() => {
          this.hero.state = 'running';
          const returnStart = performance.now();
          const returnDuration = 240;

          const stepBack = (tNow) => {
            const rElapsed = tNow - returnStart;
            const rProgress = Math.min(rElapsed / returnDuration, 1);
            const rEase = 1 - Math.pow(1 - rProgress, 2);
            this.hero.x = targetX + (this.hero.baseX - targetX) * rEase;

            if (rProgress < 1) {
              requestAnimationFrame(stepBack);
            } else {
              this.hero.x = this.hero.baseX;
              this.hero.state = 'idle';
              this.hero.slashProgress = 0;
            }
          };
          requestAnimationFrame(stepBack);
        }, 180);
      }
    };
    requestAnimationFrame(stepTo);
  }

  // Enemy counter-attacks
  enemyAttack(damage = 15, onHit = null) {
    this.enemy.state = 'attacking';
    this.screenShake = 4;

    // Launch shadow projectile towards hero
    this.projectiles.push({
      x: this.enemy.x - 30,
      y: this.enemy.y - 20,
      targetX: this.hero.x + 30,
      targetY: this.hero.y - 20,
      color: '#bd00ff',
      radius: 9,
      speed: 12
    });

    setTimeout(() => {
      this.hero.shieldUp = true;
      this.hero.state = 'hurt';
      this.hero.hp = Math.max(0, this.hero.hp - damage);
      this.addFloatingText(this.hero.x, this.hero.y - 60, `BLOCKED! -${damage}`, '#00e5ff', 16);
      this.screenShake = 6;
      if (typeof onHit === 'function') onHit();

      setTimeout(() => {
        this.hero.shieldUp = false;
        this.hero.state = 'idle';
        this.enemy.state = 'idle';
      }, 350);
    }, 250);
  }

  // Victory celebration & chest loot burst
  celebrateVictory() {
    this.hero.state = 'victory';
    this.enemy.state = 'defeated';
    this.enemy.hp = 0;
    this.chest.opened = true;

    // Gold coin and gem burst
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      this.particles.push({
        x: this.chest.x,
        y: this.chest.y + 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        type: 'coin',
        life: 60 + Math.random() * 40,
        maxLife: 100,
        color: Math.random() > 0.3 ? '#ffb703' : '#00e5ff'
      });
    }

    this.addFloatingText(this.hero.x, this.hero.y - 75, 'VICTORY! 🏆', '#00ff88', 24);
    this.addFloatingText(this.chest.x, this.chest.y - 45, '+GOLD & XP! 🪙', '#ffb703', 18);
  }

  spawnHitSparks(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5);
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'spark',
        life: 25 + Math.random() * 15,
        maxLife: 40,
        color: Math.random() > 0.5 ? '#00e5ff' : '#ffffff'
      });
    }
  }

  spawnMagicBurst(x, y) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'magic',
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: '#bd00ff'
      });
    }
  }

  addFloatingText(x, y, text, color = '#ffffff', size = 16) {
    this.floatingTexts.push({
      x, y,
      text,
      color,
      size,
      vy: -1.4,
      alpha: 1,
      life: 55
    });
  }

  // Animation Loop
  loop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
    this.render();

    this.animId = requestAnimationFrame(this.loop);
  }

  update(dt) {
    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake *= 0.85;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    // Flash timer decay
    if (this.enemy.flashTimer > 0) this.enemy.flashTimer--;

    // Torches flame wave
    this.torches.forEach(t => {
      t.flame = (t.flame + 0.15) % (Math.PI * 2);
    });

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < p.speed) {
        this.spawnHitSparks(p.targetX, p.targetY);
        this.projectiles.splice(i, 1);
      } else {
        p.x += (dx / dist) * p.speed;
        p.y += (dy / dist) * p.speed;
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;
      ft.alpha = Math.max(0, ft.life / 55);
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.type === 'coin') {
        pt.vy += 0.25; // gravity
        if (pt.y > this.height - 40) {
          pt.y = this.height - 40;
          pt.vy = -pt.vy * 0.45;
        }
      }
      pt.life--;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    // Hero idle cycle
    this.hero.frame = (this.hero.frame + 0.08) % (Math.PI * 2);
    this.enemy.frame = (this.enemy.frame + 0.06) % (Math.PI * 2);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.save();

    // Screen shake offset
    if (this.screenShake > 0) {
      const ox = (Math.random() - 0.5) * this.screenShake;
      const oy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(ox, oy);
    }

    // Clear
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Medieval Stone Dungeon Background
    this.drawDungeonBackground(ctx);

    // 2. Draw Torches & Wall Glow
    this.drawTorches(ctx);

    // 3. Draw Treasure Chest
    this.drawTreasureChest(ctx);

    // 4. Draw Hero Character
    this.drawHero(ctx);

    // 5. Draw Enemy Monster
    this.drawEnemy(ctx);

    // 6. Draw Projectiles
    this.drawProjectiles(ctx);

    // 7. Draw Particles
    this.drawParticles(ctx);

    // 8. Draw Floating Combat Text
    this.drawFloatingTexts(ctx);

    ctx.restore();
  }

  drawDungeonBackground(ctx) {
    // Stone Wall upper section
    const wallHeight = this.height - 70;
    const wallGrad = ctx.createLinearGradient(0, 0, 0, wallHeight);
    wallGrad.addColorStop(0, '#0c101d');
    wallGrad.addColorStop(1, '#13192e');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, this.width, wallHeight);

    // Stone brick grid on wall
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const brickH = 26;
    const brickW = 60;
    for (let y = 0; y < wallHeight; y += brickH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();

      const offset = (Math.floor(y / brickH) % 2) * (brickW / 2);
      for (let x = offset; x < this.width; x += brickW) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + brickH);
        ctx.stroke();
      }
    }

    // Floor (Cobblestone / flagstone tiles)
    const floorY = wallHeight;
    const floorH = this.height - floorY;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, this.height);
    floorGrad.addColorStop(0, '#10162a');
    floorGrad.addColorStop(1, '#080c16');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, this.width, floorH);

    // Stone rim line between wall and floor
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(this.width, floorY);
    ctx.stroke();

    // Floor perspective tile lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 55) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x + (x - this.width / 2) * 0.4, this.height);
      ctx.stroke();
    }
  }

  drawTorches(ctx) {
    this.torches.forEach(t => {
      // Iron sconce bracket
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(t.x - 3, t.y, 6, 16);
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(t.x - 7, t.y - 4, 14, 6);

      // Flickering flame glow
      const flicker = Math.sin(t.flame) * 3;
      const rad = 28 + flicker;
      const glowGrad = ctx.createRadialGradient(t.x, t.y - 10, 2, t.x, t.y - 10, rad);
      glowGrad.addColorStop(0, 'rgba(255, 183, 3, 0.5)');
      glowGrad.addColorStop(0.5, 'rgba(255, 90, 0, 0.2)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(t.x, t.y - 10, rad, 0, Math.PI * 2);
      ctx.fill();

      // Flame core
      ctx.fillStyle = '#ffeedd';
      ctx.beginPath();
      ctx.arc(t.x, t.y - 8, 4 + flicker * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawTreasureChest(ctx) {
    const c = this.chest;
    ctx.save();
    ctx.translate(c.x, c.y);

    // Wood chest body
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(-18, 0, 36, 22);

    // Gold trim
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-18, 0, 36, 22);

    if (c.opened) {
      // Open lid tilted back
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-22, -16);
      ctx.lineTo(22, -16);
      ctx.lineTo(18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gold glow radiating from inside
      const glow = ctx.createRadialGradient(0, -6, 2, 0, -6, 30);
      glow.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, -6, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Closed lid
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(-18, -10, 36, 10);
      ctx.strokeRect(-18, -10, 36, 10);

      // Keyhole lock
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawHero(ctx) {
    const h = this.hero;
    ctx.save();
    ctx.translate(h.x, h.y);

    // Idle bobbing / running bounce
    const bob = h.state === 'running'
      ? Math.sin(performance.now() * 0.02) * 5
      : Math.sin(h.frame) * 3;
    ctx.translate(0, bob);

    // 1. Shadow beneath hero
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Overhead Health Bar & Tag
    this.drawOverheadBar(ctx, 0, -56, h.hp, h.maxHp, h.name, '#00e5ff', '#00ff88');

    // 3. Hero Avatar & Weapon Animation
    if (h.type === 'mage') {
      // Mage Robe & Staff
      ctx.font = '38px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧙‍♂️', 0, -14);

      // Glowing Staff
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(18, -26 + bob * 0.5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Knight Body & Armor
      ctx.font = '42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(h.state === 'victory' ? '🦸' : '⚔️', 0, -14);
    }

    // Shield defense display
    if (h.shieldUp) {
      ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, -14, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Sword slash trail
    if (h.slashProgress > 0) {
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(28, -14, 40, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  drawEnemy(ctx) {
    const e = this.enemy;
    ctx.save();
    ctx.translate(e.x, e.y);

    // Idle breathing
    const bob = e.state === 'defeated' ? 8 : Math.sin(e.frame) * 3;
    ctx.translate(0, bob);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Overhead Health Bar & Name
    this.drawOverheadBar(ctx, 0, -60, e.hp, e.maxHp, e.name, '#ff3366', '#ff7b00');

    // Hurt red flash
    if (e.flashTimer > 0) {
      ctx.filter = 'drop-shadow(0 0 15px rgba(255, 51, 102, 0.9))';
    }

    // Enemy Avatar
    ctx.font = e.state === 'defeated' ? '40px sans-serif' : '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.state === 'defeated' ? '💀' : e.avatar, 0, -16);
    ctx.filter = 'none';

    ctx.restore();
  }

  drawOverheadBar(ctx, x, y, hp, maxHp, title, color1, color2) {
    const width = 64;
    const height = 6;
    const pct = Math.max(0, Math.min(hp / Math.max(maxHp, 1), 1));

    // Title label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, x, y - 6);

    // Bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - width / 2, y, width, height);

    // Bar border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width / 2, y, width, height);

    // Fill
    if (pct > 0) {
      const grad = ctx.createLinearGradient(x - width / 2, 0, x - width / 2 + width, 0);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(x - width / 2 + 1, y + 1, (width - 2) * pct, height - 2);
    }
  }

  drawProjectiles(ctx) {
    this.projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  drawParticles(ctx) {
    this.particles.forEach(pt => {
      ctx.save();
      const alpha = pt.life / pt.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pt.color;

      if (pt.type === 'coin') {
        ctx.font = '14px sans-serif';
        ctx.fillText('🪙', pt.x, pt.y);
      } else {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  drawFloatingTexts(ctx) {
    this.floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.size}px Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }
}

window.dungeonArena = new DungeonArenaEngine();
