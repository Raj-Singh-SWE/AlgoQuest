/**
 * AlgoQuest: CodeCombat Story Dialogue & Narrative Engine
 * Delivers authentic RPG narrative briefings, Archmage Olgard dialogues,
 * and mission objectives before entering battle.
 */

class StoryDialogueManager {
  constructor() {
    this.modalEl = null;
    this.typewriterTimer = null;
    this.autoShow = localStorage.getItem('algoquest_story_autoshow') !== 'false';
    this.initDOM();
  }

  initDOM() {
    // Check if modal container exists or create it
    let modal = document.getElementById('storyModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay story-modal-overlay';
      modal.id = 'storyModal';
      modal.innerHTML = `
        <div class="modal-card story-dialogue-card">
          <div class="story-card-header">
            <div class="story-speaker-badge">
              <span class="speaker-avatar" id="storySpeakerAvatar">🧙‍♂️</span>
              <div class="speaker-meta">
                <span class="speaker-name" id="storySpeakerName">Archmage Olgard</span>
                <span class="speaker-title" id="storySpeakerTitle">Grand Wizard of Algorithmia</span>
              </div>
            </div>
            <button class="modal-close-btn" id="storyCloseBtn">×</button>
          </div>
          <div class="modal-body story-card-body">
            <div class="story-scroll-frame">
              <div class="story-chapter-tag" id="storyChapterTag">Chapter 1: The Dungeons of Kithgard</div>
              <h3 class="story-quest-heading" id="storyQuestHeading">The Scrambled Gate</h3>
              
              <!-- Dialogue Speech Bubble -->
              <div class="story-dialogue-bubble">
                <div class="dialogue-quote-mark">“</div>
                <div class="story-dialogue-text" id="storyDialogueText">...</div>
              </div>

              <!-- Mission Objectives -->
              <div class="story-objectives-box">
                <div class="objectives-title">🎯 Quest Directives:</div>
                <ul class="objectives-list" id="storyObjectivesList">
                  <li><span>1</span> Write the Python algorithm to decode the dungeon runes</li>
                  <li><span>2</span> Pass all algorithmic test cases in constant or linear time</li>
                  <li><span>3</span> Strike down the dungeon guardian with your code spells</li>
                </ul>
              </div>

              <!-- Enemy dossier preview -->
              <div class="story-dossier" id="storyDossier">
                <span class="dossier-avatar" id="storyEnemyAvatar">🗿</span>
                <div class="dossier-info">
                  <span class="dossier-label">Target Enemy:</span>
                  <span class="dossier-name" id="storyEnemyName">Gilded Golem</span>
                  <span class="dossier-threat" id="storyEnemyThreat">Threat: Low</span>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="story-footer-actions">
              <label class="story-autoshow-toggle">
                <input type="checkbox" id="storyAutoShowCheck" ${this.autoShow ? 'checked' : ''}>
                <span>Show briefings automatically</span>
              </label>
              <button class="btn-submit story-begin-btn" id="storyBeginBtn">
                ⚔️ Begin Battle!
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modalEl = modal;

    // Attach events
    const closeBtn = document.getElementById('storyCloseBtn');
    const beginBtn = document.getElementById('storyBeginBtn');
    const autoCheck = document.getElementById('storyAutoShowCheck');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (beginBtn) beginBtn.addEventListener('click', () => {
      this.close();
      window.soundSystem?.playAttack();
    });
    if (autoCheck) {
      autoCheck.addEventListener('change', (e) => {
        this.autoShow = e.target.checked;
        localStorage.setItem('algoquest_story_autoshow', this.autoShow);
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });
  }

  getStoryContent(level) {
    // Custom CodeCombat narrative lore for each level
    const storyCatalog = {
      'level-1': {
        chapter: 'Chapter I: The Linear Lands',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "Greetings, apprentice! The ancient stone gate of Kithgard has locked behind us. Its mechanism is sealed by an inverted runic array. You must invoke the Two-Pointer incantation — inverting the sequence from both ends — to disarm the Gilded Golem before its ancient wards crush us!",
        objectives: [
          'Implement reverse_array(arr) using two pointers or list reversal',
          'Ensure the reversed list returns intact for all integer test cases',
          'Disarm the Gilded Golem to breach the sanctuary gates'
        ]
      },
      'level-2': {
        chapter: 'Chapter I: The Linear Lands',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "Look out! The Twin Sentinels guard the inner courtyard. They mirror each other in power and only open the gate if you present two numerical keys whose sum matches their magical target seal. Use a hash map memory enchantment to locate the pair in O(N) time!",
        objectives: [
          'Store visited numbers and complements in a hash map',
          'Return the zero-based indices of the matching number pair',
          'Vanquish the Twin Sentinels with quadratic-free code'
        ]
      },
      'level-3': {
        chapter: 'Chapter I: The Linear Lands',
        speaker: 'Princess of Pointers',
        speakerTitle: 'Guardian of the Memory Vault',
        avatar: '👸',
        dialogue: "The Chaos Elementalist is whipping up a terrifying storm of mana! Positive energy charges are mixed with devastating drains. We must channel Kadane's Ancient Spell to capture the maximum contiguous burst of energy before the storm dissipates!",
        objectives: [
          'Calculate the maximum sum of a contiguous subarray using Kadane’s algorithm',
          'Handle negative integer surges without resetting below single elements',
          'Absorb the elemental blast and calm the storm'
        ]
      },
      'level-4': {
        chapter: 'Chapter I: The Linear Lands',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "We have reached the Sunken Ruins of Atlantis! The Tidebringer Leviathan threatens to flood the chamber. We must erect two hydraulic barrier pillars that maximize the trapped reservoir area. Narrow your pointers wisely from the edges inwards!",
        objectives: [
          'Find two vertical barrier lines that contain the maximum water volume',
          'Shift the shorter boundary pointer inward to maximize potential height',
          'Drain the Leviathan’s reservoir and claim the water jewel'
        ]
      },
      'level-5': {
        chapter: 'Chapter II: The Citadel of Stacks & Queues',
        speaker: 'High Monk of LIFO',
        speakerTitle: 'Keeper of Sacred Nesting',
        avatar: '🧘‍♂️',
        dialogue: "Step carefully, hero. The Rune Crypt of Parentheses requires absolute symmetry. Every open bracket must be sealed by its corresponding sacred glyph in reverse order of appearance. A LIFO stack spell is the only charm that will preserve the sanctity of the crypt!",
        objectives: [
          'Push opening brackets onto your spell stack: (, {, [',
          'Pop and verify corresponding closing symbols match perfectly',
          'Banish the Glyph Phantom by validating the sacred runic inscriptions'
        ]
      },
      'level-6': {
        chapter: 'Chapter II: The Citadel of Stacks & Queues',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "The Iron Colossus possesses armor impenetrable by ordinary blows. Only by constantly tracking its lowest defense rating in O(1) constant time can we strike where it hurts most! Forge a dual-stack MinStack artifact to crack its defense!",
        objectives: [
          'Build a MinStack supporting push, pop, top, and get_min',
          'Ensure get_min returns the minimum element in constant O(1) time',
          'Expose the Colossus’s weak point and shatter its iron plating'
        ]
      },
      'level-7': {
        chapter: 'Chapter II: The Citadel of Stacks & Queues',
        speaker: 'Princess of Pointers',
        speakerTitle: 'Guardian of the Memory Vault',
        avatar: '👸',
        dialogue: "The Frost Wyrm has blanketed the volcanic ridge in sub-zero blizzards! We must monitor the temperature shifts day by day. Using a monotonic stack, look into the future days to see how long our party must wait until the next warmer temperature arrives!",
        objectives: [
          'Maintain a decreasing monotonic stack of day indices',
          'Calculate day deltas when a higher temperature is encountered',
          'Melt the Frost Wyrm’s icy breath and rekindle the campfire'
        ]
      },
      'level-8': {
        chapter: 'Chapter III: The Linked Labyrinth',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "The Bone Reaver has bound the souls of the dungeon prisoners with an enchanted linked chain. Each link only knows the memory address of the next! Re-wire every pointer link in reverse order before the dark ritual is complete!",
        objectives: [
          'Iterate through the linked nodes with prev, curr, and nxt pointers',
          'Reverse each pointer direction without losing reference to the next node',
          'Sunder the Bone Reaver’s chains and liberate the trapped spirits'
        ]
      },
      'level-9': {
        chapter: 'Chapter III: The Linked Labyrinth',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "Beware! The Serpent of Ouroboros has trapped us in an infinite memory loop! Any warrior who walks forward will loop forever through the dungeon halls unless we cast Floyd’s Tortoise and Hare detection hex. If our fast scout and slow scout meet, we have trapped the serpent in its own circle!",
        objectives: [
          'Deploy slow pointer (1 step) and fast pointer (2 steps)',
          'Detect if fast and slow pointers ever collide',
          'Break the infinite cycle and vanquish the World Serpent'
        ]
      },
      'level-10': {
        chapter: 'Chapter III: The Linked Labyrinth',
        speaker: 'Princess of Pointers',
        speakerTitle: 'Guardian of the Memory Vault',
        avatar: '👸',
        dialogue: "Two ancient bloodline warrior regiments arrive from opposite flanks of the battlefield, each pre-sorted by rank. You must weave them into a unified army in ascending rank without spilling a single soldier!",
        objectives: [
          'Compare heads of both sorted lists sequentially',
          'Splice the smaller node into the merged output chain',
          'Unite the royal legion and overwhelm the Gilded Chimera'
        ]
      },
      'level-14': {
        chapter: 'Chapter V: The Caverns of Graphs',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "We sail into the Archipelago of Mist! The Kraken Lurker lurks beneath the murky grid of waters. We must count the number of isolated land masses by sending our search familiars to sink each explored island into the sea using Depth-First Search!",
        objectives: [
          'Traverse the 2D grid searching for unvisited land tiles ("1")',
          'Recursively sink all 4-directional connected land with DFS',
          'Total the island count and evade the Kraken’s grasp'
        ]
      },
      'level-16': {
        chapter: 'Chapter VI: The Dynamic Spire',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "We have reached the foot of the Dynamic Spire! The stone steps shift beneath our feet. Each leap can take 1 or 2 stairs. Calculate the exact number of distinct paths to reach the summit where the Final Boss awaits!",
        objectives: [
          'Formulate the Fibonacci dynamic recurrence: dp[i] = dp[i-1] + dp[i-2]',
          'Solve the staircase paths in linear time and constant space',
          'Ascend to the heavens and face the final trial'
        ]
      },
      'level-18': {
        chapter: 'Chapter VI: The Dynamic Spire',
        speaker: 'Archmage Olgard',
        speakerTitle: 'Grand Wizard of Algorithmia',
        avatar: '🧙‍♂️',
        dialogue: "THE FINAL BATTLE HAS ARRIVED! The Big-O Behemoth stands before us, consuming computational cycles across reality! Only the ultimate incantation — finding the Longest Increasing Subsequence using patience sorting and binary search in O(N log N) — can pierce its infinite complexity shield!",
        objectives: [
          'Maintain an optimal tails array via binary search (bisect_left)',
          'Track the strictly increasing subsequence length in O(N log N)',
          'Slay the Big-O Behemoth and become the legendary Grandmaster of Algorithmia!'
        ]
      }
    };

    const fallback = {
      chapter: level.realmId ? `Realm: ${level.realmId}` : 'The Chronicles of Algorithmia',
      speaker: 'Archmage Olgard',
      speakerTitle: 'Grand Wizard of Algorithmia',
      avatar: '🧙‍♂️',
      dialogue: level.story || "A formidable dungeon challenge stands before us! Examine the runes carefully, structure your code algorithms, and unleash your solution to strike down the monster!",
      objectives: [
        `Implement the requested algorithm for ${level.title}`,
        'Pass all test verification cases with 0 syntax or logic errors',
        `Defeat ${level.enemy?.name || 'the Boss'} and claim XP and gold`
      ]
    };

    return storyCatalog[level.id] || fallback;
  }

  showBriefing(level, force = false) {
    if (!this.autoShow && !force) return;
    if (!level) return;

    const data = this.getStoryContent(level);

    document.getElementById('storySpeakerName').textContent = data.speaker;
    document.getElementById('storySpeakerTitle').textContent = data.speakerTitle;
    document.getElementById('storySpeakerAvatar').textContent = data.avatar;
    document.getElementById('storyChapterTag').textContent = data.chapter;
    document.getElementById('storyQuestHeading').textContent = level.title;

    // Enemy dossier
    document.getElementById('storyEnemyAvatar').textContent = level.enemy?.avatar || '👹';
    document.getElementById('storyEnemyName').textContent = level.enemy?.name || 'Dungeon Boss';
    document.getElementById('storyEnemyThreat').textContent = `Difficulty: ${level.difficulty || 'Normal'}`;

    // Objectives
    const objList = document.getElementById('storyObjectivesList');
    objList.innerHTML = data.objectives.map((obj, i) => `
      <li><span>${i + 1}</span> ${obj}</li>
    `).join('');

    // Typewriter effect on dialogue text
    const textEl = document.getElementById('storyDialogueText');
    textEl.textContent = '';
    
    if (this.modalEl) {
      this.modalEl.classList.add('active');
    }
    window.soundSystem?.playClick();

    // Typewriter
    clearTimeout(this.typewriterTimer);
    let charIndex = 0;
    const fullText = data.dialogue;
    const typeSpeed = 12;

    const typeNext = () => {
      if (charIndex < fullText.length) {
        textEl.textContent += fullText[charIndex];
        charIndex++;
        this.typewriterTimer = setTimeout(typeNext, typeSpeed);
      }
    };
    typeNext();
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
    }
    clearTimeout(this.typewriterTimer);
  }
}

// Global instance
window.storyDialogue = new StoryDialogueManager();
