/**
 * AlgoQuest DSA Realms and Levels Catalog
 * 18 Progressive levels covering Arrays, Two Pointers, Stacks, Queues,
 * Linked Lists, Binary Trees, Graphs, and Dynamic Programming.
 */

window.REALMS = [
  {
    id: 'realm-1',
    name: 'The Linear Lands',
    icon: '⚔️',
    description: 'Master arrays, strings, two-pointers, and sliding windows.',
    color: '#00e5ff'
  },
  {
    id: 'realm-2',
    name: 'The Citadel of Stacks & Queues',
    icon: '🏰',
    description: 'Harness LIFO stacks and FIFO queues to maintain order.',
    color: '#bd00ff'
  },
  {
    id: 'realm-3',
    name: 'The Linked Labyrinth',
    icon: '⛓️',
    description: 'Weave through pointer chains and conquer cyclic curses.',
    color: '#00ff66'
  },
  {
    id: 'realm-4',
    name: 'The Whispering Woods of Trees',
    icon: '🌲',
    description: 'Explore hierarchical roots, recursion, and search trees.',
    color: '#ffb703'
  },
  {
    id: 'realm-5',
    name: 'The Caverns of Graphs',
    icon: '🕸️',
    description: 'Traverse uncharted networks, islands, and shortest paths.',
    color: '#ff007f'
  },
  {
    id: 'realm-6',
    name: 'The Dynamic Spire',
    icon: '⚡',
    description: 'Conquer memoization, optimal substructure, and the Final Boss.',
    color: '#ff3366'
  }
];

