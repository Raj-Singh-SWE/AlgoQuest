/**
 * AlgoQuest Data Structure Visualizer
 * Animates Arrays, Stacks, Queues, Linked Lists, Trees, Grids, and DP Tables.
 * Supports step-by-step playback, play/pause, and speed control.
 */

class DSAVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentLevel = null;
    this.steps = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.playTimer = null;
    this.playbackSpeed = 800; // ms per step
  }

  setLevel(level) {
    this.currentLevel = level;
    this.stop();
    this.generateStepsForLevel(level);
    this.renderCurrentStep();
  }

  setSpeed(speedMs) {
    this.playbackSpeed = speedMs;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  generateStepsForLevel(level) {
    this.steps = [];
    this.currentStepIndex = 0;

    switch (level.visualizerType) {
      case 'array':
        this.generateArraySteps(level);
        break;
      case 'stack':
        this.generateStackSteps(level);
        break;
      case 'linked-list':
        this.generateLinkedListSteps(level);
        break;
      case 'tree':
        this.generateTreeSteps(level);
        break;
      case 'grid':
        this.generateGridSteps(level);
        break;
      case 'dp-table':
        this.generateDPSteps(level);
        break;
      default:
        this.generateArraySteps(level);
    }
  }

  // ==========================================
  // STEP GENERATORS
  // ==========================================

  generateArraySteps(level) {
    if (level.id === 'level-1') {
      // Reverse Array
      const arr = [1, 2, 3, 4, 5];
      let l = 0, r = arr.length - 1;
      const state = [...arr];

      this.steps.push({
        type: 'array',
        array: [...state],
        pointers: { left: l, right: r },
        message: 'Initial state: left=0, right=4',
        activeIndices: [l, r]
      });

      while (l < r) {
        this.steps.push({
          type: 'array',
          array: [...state],
          pointers: { left: l, right: r },
          message: `Swapping elements ${state[l]} and ${state[r]}`,
          highlightSwap: [l, r]
        });

        const temp = state[l];
        state[l] = state[r];
        state[r] = temp;

        l++;
        r--;

        this.steps.push({
          type: 'array',
          array: [...state],
          pointers: { left: l, right: r },
          message: `Swapped! Advancing left to ${l}, right to ${r}`,
          activeIndices: [l, r]
        });
      }

      this.steps.push({
        type: 'array',
        array: [...state],
        pointers: {},
        message: 'Pointers crossed! Array successfully reversed.',
        isFinished: true
      });
    } else if (level.id === 'level-2') {
      // Two Sum
      const nums = [2, 7, 11, 15];
      const target = 9;
      const seen = {};

      this.steps.push({
        type: 'two-sum',
        array: nums,
        seen: {},
        currentIdx: -1,
        message: `Target = ${target}. Hash map is currently empty.`
      });

      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const comp = target - num;

        this.steps.push({
          type: 'two-sum',
          array: nums,
          seen: { ...seen },
          currentIdx: i,
          complement: comp,
          message: `Index ${i} (val ${num}): Looking for complement ${target} - ${num} = ${comp}`
        });

        if (seen[comp] !== undefined) {
          this.steps.push({
            type: 'two-sum',
            array: nums,
            seen: { ...seen },
            currentIdx: i,
            foundPair: [seen[comp], i],
            message: `Found complement ${comp} at index ${seen[comp]}! Result: [${seen[comp]}, ${i}]`,
            isFinished: true
          });
          break;
        }
        seen[num] = i;
      }
    } else {
      // Generic Array steps
      const arr = level.visualizerConfig?.sampleData || [10, 20, 30, 40, 50];
      this.steps.push({
        type: 'array',
        array: arr,
        pointers: { i: 0 },
        message: 'Loaded sample data elements'
      });
      for (let i = 0; i < arr.length; i++) {
        this.steps.push({
          type: 'array',
          array: arr,
          pointers: { i },
          activeIndices: [i],
          message: `Scanning element at index ${i} = ${arr[i]}`
        });
      }
      this.steps.push({
        type: 'array',
        array: arr,
        pointers: {},
        message: 'Traversal complete.',
        isFinished: true
      });
    }
  }

  generateStackSteps(level) {
    if (level.id === 'level-5') {
      // Valid Parentheses
      const str = '()[]{}';
      const stack = [];
      const pair = { ')': '(', '}': '{', ']': '[' };

      this.steps.push({
        type: 'stack',
        stack: [],
        chars: str.split(''),
        currentIdx: -1,
        message: 'Input string: "()[]{}". Stack initialized empty.'
      });

      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (pair[char]) {
          const top = stack.pop();
          this.steps.push({
            type: 'stack',
            stack: [...stack],
            chars: str.split(''),
            currentIdx: i,
            message: `Closing '${char}' matched top '${top}'. Popped from stack!`,
            highlightAction: 'pop'
          });
        } else {
          stack.push(char);
          this.steps.push({
            type: 'stack',
            stack: [...stack],
            chars: str.split(''),
            currentIdx: i,
            message: `Opening '${char}' encountered. Pushed to stack!`,
            highlightAction: 'push'
          });
        }
      }

      this.steps.push({
        type: 'stack',
        stack: [],
        chars: str.split(''),
        currentIdx: str.length,
        message: 'String exhausted & Stack empty -> Valid parentheses!',
        isFinished: true
      });
    } else {
      // Generic Stack
      this.steps = [
        { type: 'stack', stack: [], message: 'Stack initialized' },
        { type: 'stack', stack: [10], message: 'Push 10', highlightAction: 'push' },
        { type: 'stack', stack: [10, 20], message: 'Push 20', highlightAction: 'push' },
        { type: 'stack', stack: [10, 20, 30], message: 'Push 30', highlightAction: 'push' },
        { type: 'stack', stack: [10, 20], message: 'Pop 30', highlightAction: 'pop' },
        { type: 'stack', stack: [10], message: 'Pop 20', highlightAction: 'pop' },
        { type: 'stack', stack: [], message: 'Pop 10 (Stack Empty)', highlightAction: 'pop', isFinished: true }
      ];
    }
  }

  generateLinkedListSteps(level) {
    const raw = [1, 2, 3, 4, 5];
    this.steps.push({
      type: 'linked-list',
      nodes: raw,
      pointers: { head: 0, curr: 0 },
      reversedCount: 0,
      message: 'Original list: 1 -> 2 -> 3 -> 4 -> 5 -> None'
    });

    for (let i = 1; i <= raw.length; i++) {
      this.steps.push({
        type: 'linked-list',
        nodes: raw,
        pointers: { prev: i - 1, curr: i < raw.length ? i : null },
        reversedCount: i,
        message: `Inverting link pointer at node ${raw[i - 1]}!`
      });
    }

    this.steps.push({
      type: 'linked-list',
      nodes: [...raw].reverse(),
      pointers: { head: 0 },
      reversedCount: raw.length,
      message: 'Reversed list complete: 5 -> 4 -> 3 -> 2 -> 1 -> None',
      isFinished: true
    });
  }

  generateTreeSteps(level) {
    const tree = {
      val: 4,
      left: { val: 2, left: { val: 1 }, right: { val: 3 } },
      right: { val: 7, left: { val: 6 }, right: { val: 9 } }
    };

    this.steps.push({
      type: 'tree',
      tree,
      activeNode: 4,
      message: 'Root node 4: Initiating tree traversal'
    });

    const sequence = [2, 1, 3, 7, 6, 9];
    sequence.forEach(val => {
      this.steps.push({
        type: 'tree',
        tree,
        activeNode: val,
        message: `Visiting node ${val}`
      });
    });

    this.steps.push({
      type: 'tree',
      tree,
      activeNode: null,
      message: 'Tree operation complete!',
      isFinished: true
    });
  }

  generateGridSteps(level) {
    const initialGrid = [
      ['1', '1', '0'],
      ['0', '1', '0'],
      ['0', '0', '1']
    ];

    this.steps.push({
      type: 'grid',
      grid: initialGrid.map(r => [...r]),
      activeCell: null,
      message: 'Initial Island Map (1 = Land, 0 = Water)'
    });

    this.steps.push({
      type: 'grid',
      grid: [
        ['✓', '1', '0'],
        ['0', '1', '0'],
        ['0', '0', '1']
      ],
      activeCell: [0, 0],
      message: 'Island 1 found! Visiting cell (0, 0)'
    });

    this.steps.push({
      type: 'grid',
      grid: [
        ['✓', '✓', '0'],
        ['0', '1', '0'],
        ['0', '0', '1']
      ],
      activeCell: [0, 1],
      message: 'DFS expanding to connected land (0, 1)'
    });

    this.steps.push({
      type: 'grid',
      grid: [
        ['✓', '✓', '0'],
        ['0', '✓', '0'],
        ['0', '0', '1']
      ],
      activeCell: [1, 1],
      message: 'DFS sinking land (1, 1). Island 1 fully mapped!'
    });

    this.steps.push({
      type: 'grid',
      grid: [
        ['✓', '✓', '0'],
        ['0', '✓', '0'],
        ['0', '0', '✓']
      ],
      activeCell: [2, 2],
      message: 'Island 2 found at (2, 2)! Total Islands: 2',
      isFinished: true
    });
  }

  generateDPSteps(level) {
    const dp = [1, 2, 3, 5, 8];
    this.steps.push({
      type: 'dp',
      table: [1, 2, 0, 0, 0],
      activeIdx: 1,
      message: 'Base cases initialized: dp[1]=1, dp[2]=2'
    });

    for (let i = 2; i < dp.length; i++) {
      const partial = [1, 2, 0, 0, 0];
      for (let j = 0; j <= i; j++) partial[j] = dp[j];

      this.steps.push({
        type: 'dp',
        table: partial,
        activeIdx: i,
        message: `dp[${i + 1}] = dp[${i}] + dp[${i - 1}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
      });
    }

    this.steps.push({
      type: 'dp',
      table: dp,
      activeIdx: dp.length - 1,
      message: `Final result computed: ${dp[dp.length - 1]} ways!`,
      isFinished: true
    });
  }

  // ==========================================
  // PLAYBACK CONTROLS
  // ==========================================

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.updatePlayPauseBtn();

    this.playTimer = setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.next();
      } else {
        this.pause();
      }
    }, this.playbackSpeed);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.playTimer);
    this.playTimer = null;
    this.updatePlayPauseBtn();
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
      window.soundSystem?.playClick();
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
      window.soundSystem?.playClick();
    }
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.renderCurrentStep();
  }

  stop() {
    this.pause();
    this.currentStepIndex = 0;
  }

  updatePlayPauseBtn() {
    const btn = document.getElementById('vizPlayBtn');
    if (btn) {
      btn.innerHTML = this.isPlaying ? '⏸ Pause' : '▶ Play';
    }
  }

  // ==========================================
  // RENDERING
  // ==========================================

  renderCurrentStep() {
    if (!this.container || !this.steps.length) return;
    const step = this.steps[this.currentStepIndex];

    let contentHtml = '';
    switch (step.type) {
      case 'array':
        contentHtml = this.renderArrayStep(step);
        break;
      case 'two-sum':
        contentHtml = this.renderTwoSumStep(step);
        break;
      case 'stack':
        contentHtml = this.renderStackStep(step);
        break;
      case 'linked-list':
        contentHtml = this.renderLinkedListStep(step);
        break;
      case 'tree':
        contentHtml = this.renderTreeStep(step);
        break;
      case 'grid':
        contentHtml = this.renderGridStep(step);
        break;
      case 'dp':
        contentHtml = this.renderDPStep(step);
        break;
      default:
        contentHtml = `<div class="viz-empty">No visualizer state</div>`;
    }

    this.container.innerHTML = `
      <div class="viz-stage">
        ${contentHtml}
      </div>
      <div class="viz-info-bar">
        <div class="viz-step-counter">Step ${this.currentStepIndex + 1} of ${this.steps.length}</div>
        <div class="viz-step-message">${step.message || ''}</div>
      </div>
    `;
  }

  renderArrayStep(step) {
    return `
      <div class="array-container">
        ${step.array.map((val, idx) => {
          const isSwap = step.highlightSwap && step.highlightSwap.includes(idx);
          const isActive = step.activeIndices && step.activeIndices.includes(idx);
          const pointerLabels = [];
          if (step.pointers) {
            for (const [name, ptrIdx] of Object.entries(step.pointers)) {
              if (ptrIdx === idx) pointerLabels.push(name);
            }
          }

          return `
            <div class="array-cell-wrapper">
              <div class="pointer-tags">
                ${pointerLabels.map(p => `<span class="ptr-tag ptr-${p}">${p}</span>`).join('')}
              </div>
              <div class="array-cell ${isSwap ? 'swap-pulse' : ''} ${isActive ? 'active-cell' : ''}">
                ${val}
              </div>
              <div class="array-index">${idx}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderTwoSumStep(step) {
    return `
      <div class="two-sum-view">
        <div class="array-container">
          ${step.array.map((val, idx) => {
            const isCurr = step.currentIdx === idx;
            const isFound = step.foundPair && step.foundPair.includes(idx);
            return `
              <div class="array-cell-wrapper">
                <div class="array-cell ${isFound ? 'target-found' : isCurr ? 'active-cell' : ''}">
                  ${val}
                </div>
                <div class="array-index">${idx}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="hash-map-display">
          <div class="hash-map-title">📖 Hash Map (seen values &rarr; index):</div>
          <div class="hash-map-entries">
            ${Object.keys(step.seen).length === 0
              ? '<span class="empty-map">Empty {}</span>'
              : Object.entries(step.seen).map(([k, v]) => `
                <div class="hash-badge">
                  <span class="hash-key">${k}</span> : <span class="hash-val">${v}</span>
                </div>
              `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderStackStep(step) {
    return `
      <div class="stack-view">
        <div class="stack-chamber">
          <div class="stack-top-label">&darr; TOP</div>
          <div class="stack-elements">
            ${step.stack.length === 0
              ? '<div class="stack-empty-placeholder">Stack is Empty</div>'
              : step.stack.slice().reverse().map((item, idx) => `
                <div class="stack-item ${idx === 0 ? 'top-item' : ''}">
                  ${item}
                </div>
              `).join('')}
          </div>
          <div class="stack-base-label">BOTTOM</div>
        </div>
        ${step.chars ? `
          <div class="stack-input-stream">
            <div class="stream-title">Input Characters:</div>
            <div class="stream-chars">
              ${step.chars.map((c, i) => `
                <span class="stream-char ${i === step.currentIdx ? 'current-char' : i < step.currentIdx ? 'done-char' : ''}">${c}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderLinkedListStep(step) {
    return `
      <div class="linked-list-view">
        <div class="ll-nodes">
          ${step.nodes.map((val, idx) => {
            const isPrev = step.pointers && step.pointers.prev === idx;
            const isCurr = step.pointers && step.pointers.curr === idx;
            const isReversed = idx < step.reversedCount;

            return `
              <div class="ll-node-wrapper">
                <div class="ll-pointers">
                  ${isPrev ? '<span class="ptr-tag ptr-prev">prev</span>' : ''}
                  ${isCurr ? '<span class="ptr-tag ptr-curr">curr</span>' : ''}
                </div>
                <div class="ll-node ${isReversed ? 'node-reversed' : ''}">
                  <span class="ll-val">${val}</span>
                  <span class="ll-link">&bull;</span>
                </div>
                ${idx < step.nodes.length - 1 ? `
                  <div class="ll-arrow ${isReversed ? 'arrow-reversed' : ''}">
                    ${isReversed ? '&larr;' : '&rarr;'}
                  </div>
                ` : '<div class="ll-null">None</div>'}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderTreeStep(step) {
    return `
      <div class="tree-view">
        <svg class="tree-svg" viewBox="0 0 400 220">
          <!-- Connectors -->
          <line x1="200" y1="35" x2="100" y2="95" stroke="var(--border-subtle)" stroke-width="2" />
          <line x1="200" y1="35" x2="300" y2="95" stroke="var(--border-subtle)" stroke-width="2" />
          <line x1="100" y1="95" x2="55" y2="165" stroke="var(--border-subtle)" stroke-width="2" />
          <line x1="100" y1="95" x2="145" y2="165" stroke="var(--border-subtle)" stroke-width="2" />
          <line x1="300" y1="95" x2="255" y2="165" stroke="var(--border-subtle)" stroke-width="2" />
          <line x1="300" y1="95" x2="345" y2="165" stroke="var(--border-subtle)" stroke-width="2" />

          <!-- Root -->
          <circle cx="200" cy="35" r="20" class="tree-node-circle ${step.activeNode === 4 ? 'active-tree-node' : ''}" />
          <text x="200" y="41" text-anchor="middle" class="tree-text">4</text>

          <!-- Level 1 -->
          <circle cx="100" cy="95" r="18" class="tree-node-circle ${step.activeNode === 2 ? 'active-tree-node' : ''}" />
          <text x="100" y="101" text-anchor="middle" class="tree-text">2</text>

          <circle cx="300" cy="95" r="18" class="tree-node-circle ${step.activeNode === 7 ? 'active-tree-node' : ''}" />
          <text x="300" y="101" text-anchor="middle" class="tree-text">7</text>

          <!-- Level 2 Leaves -->
          <circle cx="55" cy="165" r="16" class="tree-node-circle ${step.activeNode === 1 ? 'active-tree-node' : ''}" />
          <text x="55" y="171" text-anchor="middle" class="tree-text">1</text>

          <circle cx="145" cy="165" r="16" class="tree-node-circle ${step.activeNode === 3 ? 'active-tree-node' : ''}" />
          <text x="145" y="171" text-anchor="middle" class="tree-text">3</text>

          <circle cx="255" cy="165" r="16" class="tree-node-circle ${step.activeNode === 6 ? 'active-tree-node' : ''}" />
          <text x="255" y="171" text-anchor="middle" class="tree-text">6</text>

          <circle cx="345" cy="165" r="16" class="tree-node-circle ${step.activeNode === 9 ? 'active-tree-node' : ''}" />
          <text x="345" y="171" text-anchor="middle" class="tree-text">9</text>
        </svg>
      </div>
    `;
  }

  renderGridStep(step) {
    return `
      <div class="grid-view">
        <div class="grid-board">
          ${step.grid.map((row, r) => `
            <div class="grid-row">
              ${row.map((cell, c) => {
                const isActive = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
                const isVisited = cell === '✓';
                const isLand = cell === '1';
                return `
                  <div class="grid-cell ${isVisited ? 'visited-land' : isLand ? 'land-cell' : 'water-cell'} ${isActive ? 'active-cell-pulse' : ''}">
                    ${cell}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderDPStep(step) {
    return `
      <div class="dp-view">
        <div class="dp-label">DP Table / Memoization Cache:</div>
        <div class="dp-cells">
          ${step.table.map((val, idx) => `
            <div class="dp-cell-wrapper">
              <div class="dp-cell ${step.activeIdx === idx ? 'active-dp-cell' : ''}">
                ${val}
              </div>
              <div class="dp-sub">dp[${idx + 1}]</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.DSAVisualizer = DSAVisualizer;