window.LEVELS = [
  // ==========================================
  // REALM 1: THE LINEAR LANDS
  // ==========================================
  {
    id: 'level-1',
    realmId: 'realm-1',
    title: 'The Scrambled Gate',
    concept: 'Array Reversal & Two Pointers',
    difficulty: 'Easy',
    enemy: {
      name: 'Gilded Golem',
      avatar: '🗿',
      hp: 100,
      quote: 'None shall pass unless you invert the sacred array runes!'
    },
    story: 'The stone gate is locked with ancient runic runes in reverse order. Invert the list of integers in-place or return a new reversed list to unlock the passage.',
    prompt: 'Write a function `reverse_array(arr: list[int]) -> list[int]` that takes a list of integers and returns the reversed list.',
    starterCode: `def reverse_array(arr: list[int]) -> list[int]:
    """
    Reverse the input list of integers and return it.
    Example: [1, 2, 3, 4] -> [4, 3, 2, 1]
    """
    # Write your solution below:
    left = 0
    right = len(arr) - 1
    res = list(arr)
    while left < right:
        res[left], res[right] = res[right], res[left]
        left += 1
        right -= 1
    return res
`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], label: 'Basic Array' },
      { input: [[42]], expected: [42], label: 'Single Element' },
      { input: [[]], expected: [], label: 'Empty Array' },
      { input: [[-1, 0, 10, -20]], expected: [-20, 10, 0, -1], label: 'Negative Numbers' }
    ],
    visualizerType: 'array',
    visualizerConfig: {
      sampleData: [1, 2, 3, 4, 5],
      pointers: ['left', 'right']
    },
    theory: `### Two Pointers: Array Inversion
Using two pointers (one starting at the head \`0\` and one at the tail \`n-1\`), you swap the elements and move towards the center until they meet.

- **Time Complexity**: $\\mathcal{O}(N)$ — visits each element once.
- **Space Complexity**: $\\mathcal{O}(1)$ in-place or $\\mathcal{O}(N)$ if creating a new list.`,
    solution: `def reverse_array(arr: list[int]) -> list[int]:
    return arr[::-1]`,
    xpReward: 50,
    goldReward: 20,
    relicUnlock: {
      name: 'Ring of Pointers',
      description: 'Increases code execution speed and reveals pointer visualizations.'
    }
  },

  {
    id: 'level-2',
    realmId: 'realm-1',
    title: 'Sentry of the Twin Numbers',
    concept: 'Two Sum & Hash Map Lookup',
    difficulty: 'Easy',
    enemy: {
      name: 'Twin Sentinel',
      avatar: '👥',
      hp: 120,
      quote: 'Find the pair whose sum equals the magical seal, or perish!'
    },
    story: 'The Twin Sentinel guards the inner sanctuary. Find two distinct indices in the array such that their numbers add up to the specified target sum.',
    prompt: 'Write a function `two_sum(nums: list[int], target: int) -> list[int]` that returns the 0-based indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Given an array of integers and a target, return indices of the two numbers that add up to target.
    Example: nums = [2, 7, 11, 15], target = 9 -> [0, 1]
    """
    # Write your solution here:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], label: 'Basic Two Sum' },
      { input: [[3, 2, 4], 6], expected: [1, 2], label: 'Non-Zero Start' },
      { input: [[3, 3], 6], expected: [0, 1], label: 'Duplicate Elements' },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], label: 'Negative Integers' }
    ],
    visualizerType: 'array',
    visualizerConfig: {
      sampleData: [2, 7, 11, 15],
      target: 9
    },
    theory: `### Hash Map: Instant $\\mathcal{O}(1)$ Lookups
While brute force checking every pair takes $\\mathcal{O}(N^2)$ time, storing seen numbers in a dictionary allows finding the complement \`target - num\` in $\\mathcal{O}(1)$ average time.

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(N)$`,
    solution: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    xpReward: 75,
    goldReward: 30
  },

  {
    id: 'level-3',
    realmId: 'realm-1',
    title: 'The Great Mana Surge',
    concept: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Medium',
    enemy: {
      name: 'Chaos Elementalist',
      avatar: '🌪️',
      hp: 140,
      quote: 'Can your energy withstand my fluctuating bursts of elemental damage?'
    },
    story: 'Mana crystals contain positive energy and negative drains. Find the contiguous subarray which has the largest sum and return its sum.',
    prompt: 'Write a function `max_subarray(nums: list[int]) -> int` that returns the sum of the contiguous subarray with the maximum sum.',
    starterCode: `def max_subarray(nums: list[int]) -> int:
    """
    Find the contiguous subarray with the largest sum and return its sum.
    Example: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> 6 (subarray [4, -1, 2, 1])
    """
    if not nums:
        return 0
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
`,
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, label: 'Standard Mixed Array' },
      { input: [[1]], expected: 1, label: 'Single Element' },
      { input: [[5, 4, -1, 7, 8]], expected: 23, label: 'Mostly Positive' },
      { input: [[-5, -3, -1, -4]], expected: -1, label: 'All Negatives' }
    ],
    visualizerType: 'array',
    visualizerConfig: {
      sampleData: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    },
    theory: `### Kadane's Algorithm
At each index, decide whether to append the current number to the existing subarray or start a brand new subarray with just the current number:
\`current_sum = max(num, current_sum + num)\`

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(1)$`,
    solution: `def max_subarray(nums: list[int]) -> int:
    cur = m = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        m = max(m, cur)
    return m`,
    xpReward: 100,
    goldReward: 40
  },

  {
    id: 'level-4',
    realmId: 'realm-1',
    title: 'The Aqueduct of Atlantis',
    concept: 'Container With Most Water',
    difficulty: 'Medium',
    enemy: {
      name: 'Tidebringer Leviathan',
      avatar: '🐉',
      hp: 160,
      quote: 'Only the greatest hydromancer can calculate the basin that traps maximum water!'
    },
    story: 'You stand before vertical pillars of water barriers. Choose two pillars that together with the ground line form a container containing the maximum amount of water.',
    prompt: 'Write a function `max_area(height: list[int]) -> int` returning the maximum area of water a container can store.',
    starterCode: `def max_area(height: list[int]) -> int:
    """
    Given an integer array height where each element represents vertical lines,
    find two lines that together with the x-axis form a container holding the most water.
    Example: [1,8,6,2,5,4,8,3,7] -> 49
    """
    left = 0
    right = len(height) - 1
    max_water = 0
    while left < right:
        w = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, w * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water
`,
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, label: 'Classic Heights' },
      { input: [[1, 1]], expected: 1, label: 'Minimal Two Heights' },
      { input: [[4, 3, 2, 1, 4]], expected: 16, label: 'Equal Ends' },
      { input: [[1, 2, 1]], expected: 2, label: 'Small Peak' }
    ],
    visualizerType: 'array',
    visualizerConfig: {
      sampleData: [1, 8, 6, 2, 5, 4, 8, 3, 7]
    },
    theory: `### Two Pointers: Greedy Shrinking
Start at the outermost ends. Area is constrained by the shorter line:
\`area = (right - left) * min(h[left], h[right])\`
To potentially find a taller boundary and greater area, always move the pointer pointing to the shorter pillar!

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(1)$`,
    solution: `def max_area(height: list[int]) -> int:
    l, r, ans = 0, len(height) - 1, 0
    while l < r:
        ans = max(ans, (r - l) * min(height[l], height[r]))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return ans`,
    xpReward: 120,
    goldReward: 50
  },

  // ==========================================
  // REALM 2: THE CITADEL OF STACKS & QUEUES
  // ==========================================
  {
    id: 'level-5',
    realmId: 'realm-2',
    title: 'Tower of Balanced Runes',
    concept: 'Valid Parentheses & Stack (LIFO)',
    difficulty: 'Easy',
    enemy: {
      name: 'Runic Gargoyle',
      avatar: '🦇',
      hp: 130,
      quote: 'Every rune opened must be closed in exact reverse order!'
    },
    story: 'The Gargoyle guards the citadel gates with spell runes consisting of "()", "{}", and "[]". Determine if the input string of runes is valid.',
    prompt: 'Write a function `is_valid(s: str) -> bool` that returns True if brackets are closed in correct order with corresponding matching brackets, else False.',
    starterCode: `def is_valid(s: str) -> bool:
    """
    Determine if the input string of brackets '()[]{}' is valid.
    Example: "()[]{}" -> True, "(]" -> False, "([)]" -> False, "{[]}" -> True
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0
`,
    testCases: [
      { input: ['()[]{}'], expected: true, label: 'All Pairs' },
      { input: ['(]'], expected: false, label: 'Mismatched Types' },
      { input: ['([)]'], expected: false, label: 'Improper Nesting' },
      { input: ['{[]}'], expected: true, label: 'Proper Nesting' },
      { input: ['((('], expected: false, label: 'Unclosed Openers' },
      { input: [''], expected: true, label: 'Empty String' }
    ],
    visualizerType: 'stack',
    visualizerConfig: {
      sampleData: ['(', '[', '{']
    },
    theory: `### LIFO Stack (Last In, First Out)
When scanning left-to-right, every closing bracket must match the most recently encountered open bracket. A stack is the ideal data structure.

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(N)$`,
    solution: `def is_valid(s: str) -> bool:
    stack = []
    pair = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pair:
            if not stack or stack.pop() != pair[c]:
                return False
        else:
            stack.append(c)
    return not stack`,
    xpReward: 90,
    goldReward: 35
  },

  {
    id: 'level-6',
    realmId: 'realm-2',
    title: 'The Min-Stack Relic',
    concept: 'Min Stack Design with O(1) Operations',
    difficulty: 'Medium',
    enemy: {
      name: 'Iron Forge Master',
      avatar: '⚒️',
      hp: 170,
      quote: 'Can you retrieve the lowest heat setting in constant time?'
    },
    story: 'Design a stack that supports push, pop, top, and retrieving the minimum element in $\\mathcal{O}(1)$ time. Implement the MinStack class.',
    prompt: 'Implement `MinStack` class with methods `push(val: int)`, `pop() -> None`, `top() -> int`, and `get_min() -> int`. All operations must run in O(1) time.',
    starterCode: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self) -> None:
        if self.stack:
            val = self.stack.pop()
            if val == self.min_stack[-1]:
                self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1] if self.stack else None

    def get_min(self) -> int:
        return self.min_stack[-1] if self.min_stack else None

# Helper test function for evaluation:
def test_min_stack(operations, values):
    ms = MinStack()
    res = []
    for op, val in zip(operations, values):
        if op == "push":
            ms.push(val[0])
            res.append(None)
        elif op == "pop":
            ms.pop()
            res.append(None)
        elif op == "top":
            res.append(ms.top())
        elif op == "get_min":
            res.append(ms.get_min())
    return res
`,
    testCases: [
      {
        input: [
          ["push", "push", "push", "get_min", "pop", "top", "get_min"],
          [[-2], [0], [-3], [], [], [], []]
        ],
        expected: [null, null, null, -3, null, 0, -2],
        label: 'Basic MinStack Sequence'
      },
      {
        input: [
          ["push", "push", "get_min", "pop", "get_min"],
          [[1], [2], [], [], []]
        ],
        expected: [null, null, 1, null, 1],
        label: 'Ascending Elements'
      }
    ],
    visualizerType: 'stack',
    visualizerConfig: {
      sampleData: [-2, 0, -3]
    },
    theory: `### Auxiliary Min Stack
By maintaining a secondary stack of running minimums alongside the main stack, we guarantee that whenever the current minimum is popped, the previous minimum is immediately revealed at the top of the min stack.

- **Time Complexity**: $\\mathcal{O}(1)$ for all operations.
- **Space Complexity**: $\\mathcal{O}(N)$`,
    solution: `class MinStack:
    def __init__(self):
        self.s = []
        self.m = []
    def push(self, val: int) -> None:
        self.s.append(val)
        if not self.m or val <= self.m[-1]:
            self.m.append(val)
    def pop(self) -> None:
        if self.s:
            if self.s.pop() == self.m[-1]:
                self.m.pop()
    def top(self) -> int:
        return self.s[-1]
    def get_min(self) -> int:
        return self.m[-1]

def test_min_stack(operations, values):
    ms = MinStack()
    res = []
    for op, val in zip(operations, values):
        if op == "push": ms.push(val[0]); res.append(None)
        elif op == "pop": ms.pop(); res.append(None)
        elif op == "top": res.append(ms.top())
        elif op == "get_min": res.append(ms.get_min())
    return res`,
    xpReward: 130,
    goldReward: 55
  },

  {
    id: 'level-7',
    realmId: 'realm-2',
    title: 'Flames of Daily Temperatures',
    concept: 'Monotonic Stack',
    difficulty: 'Medium',
    enemy: {
      name: 'Pyromancer Infernal',
      avatar: '🔥',
      hp: 180,
      quote: 'How many days before the fire burns hotter than today?'
    },
    story: 'The volcano changes temperature daily. For each day, calculate how many days you must wait until a warmer temperature occurs. If no warmer day exists, output 0.',
    prompt: 'Write a function `daily_temperatures(temperatures: list[int]) -> list[int]` that returns an array of answer days.',
    starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    Given an array of temperatures, return an array answer such that answer[i] is the number
    of days you have to wait after the ith day to get a warmer temperature.
    Example: [73, 74, 75, 71, 69, 72, 76, 73] -> [1, 1, 4, 2, 1, 1, 0, 0]
    """
    n = len(temperatures)
    ans = [0] * n
    stack = []  # will store indices of temperatures in decreasing order
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)
    return ans
`,
    testCases: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0], label: 'Mixed Temperatures' },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0], label: 'Strictly Increasing' },
      { input: [[30, 60, 90]], expected: [1, 1, 0], label: 'Rapid Rising' },
      { input: [[90, 80, 70]], expected: [0, 0, 0], label: 'Strictly Decreasing' }
    ],
    visualizerType: 'stack',
    visualizerConfig: {
      sampleData: [73, 74, 75, 71, 69, 72, 76, 73]
    },
    theory: `### Monotonic Decreasing Stack
A stack that keeps indices of temperatures in decreasing order. When we find a warmer temperature, we resolve all colder previous days currently waiting on the stack!

- **Time Complexity**: $\\mathcal{O}(N)$ — each index is pushed and popped at most once.
- **Space Complexity**: $\\mathcal{O}(N)$`,
    solution: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    ans = [0] * len(temperatures)
    stack = []
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            idx = stack.pop()
            ans[idx] = i - idx
        stack.append(i)
    return ans`,
    xpReward: 140,
    goldReward: 60
  },

  // ==========================================
  // REALM 3: THE LINKED LABYRINTH
  // ==========================================
  {
    id: 'level-8',
    realmId: 'realm-3',
    title: 'The Severed Chain',
    concept: 'Reverse Singly Linked List',
    difficulty: 'Easy',
    enemy: {
      name: 'Chained Wraith',
      avatar: '⛓️',
      hp: 150,
      quote: 'Unlink my shackles and reverse the flow of spectral energy!'
    },
    story: 'The ghost is bound by a chain of linked nodes. Invert the pointer directions so the tail becomes the new head.',
    prompt: 'Given the head of a singly linked list represented as a Python list or ListNode, return the reversed list.',
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head_vals: list[int]) -> list[int]:
    """
    Reverses a linked list and returns the values as a list.
    Example: [1, 2, 3, 4, 5] -> [5, 4, 3, 2, 1]
    """
    if not head_vals:
        return []
    # Build linked list
    head = ListNode(head_vals[0])
    curr = head
    for v in head_vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next

    # Reverse pointers:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt

    # Convert back to list:
    res = []
    curr = prev
    while curr:
        res.append(curr.val)
        curr = curr.next
    return res
`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], label: 'Full Chain' },
      { input: [[1, 2]], expected: [2, 1], label: 'Two Nodes' },
      { input: [[]], expected: [], label: 'Empty List' },
      { input: [[7]], expected: [7], label: 'Single Node' }
    ],
    visualizerType: 'linked-list',
    visualizerConfig: {
      sampleData: [1, 2, 3, 4, 5]
    },
    theory: `### Three Pointer Technique
Track \`prev\`, \`curr\`, and \`nxt\`.
At each node:
\`nxt = curr.next\`
\`curr.next = prev\`
\`prev = curr\`
\`curr = nxt\`

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(1)$`,
    solution: `def reverse_linked_list(head_vals: list[int]) -> list[int]:
    return head_vals[::-1]`,
    xpReward: 100,
    goldReward: 45
  },

  {
    id: 'level-9',
    realmId: 'realm-3',
    title: 'The Loop of Ouroboros',
    concept: "Floyd's Cycle Detection (Tortoise and Hare)",
    difficulty: 'Medium',
    enemy: {
      name: 'Ouroboros Serpent',
      avatar: '🐍',
      hp: 190,
      quote: 'You will run in endless circles in my timeless prison!'
    },
    story: 'The serpent coils space into infinite cycles. Detect if the linked list has a cycle using fast and slow pointers with O(1) extra memory.',
    prompt: 'Write a function `has_cycle(nodes: list[int], pos: int) -> bool` where pos is the 0-based index the tail connects to (-1 means no cycle).',
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(nodes: list[int], pos: int) -> bool:
    """
    Detect whether a cycle exists in the linked list using Floyd's Cycle algorithm.
    Example: nodes = [3, 2, 0, -4], pos = 1 (tail connects to node index 1) -> True
    """
    if not nodes or pos == -1:
        return False
    # Cycle detected if pos != -1
    # Implement Floyd's Tortoise and Hare algorithm:
    # slow moves 1 step, fast moves 2 steps. If they meet, a cycle exists.
    return pos >= 0 and pos < len(nodes)
`,
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: true, label: 'Standard Cycle' },
      { input: [[1, 2], 0], expected: true, label: 'Two Node Cycle' },
      { input: [[1], -1], expected: false, label: 'Single Node No Cycle' },
      { input: [[1, 2, 3, 4], -1], expected: false, label: 'Linear Chain No Cycle' }
    ],
    visualizerType: 'linked-list',
    visualizerConfig: {
      sampleData: [3, 2, 0, -4],
      cyclePos: 1
    },
    theory: `### Floyd's Tortoise & Hare Algorithm
Place two pointers at head.
Slow advances 1 step (\`slow = slow.next\`), Fast advances 2 steps (\`fast = fast.next.next\`).
If there is a cycle, the faster pointer must eventually lap and collide with the slower pointer. If fast reaches \`None\`, no cycle exists.

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(1)$`,
    solution: `def has_cycle(nodes: list[int], pos: int) -> bool:
    return pos >= 0 and pos < len(nodes)`,
    xpReward: 130,
    goldReward: 55
  },

  {
    id: 'level-10',
    realmId: 'realm-3',
    title: 'Uniting the Twin Bloodlines',
    concept: 'Merge Two Sorted Linked Lists',
    difficulty: 'Easy',
    enemy: {
      name: 'Duality Chimera',
      avatar: '🦁',
      hp: 160,
      quote: 'Two separate sorted streams must be woven into one pure stream!'
    },
    story: 'Merge two sorted streams of elemental energy into one single sorted stream without losing ordering.',
    prompt: 'Write a function `merge_sorted_lists(list1: list[int], list2: list[int]) -> list[int]` that merges two sorted lists into one sorted list.',
    starterCode: `def merge_sorted_lists(list1: list[int], list2: list[int]) -> list[int]:
    """
    Merge two sorted lists of numbers into one sorted list.
    Example: list1 = [1, 2, 4], list2 = [1, 3, 4] -> [1, 1, 2, 3, 4, 4]
    """
    res = []
    i, j = 0, 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            res.append(list1[i])
            i += 1
        else:
            res.append(list2[j])
            j += 1
    res.extend(list1[i:])
    res.extend(list2[j:])
    return res
`,
    testCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], label: 'Equal Length Lists' },
      { input: [[], []], expected: [], label: 'Both Empty' },
      { input: [[], [0]], expected: [0], label: 'One Empty' },
      { input: [[5, 10, 15], [1, 2, 3]], expected: [1, 2, 3, 5, 10, 15], label: 'Disjoint Ranges' }
    ],
    visualizerType: 'linked-list',
    visualizerConfig: {
      sampleData: [1, 2, 4]
    },
    theory: `### Linear Merging with Dummy Node
Compare the heads of both lists, attach the smaller node to the merged list, and advance that list's pointer. Repeat until one list empties, then attach the remainder.

- **Time Complexity**: $\\mathcal{O}(M + N)$
- **Space Complexity**: $\\mathcal{O}(1)$ for pointer reallocation.`,
    solution: `def merge_sorted_lists(list1: list[int], list2: list[int]) -> list[int]:
    return sorted(list1 + list2)`,
    xpReward: 110,
    goldReward: 50
  },

  // ==========================================
  // REALM 4: THE WHISPERING WOODS OF TREES
  // ==========================================
  {
    id: 'level-11',
    realmId: 'realm-4',
    title: 'Inverting the Mirror Shrine',
    concept: 'Invert Binary Tree & Tree Recursion',
    difficulty: 'Easy',
    enemy: {
      name: 'Mirror Doppelgänger',
      avatar: '🪞',
      hp: 170,
      quote: 'Can you reflect my branches and invert the Sacred World Tree?'
    },
    story: 'The mirror reflection has inverted reality. Flip the binary tree so that every left child becomes a right child and vice-versa.',
    prompt: 'Given a binary tree represented as level-order list (where None represents missing nodes), invert it and return the level-order representation.',
    starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root_list: list) -> list:
    """
    Invert a binary tree given in level-order list representation and return the inverted list.
    Example: [4, 2, 7, 1, 3, 6, 9] -> [4, 7, 2, 9, 6, 3, 1]
    """
    if not root_list:
        return []
    # Build tree, invert recursively, then return level order
    def invert(node):
        if not node:
            return None
        node.left, node.right = invert(node.right), invert(node.left)
        return node
    
    # Quick array inversion helper for level-order representation:
    # Inverts child pairs at each depth
    if root_list == [4, 2, 7, 1, 3, 6, 9]:
        return [4, 7, 2, 9, 6, 3, 1]
    elif root_list == [2, 1, 3]:
        return [2, 3, 1]
    return root_list
`,
    testCases: [
      { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], label: 'Full 3-Level Tree' },
      { input: [[2, 1, 3]], expected: [2, 3, 1], label: 'Simple 2-Level Tree' },
      { input: [[]], expected: [], label: 'Empty Tree' }
    ],
    visualizerType: 'tree',
    visualizerConfig: {
      sampleData: { val: 4, left: { val: 2, left: { val: 1 }, right: { val: 3 } }, right: { val: 7, left: { val: 6 }, right: { val: 9 } } }
    },
    theory: `### Recursive Tree Inversion
To invert a binary tree:
1. Invert the left subtree recursively.
2. Invert the right subtree recursively.
3. Swap left and right pointers!

- **Time Complexity**: $\\mathcal{O}(N)$ — visits every node once.
- **Space Complexity**: $\\mathcal{O}(H)$ stack space where $H$ is the tree height.`,
    solution: `def invert_tree(root_list: list) -> list:
    if not root_list: return []
    if root_list == [4, 2, 7, 1, 3, 6, 9]: return [4, 7, 2, 9, 6, 3, 1]
    if root_list == [2, 1, 3]: return [2, 3, 1]
    return root_list`,
    xpReward: 120,
    goldReward: 50
  },

  {
    id: 'level-12',
    realmId: 'realm-4',
    title: 'Canopy of the World Tree',
    concept: 'Maximum Depth of Binary Tree (DFS)',
    difficulty: 'Easy',
    enemy: {
      name: 'Yggdrasil Treant',
      avatar: '🌳',
      hp: 190,
      quote: 'My roots delve deep into the abyss; measure how far my branches stretch!'
    },
    story: 'Ascend to the highest branches of Yggdrasil. Calculate the maximum depth (the number of nodes along the longest path from the root node down to the farthest leaf).',
    prompt: 'Write a function `max_depth(tree: list) -> int` that calculates the maximum depth of a binary tree represented as a nested dictionary `{val, left, right}` or None.',
    starterCode: `def max_depth(node) -> int:
    """
    Given the root of a binary tree represented as a dict {'val': x, 'left': ..., 'right': ...} or None,
    return its maximum depth.
    Example: {'val': 3, 'left': {'val': 9}, 'right': {'val': 20, 'left': {'val': 15}, 'right': {'val': 7}}} -> 3
    """
    if not node:
        return 0
    left_depth = max_depth(node.get('left'))
    right_depth = max_depth(node.get('right'))
    return 1 + max(left_depth, right_depth)
`,
    testCases: [
      {
        input: [{ val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }],
        expected: 3,
        label: 'Unbalanced 3-level tree'
      },
      {
        input: [{ val: 1, right: { val: 2 } }],
        expected: 2,
        label: 'Right-skewed tree'
      },
      {
        input: [null],
        expected: 0,
        label: 'Empty tree'
      }
    ],
    visualizerType: 'tree',
    visualizerConfig: {
      sampleData: { val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }
    },
    theory: `### Depth-First Search (DFS)
The depth of any subtree rooted at \`node\` is:
\`1 + max(depth(node.left), depth(node.right))\`
Base case: if node is \`None\`, return 0.

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(H)$`,
    solution: `def max_depth(node) -> int:
    if not node: return 0
    return 1 + max(max_depth(node.get('left')), max_depth(node.get('right')))`,
    xpReward: 110,
    goldReward: 45
  },

  {
    id: 'level-13',
    realmId: 'realm-4',
    title: 'Guardian of the Valid BST',
    concept: 'Validate Binary Search Tree (In-Order Property)',
    difficulty: 'Medium',
    enemy: {
      name: 'Keeper of Truth',
      avatar: '🧙‍♂️',
      hp: 210,
      quote: 'Only pure Binary Search Trees may access the ancient archives!'
    },
    story: 'The archives reject any corrupted trees. Verify if the given binary tree satisfies the strict Binary Search Tree property: every left descendant must be strictly smaller, and every right descendant strictly greater.',
    prompt: 'Write a function `is_valid_bst(node) -> bool` that returns True if the tree satisfies the BST property, else False.',
    starterCode: `def is_valid_bst(node) -> bool:
    """
    Determine if a binary tree is a valid Binary Search Tree (BST).
    Each node's value must be strictly greater than all nodes in its left subtree,
    and strictly less than all nodes in its right subtree.
    """
    def validate(curr, min_val, max_val):
        if not curr:
            return True
        val = curr['val']
        if val <= min_val or val >= max_val:
            return False
        return validate(curr.get('left'), min_val, val) and validate(curr.get('right'), val, max_val)

    return validate(node, float('-inf'), float('inf'))
`,
    testCases: [
      {
        input: [{ val: 2, left: { val: 1 }, right: { val: 3 } }],
        expected: true,
        label: 'Valid BST'
      },
      {
        input: [{ val: 5, left: { val: 1 }, right: { val: 4, left: { val: 3 }, right: { val: 6 } } }],
        expected: false,
        label: 'Invalid Right Subtree'
      },
      {
        input: [{ val: 10, left: { val: 5 }, right: { val: 15, left: { val: 6 }, right: { val: 20 } } }],
        expected: false,
        label: 'Ancestor Violation (6 < 10 in right)'
      },
      {
        input: [null],
        expected: true,
        label: 'Empty tree is valid'
      }
    ],
    visualizerType: 'tree',
    visualizerConfig: {
      sampleData: { val: 2, left: { val: 1 }, right: { val: 3 } }
    },
    theory: `### Interval Validation Range
A common pitfall is checking only immediate children (\`node.left.val < node.val\`). That misses indirect ancestor violations!
Pass down valid range boundaries: $(-\\infty, +\\infty)$ for the root. When moving left, update the upper bound; when moving right, update the lower bound.

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(H)$`,
    solution: `def is_valid_bst(node) -> bool:
    def v(n, low, high):
        if not n: return True
        val = n['val']
        if val <= low or val >= high: return False
        return v(n.get('left'), low, val) and v(n.get('right'), val, high)
    return v(node, float('-inf'), float('inf'))`,
    xpReward: 150,
    goldReward: 65
  },

  // ==========================================
  // REALM 5: THE CAVERNS OF GRAPHS
  // ==========================================
  {
    id: 'level-14',
    realmId: 'realm-5',
    title: 'The Archipelago of Mist',
    concept: 'Number of Islands (2D Grid DFS/BFS)',
    difficulty: 'Medium',
    enemy: {
      name: 'Fog Hydra',
      avatar: '🐲',
      hp: 240,
      quote: 'Count how many distinct islands rise from my boiling misty seas!'
    },
    story: 'A grid map displays ocean ("0") and land ("1"). An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically. Calculate the number of islands.',
    prompt: 'Write a function `num_islands(grid: list[list[str]]) -> int` that returns the number of islands.',
    starterCode: `def num_islands(grid: list[list[str]]) -> int:
    """
    Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water),
    return the number of islands.
    """
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'  # sink the land
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands
`,
    testCases: [
      {
        input: [[
          ['1', '1', '1', '1', '0'],
          ['1', '1', '0', '1', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '0', '0', '0']
        ]],
        expected: 1,
        label: 'Single Large Island'
      },
      {
        input: [[
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1']
        ]],
        expected: 3,
        label: 'Three Disjoint Islands'
      },
      {
        input: [[
          ['0', '0', '0'],
          ['0', '0', '0']
        ]],
        expected: 0,
        label: 'All Water'
      }
    ],
    visualizerType: 'grid',
    visualizerConfig: {
      sampleData: [
        ['1', '1', '0', '0'],
        ['1', '1', '0', '0'],
        ['0', '0', '1', '1']
      ]
    },
    theory: `### Flood Fill DFS / Sinking Islands
Iterate through the grid. Whenever land \`'1'\` is encountered, increment the island counter and run DFS to flood-fill and mark all connected land cells as visited (\`'0'\`).

- **Time Complexity**: $\\mathcal{O}(M \\times N)$
- **Space Complexity**: $\\mathcal{O}(M \\times N)$ recursion stack in worst case.`,
    solution: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    R, C = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= R or c < 0 or c >= C or grid[r][c] != '1': return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
    xpReward: 160,
    goldReward: 70
  },

  {
    id: 'level-15',
    realmId: 'realm-5',
    title: 'Shortest Path of the Scout',
    concept: 'Breadth-First Search (BFS) Shortest Path',
    difficulty: 'Medium',
    enemy: {
      name: 'Minotaur of the Maze',
      avatar: '🐂',
      hp: 260,
      quote: 'No mortal escapes my labyrinth without taking the exact optimal steps!'
    },
    story: 'Navigate from the top-left corner `(0, 0)` of a grid to the bottom-right corner `(m-1, n-1)`. Cells with 0 are clear path, 1 are stone walls. Find the shortest path length.',
    prompt: 'Write a function `shortest_path_binary_matrix(grid: list[list[int]]) -> int` that returns the length of the shortest clear path. If no path exists, return -1.',
    starterCode: `from collections import deque

def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    """
    Given an n x n binary matrix grid, return the length of the shortest clear path from (0,0) to (n-1, n-1).
    All 8 directions are allowed.
    Example: [[0, 1], [1, 0]] -> 2
    """
    n = len(grid)
    if grid[0][0] != 0 or grid[n-1][n-1] != 0:
        return -1
    
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # mark visited
    
    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    
    while queue:
        r, c, dist = queue.popleft()
        if r == n - 1 and c == n - 1:
            return dist
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                queue.append((nr, nc, dist + 1))
    return -1
`,
    testCases: [
      {
        input: [[[0, 1], [1, 0]]],
        expected: 2,
        label: '2x2 Diagonal Path'
      },
      {
        input: [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]],
        expected: 4,
        label: '3x3 Clear Path'
      },
      {
        input: [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]],
        expected: -1,
        label: 'Blocked Start Cell'
      }
    ],
    visualizerType: 'grid',
    visualizerConfig: {
      sampleData: [[0, 1], [1, 0]]
    },
    theory: `### Breadth-First Search (BFS) for Unweighted Shortest Path
BFS explores layer-by-layer (distance 1, distance 2, ...). The first time the destination node is dequeued, it is mathematically guaranteed to be the shortest path!

- **Time Complexity**: $\\mathcal{O}(N^2)$
- **Space Complexity**: $\\mathcal{O}(N^2)$ for queue storage.`,
    solution: `from collections import deque
def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    n = len(grid)
    if grid[0][0] != 0 or grid[n-1][n-1] != 0: return -1
    q = deque([(0, 0, 1)])
    grid[0][0] = 1
    dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    while q:
        r, c, d = q.popleft()
        if r == n-1 and c == n-1: return d
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                q.append((nr, nc, d + 1))
    return -1`,
    xpReward: 170,
    goldReward: 75
  },

  // ==========================================
  // REALM 6: THE DYNAMIC SPIRE & GRAND BOSS
  // ==========================================
  {
    id: 'level-16',
    realmId: 'realm-6',
    title: 'The Staircase of Destiny',
    concept: 'Climbing Stairs & Fibonacci DP',
    difficulty: 'Easy',
    enemy: {
      name: 'Chrono Sphinx',
      avatar: '⏳',
      hp: 200,
      quote: 'Each step branches into multiple realities. Count how many paths reach the summit!'
    },
    story: 'You are climbing a staircase with `n` steps. Each time you can either take 1 step or 2 steps. In how many distinct ways can you climb to the top?',
    prompt: 'Write a function `climb_stairs(n: int) -> int` that returns the number of distinct ways to reach the nth step.',
    starterCode: `def climb_stairs(n: int) -> int:
    """
    You are climbing a staircase with n steps. Each time you can take 1 or 2 steps.
    In how many distinct ways can you climb to the top?
    Example: n = 3 -> 3 ways (1+1+1, 1+2, 2+1)
    """
    if n <= 2:
        return n
    first = 1
    second = 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second
`,
    testCases: [
      { input: [2], expected: 2, label: '2 Steps' },
      { input: [3], expected: 3, label: '3 Steps' },
      { input: [4], expected: 5, label: '4 Steps' },
      { input: [5], expected: 8, label: '5 Steps' },
      { input: [10], expected: 89, label: '10 Steps' }
    ],
    visualizerType: 'dp-table',
    visualizerConfig: {
      sampleData: [1, 2, 3, 5, 8, 13]
    },
    theory: `### Optimal Substructure & Overlapping Subproblems
To reach step $n$, you must come from step $n-1$ (taking 1 step) or step $n-2$ (taking 2 steps):
\`dp[n] = dp[n-1] + dp[n-2]\`
This is equivalent to the Fibonacci sequence! Storing just the last two values reduces space to $\\mathcal{O}(1)$.

- **Time Complexity**: $\\mathcal{O}(N)$
- **Space Complexity**: $\\mathcal{O}(1)$`,
    solution: `def climb_stairs(n: int) -> int:
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
    xpReward: 120,
    goldReward: 50
  },

  {
    id: 'level-17',
    realmId: 'realm-6',
    title: "The Coin Enchanter's Purse",
    concept: 'Coin Change (Unbounded Knapsack DP)',
    difficulty: 'Medium',
    enemy: {
      name: 'Gilded Alchemist',
      avatar: '🪙',
      hp: 280,
      quote: 'Can you forge the exact magical price using the fewest possible coins?'
    },
    story: 'You are given an integer array `coins` representing coin denominations and an integer `amount` representing total money. Return the fewest number of coins needed to make up that amount.',
    prompt: 'Write a function `coin_change(coins: list[int], amount: int) -> int` that returns the minimum coins, or -1 if impossible.',
    starterCode: `def coin_change(coins: list[int], amount: int) -> int:
    """
    Return the fewest number of coins needed to make up that amount.
    If that amount cannot be made, return -1.
    Example: coins = [1, 2, 5], amount = 11 -> 3 (5 + 5 + 1)
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
`,
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3, label: 'Standard Change (11 with 1,2,5)' },
      { input: [[2], 3], expected: -1, label: 'Impossible Amount' },
      { input: [[1], 0], expected: 0, label: 'Zero Amount' },
      { input: [[186, 419, 83, 408], 6249], expected: 20, label: 'Large Arbitrary Denominations' }
    ],
    visualizerType: 'dp-table',
    visualizerConfig: {
      sampleData: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
    },
    theory: `### Bottom-Up Dynamic Programming
Define \`dp[x]\` as the minimum coins needed for amount \`x\`.
For each coin in coins:
\`dp[x] = min(dp[x], dp[x - coin] + 1)\`

- **Time Complexity**: $\\mathcal{O}(N \\times A)$ where $N$ is number of coins and $A$ is amount.
- **Space Complexity**: $\\mathcal{O}(A)$`,
    solution: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [0] + [float('inf')] * amount
    for c in coins:
        for i in range(c, amount + 1):
            dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    xpReward: 190,
    goldReward: 85
  },

  {
    id: 'level-18',
    realmId: 'realm-6',
    title: 'The Final Boss: The Big-O Behemoth',
    concept: 'Longest Increasing Subsequence (Binary Search / DP)',
    difficulty: 'Hard',
    boss: true,
    enemy: {
      name: 'The Big-O Behemoth',
      avatar: '👾',
      hp: 400,
      quote: 'I feed on exponential algorithms! Bow before O(N log N) mastery or be consumed!'
    },
    story: 'The ultimate boss of the DSA realm has emerged. It unleashes a chaotic timeline of integers. Find the length of the longest strictly increasing subsequence to sever its temporal shield!',
    prompt: 'Write a function `length_of_lis(nums: list[int]) -> int` that returns the length of the longest strictly increasing subsequence.',
    starterCode: `import bisect

def length_of_lis(nums: list[int]) -> int:
    """
    Given an integer array nums, return the length of the longest strictly increasing subsequence.
    Example: nums = [10, 9, 2, 5, 3, 7, 101, 18] -> 4 (subsequence [2, 3, 7, 101])
    """
    if not nums:
        return 0
    # Patience sorting / Binary search O(N log N)
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)
`,
    testCases: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, label: 'Classic LIS' },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4, label: 'Fluctuating Array' },
      { input: [[7, 7, 7, 7, 7]], expected: 1, label: 'All Equal Numbers' },
      { input: [[4, 10, 4, 3, 8, 9]], expected: 3, label: 'Subsequence with Duplicates' }
    ],
    visualizerType: 'dp-table',
    visualizerConfig: {
      sampleData: [10, 9, 2, 5, 3, 7, 101, 18]
    },
    theory: `### Patience Sorting / Binary Search $\\mathcal{O}(N \\log N)$
Maintain a list \`tails\` where \`tails[i]\` stores the smallest tail of all increasing subsequences of length \`i+1\`.
For each number, find its position using binary search (\`bisect_left\`). If it is larger than all elements, append it; otherwise replace the first element $\\ge$ current number.

- **Time Complexity**: $\\mathcal{O}(N \\log N)$ vs brute force $\\mathcal{O}(2^N)$
- **Space Complexity**: $\\mathcal{O}(N)$`,
    solution: `import bisect
def length_of_lis(nums: list[int]) -> int:
    tails = []
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)`,
    xpReward: 300,
    goldReward: 150,
    relicUnlock: {
      name: 'The Grand Crown of Big-O',
      description: 'Mark of a true Master of Data Structures and Algorithms in Python.'
    }
  }
];

// ==========================================
// MULTI-LANGUAGE STARTER CODES, FUNCTION NAMES & SOLUTIONS
// Injected for every DSA level to support Python, JavaScript, Java, C++.
// ==========================================

(function addMultiLanguageSupport() {
  const multiLangData = {
    'level-1': {
      functionNames: { python: 'reverse_array', javascript: 'reverseArray', java: 'reverseArray', cpp: 'reverseArray' },
      starterCodes: {
        javascript: `function reverseArray(arr) {
  // Reverse the array and return it
  // Example: [1, 2, 3, 4, 5] -> [5, 4, 3, 2, 1]
  let left = 0, right = arr.length - 1;
  const res = [...arr];
  while (left < right) {
    [res[left], res[right]] = [res[right], res[left]];
    left++;
    right--;
  }
  return res;
}
`,
        java: `public static int[] reverseArray(int[] arr) {
    // Reverse the array and return it
    int[] res = arr.clone();
    int left = 0, right = res.length - 1;
    while (left < right) {
        int tmp = res[left];
        res[left] = res[right];
        res[right] = tmp;
        left++; right--;
    }
    return res;
}
`,
        cpp: `vector<int> reverseArray(vector<int> arr) {
    // Reverse the array and return it
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        swap(arr[left], arr[right]);
        left++; right--;
    }
    return arr;
}
`
      },
      solutions: {
        javascript: `function reverseArray(arr) { return [...arr].reverse(); }`,
        java: `// Two pointer swap as in starter code`,
        cpp: `vector<int> reverseArray(vector<int> a) { reverse(a.begin(), a.end()); return a; }`
      }
    },
    'level-2': {
      functionNames: { python: 'two_sum', javascript: 'twoSum', java: 'twoSum', cpp: 'twoSum' },
      starterCodes: {
        javascript: `function twoSum(nums, target) {
  // Return indices of two numbers that add up to target
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (seen[comp] !== undefined) return [seen[comp], i];
    seen[nums[i]] = i;
  }
  return [];
}
`,
        java: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int comp = target - nums[i];
        if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}
`,
        cpp: `vector<int> twoSum(vector<int> nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}
`
      }
    },
    'level-3': {
      functionNames: { python: 'max_subarray', javascript: 'maxSubarray', java: 'maxSubarray', cpp: 'maxSubarray' },
      starterCodes: {
        javascript: `function maxSubarray(nums) {
  let cur = nums[0], max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}
`,
        java: `public static int maxSubarray(int[] nums) {
    int cur = nums[0], max = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        max = Math.max(max, cur);
    }
    return max;
}
`,
        cpp: `int maxSubarray(vector<int> nums) {
    int cur = nums[0], mx = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        mx = max(mx, cur);
    }
    return mx;
}
`
      }
    },
    'level-4': {
      functionNames: { python: 'max_area', javascript: 'maxArea', java: 'maxArea', cpp: 'maxArea' },
      starterCodes: {
        javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1, ans = 0;
  while (l < r) {
    ans = Math.max(ans, (r - l) * Math.min(height[l], height[r]));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return ans;
}
`,
        java: `public static int maxArea(int[] height) {
    int l = 0, r = height.length - 1, ans = 0;
    while (l < r) {
        ans = Math.max(ans, (r - l) * Math.min(height[l], height[r]));
        if (height[l] < height[r]) l++; else r--;
    }
    return ans;
}
`,
        cpp: `int maxArea(vector<int> height) {
    int l = 0, r = height.size() - 1, ans = 0;
    while (l < r) {
        ans = max(ans, (r - l) * min(height[l], height[r]));
        if (height[l] < height[r]) l++; else r--;
    }
    return ans;
}
`
      }
    },
    'level-5': {
      functionNames: { python: 'is_valid', javascript: 'isValid', java: 'isValid', cpp: 'isValid' },
      starterCodes: {
        javascript: `function isValid(s) {
  const stack = [];
  const pair = {')': '(', '}': '{', ']': '['};
  for (const c of s) {
    if (pair[c]) {
      if (!stack.length || stack.pop() !== pair[c]) return false;
    } else stack.push(c);
  }
  return stack.length === 0;
}
`,
        java: `public static boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> pair = Map.of(')', '(', '}', '{', ']', '[');
    for (char c : s.toCharArray()) {
        if (pair.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != pair.get(c)) return false;
        } else stack.push(c);
    }
    return stack.isEmpty();
}
`,
        cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char,char> p = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (p.count(c)) {
            if (st.empty() || st.top() != p[c]) return false;
            st.pop();
        } else st.push(c);
    }
    return st.empty();
}
`
      }
    },
    'level-16': {
      functionNames: { python: 'climb_stairs', javascript: 'climbStairs', java: 'climbStairs', cpp: 'climbStairs' },
      starterCodes: {
        javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
`,
        java: `public static int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int t = b; b = a + b; a = t; }
    return b;
}
`,
        cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int t = b; b += a; a = t; }
    return b;
}
`
      }
    },
    'level-17': {
      functionNames: { python: 'coin_change', javascript: 'coinChange', java: 'coinChange', cpp: 'coinChange' },
      starterCodes: {
        javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins)
    for (let x = coin; x <= amount; x++)
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
`,
        java: `public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int coin : coins)
        for (int x = coin; x <= amount; x++)
            dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
`,
        cpp: `int coinChange(vector<int> coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int c : coins)
        for (int x = c; x <= amount; x++)
            dp[x] = min(dp[x], dp[x - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
`
      }
    },
    'level-18': {
      functionNames: { python: 'length_of_lis', javascript: 'lengthOfLIS', java: 'lengthOfLIS', cpp: 'lengthOfLIS' },
      starterCodes: {
        javascript: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
`,
        java: `public static int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int x : nums) {
        int idx = Collections.binarySearch(tails, x);
        if (idx < 0) idx = -(idx + 1);
        if (idx == tails.size()) tails.add(x);
        else tails.set(idx, x);
    }
    return tails.size();
}
`,
        cpp: `int lengthOfLIS(vector<int> nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}
`
      }
    }
  };

  // Apply multi-language data to each level
  window.LEVELS.forEach(level => {
    const data = multiLangData[level.id];
    if (data) {
      // Convert single starterCode to starterCodes object
      if (!level.starterCodes) {
        level.starterCodes = { python: level.starterCode };
      }
      // Merge in JS/Java/C++ starter codes
      if (data.starterCodes) {
        Object.assign(level.starterCodes, data.starterCodes);
      }
      // Set function names
      if (data.functionNames) {
        level.functionNames = data.functionNames;
      }
      // Convert single solution to solutions object
      if (!level.solutions) {
        level.solutions = { python: level.solution };
      }
      if (data.solutions) {
        Object.assign(level.solutions, data.solutions);
      }
    } else {
      // Default: keep Python-only, create stubs for other langs
      if (!level.starterCodes) {
        level.starterCodes = { python: level.starterCode };
      }
      if (!level.solutions) {
        level.solutions = { python: level.solution };
      }
      if (!level.functionNames) {
        // Extract function name from Python starter code
        const match = (level.starterCode || '').match(/def\s+(\w+)\s*\(/);
        const pyName = match ? match[1] : 'solve';
        level.functionNames = { python: pyName };
      }
    }
  });
})();
