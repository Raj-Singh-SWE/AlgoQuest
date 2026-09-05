/**
 * AlgoQuest Learn Coding Academy
 * 15 Interactive Lessons across 3 Realms, covering coding fundamentals to advanced topics.
 * Each lesson has starter code and solutions in Python, JavaScript, Java, and C++.
 */

window.LEARN_REALMS = [
  {
    id: 'learn-realm-1',
    name: 'The Syntax Forge',
    icon: '🔥',
    description: 'Master the building blocks: variables, conditions, loops, and functions.',
    color: '#ff6b35'
  },
  {
    id: 'learn-realm-2',
    name: 'The Logic Crucible',
    icon: '🧪',
    description: 'Wield collections, nested structures, recursion, and OOP.',
    color: '#00b4d8'
  },
  {
    id: 'learn-realm-3',
    name: "The Master's Trials",
    icon: '👑',
    description: 'Conquer advanced patterns: higher-order functions, sorting, and complexity.',
    color: '#e63946'
  }
];

window.LESSONS = [
  // ==========================================
  // REALM: THE SYNTAX FORGE (Basics)
  // ==========================================
  {
    id: 'lesson-1',
    realmId: 'learn-realm-1',
    title: 'The Variable Vault',
    concept: 'Variables & Data Types',
    difficulty: 'Beginner',
    isLesson: true,
    enemy: {
      name: 'Type Phantom',
      avatar: '👻',
      hp: 80,
      quote: 'Show me you can store and retrieve my essence in the right vessels!'
    },
    story: 'Deep inside the Syntax Forge, crystals hold raw data. You must learn to store integers, strings, and booleans in named containers — variables — before the Type Phantom siphons them away.',
    teaching: `### Variables & Data Types
A **variable** is a named container that stores a value. Different languages declare variables differently, but the concept is universal.

**Common Data Types:**
- **Integer (int)**: Whole numbers like \`42\`, \`-7\`, \`0\`
- **Float / Double**: Decimal numbers like \`3.14\`, \`-0.5\`
- **String (str)**: Text like \`"hello"\`, \`'world'\`
- **Boolean (bool)**: \`True\` / \`False\` (or \`true\` / \`false\`)

Variables let you **reuse** values, **update** them, and **pass** them to functions.`,
    prompt: 'Write a function that takes two integers and returns their sum.',
    starterCodes: {
      python: `def add_numbers(a: int, b: int) -> int:
    """
    Return the sum of two integers.
    Example: add_numbers(3, 5) -> 8
    """
    # Store the result in a variable and return it
    result = a + b
    return result
`,
      javascript: `function addNumbers(a, b) {
  // Return the sum of two integers
  // Example: addNumbers(3, 5) -> 8
  const result = a + b;
  return result;
}
`,
      java: `public static int addNumbers(int a, int b) {
    // Return the sum of two integers
    // Example: addNumbers(3, 5) -> 8
    int result = a + b;
    return result;
}
`,
      cpp: `int addNumbers(int a, int b) {
    // Return the sum of two integers
    // Example: addNumbers(3, 5) -> 8
    int result = a + b;
    return result;
}
`
    },
    functionNames: { python: 'add_numbers', javascript: 'addNumbers', java: 'addNumbers', cpp: 'addNumbers' },
    testCases: [
      { input: [3, 5], expected: 8, label: 'Positive Nums' },
      { input: [-2, 7], expected: 5, label: 'Mixed Signs' },
      { input: [0, 0], expected: 0, label: 'Both Zero' },
      { input: [100, -100], expected: 0, label: 'Cancel Out' }
    ],
    solutions: {
      python: `def add_numbers(a, b):\n    return a + b`,
      javascript: `function addNumbers(a, b) { return a + b; }`,
      java: `public static int addNumbers(int a, int b) { return a + b; }`,
      cpp: `int addNumbers(int a, int b) { return a + b; }`
    },
    xpReward: 30,
    goldReward: 10,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [3, 5, 8] }
  },

  {
    id: 'lesson-2',
    realmId: 'learn-realm-1',
    title: 'The Branching Crossroads',
    concept: 'Conditionals (if/else)',
    difficulty: 'Beginner',
    isLesson: true,
    enemy: {
      name: 'Fork Wraith',
      avatar: '🔀',
      hp: 90,
      quote: 'Choose the correct path, or be forever lost in my maze of conditions!'
    },
    story: 'The cavern splits into branching paths. Only the correct conditional logic reveals the safe route. Master if, else-if, and else to navigate the Fork Wraith\'s maze.',
    teaching: `### Conditional Statements
Conditionals let your code **make decisions** based on conditions.

**Pattern:**
\`\`\`
if (condition):
    do something
elif (another condition):
    do something else
else:
    default action
\`\`\`

**Comparison Operators:** \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
**Logical Operators:** \`and/&&\`, \`or/||\`, \`not/!\``,
    prompt: 'Write a function that takes a number and returns "positive", "negative", or "zero".',
    starterCodes: {
      python: `def classify_number(n: int) -> str:
    """
    Return "positive", "negative", or "zero" based on the input number.
    """
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"
`,
      javascript: `function classifyNumber(n) {
  // Return "positive", "negative", or "zero"
  if (n > 0) return "positive";
  else if (n < 0) return "negative";
  else return "zero";
}
`,
      java: `public static String classifyNumber(int n) {
    if (n > 0) return "positive";
    else if (n < 0) return "negative";
    else return "zero";
}
`,
      cpp: `string classifyNumber(int n) {
    if (n > 0) return "positive";
    else if (n < 0) return "negative";
    else return "zero";
}
`
    },
    functionNames: { python: 'classify_number', javascript: 'classifyNumber', java: 'classifyNumber', cpp: 'classifyNumber' },
    testCases: [
      { input: [42], expected: 'positive', label: 'Positive' },
      { input: [-7], expected: 'negative', label: 'Negative' },
      { input: [0], expected: 'zero', label: 'Zero' },
      { input: [1], expected: 'positive', label: 'Edge Positive' }
    ],
    solutions: {
      python: `def classify_number(n): return "positive" if n > 0 else ("negative" if n < 0 else "zero")`,
      javascript: `function classifyNumber(n) { return n > 0 ? "positive" : n < 0 ? "negative" : "zero"; }`,
      java: `public static String classifyNumber(int n) { return n > 0 ? "positive" : n < 0 ? "negative" : "zero"; }`,
      cpp: `string classifyNumber(int n) { return n > 0 ? "positive" : n < 0 ? "negative" : "zero"; }`
    },
    xpReward: 35,
    goldReward: 12,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [42, -7, 0] }
  },

  {
    id: 'lesson-3',
    realmId: 'learn-realm-1',
    title: 'The Infinite Spiral',
    concept: 'Loops (for / while)',
    difficulty: 'Beginner',
    isLesson: true,
    enemy: {
      name: 'Loop Elemental',
      avatar: '🌀',
      hp: 100,
      quote: 'Can you harness the power of repetition without falling into infinity?'
    },
    story: 'The Loop Elemental generates endless waves of minions. Only by mastering iteration — for-loops and while-loops — can you process each wave efficiently.',
    teaching: `### Loops
Loops repeat a block of code multiple times.

**For Loop** — iterate over a sequence:
\`for i in range(5)\` or \`for (int i = 0; i < 5; i++)\`

**While Loop** — repeat while a condition is true:
\`while (count > 0)\`

**Key Concepts:**
- **Accumulator**: A variable that collects results across iterations
- **Break**: Exit the loop early
- **Continue**: Skip the current iteration`,
    prompt: 'Write a function that returns the sum of all integers from 1 to n (inclusive).',
    starterCodes: {
      python: `def sum_to_n(n: int) -> int:
    """
    Return the sum of all integers from 1 to n (inclusive).
    Example: sum_to_n(5) -> 15 (1+2+3+4+5)
    """
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
`,
      javascript: `function sumToN(n) {
  // Return sum of 1 to n inclusive
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
`,
      java: `public static int sumToN(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    return total;
}
`,
      cpp: `int sumToN(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    return total;
}
`
    },
    functionNames: { python: 'sum_to_n', javascript: 'sumToN', java: 'sumToN', cpp: 'sumToN' },
    testCases: [
      { input: [5], expected: 15, label: 'Sum 1-5' },
      { input: [1], expected: 1, label: 'Single' },
      { input: [10], expected: 55, label: 'Sum 1-10' },
      { input: [100], expected: 5050, label: 'Sum 1-100' }
    ],
    solutions: {
      python: `def sum_to_n(n): return n * (n + 1) // 2`,
      javascript: `function sumToN(n) { return n * (n + 1) / 2; }`,
      java: `public static int sumToN(int n) { return n * (n + 1) / 2; }`,
      cpp: `int sumToN(int n) { return n * (n + 1) / 2; }`
    },
    xpReward: 40,
    goldReward: 15,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [1, 3, 6, 10, 15] }
  },

  {
    id: 'lesson-4',
    realmId: 'learn-realm-1',
    title: 'The Spell Tome of Functions',
    concept: 'Functions & Parameters',
    difficulty: 'Beginner',
    isLesson: true,
    enemy: {
      name: 'Void Caller',
      avatar: '📕',
      hp: 110,
      quote: 'A spell without proper incantation parameters is useless!'
    },
    story: 'The ancient Spell Tome teaches you to define reusable spells (functions). Each spell takes ingredients (parameters) and produces a result (return value).',
    prompt: 'Write a function that checks if a number is prime. Return True/true if prime, False/false otherwise.',
    starterCodes: {
      python: `def is_prime(n: int) -> bool:
    """
    Return True if n is a prime number, False otherwise.
    A prime is > 1 and divisible only by 1 and itself.
    """
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True
`,
      javascript: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}
`,
      java: `public static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}
`,
      cpp: `bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
`
    },
    functionNames: { python: 'is_prime', javascript: 'isPrime', java: 'isPrime', cpp: 'isPrime' },
    testCases: [
      { input: [7], expected: true, label: 'Prime 7' },
      { input: [4], expected: false, label: 'Composite 4' },
      { input: [1], expected: false, label: 'Edge: 1' },
      { input: [2], expected: true, label: 'Smallest Prime' },
      { input: [97], expected: true, label: 'Large Prime' }
    ],
    solutions: {
      python: `def is_prime(n):\n    if n < 2: return False\n    return all(n % i != 0 for i in range(2, int(n**0.5) + 1))`,
      javascript: `function isPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }`,
      java: `public static boolean isPrime(int n) { if (n < 2) return false; for (int i = 2; i * i <= n; i++) if (n % i == 0) return false; return true; }`,
      cpp: `bool isPrime(int n) { if (n < 2) return false; for (int i = 2; i * i <= n; i++) if (n % i == 0) return false; return true; }`
    },
    xpReward: 45,
    goldReward: 18,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [2, 3, 5, 7, 11, 13] }
  },

  {
    id: 'lesson-5',
    realmId: 'learn-realm-1',
    title: 'The Whispering Strings',
    concept: 'Strings & String Methods',
    difficulty: 'Beginner',
    isLesson: true,
    enemy: {
      name: 'Cipher Shade',
      avatar: '🔤',
      hp: 120,
      quote: 'Decode my whispered words or be silenced forever!'
    },
    story: 'The Cipher Shade speaks in encoded strings. Learn to manipulate, reverse, and transform text to break its cipher.',
    prompt: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore case.',
    starterCodes: {
      python: `def is_palindrome(s: str) -> bool:
    """
    Check if a string is a palindrome (case-insensitive).
    Example: is_palindrome("Racecar") -> True
    """
    s = s.lower()
    return s == s[::-1]
`,
      javascript: `function isPalindrome(s) {
  s = s.toLowerCase();
  return s === s.split('').reverse().join('');
}
`,
      java: `public static boolean isPalindrome(String s) {
    s = s.toLowerCase();
    return s.equals(new StringBuilder(s).reverse().toString());
}
`,
      cpp: `bool isPalindrome(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    string rev = s;
    reverse(rev.begin(), rev.end());
    return s == rev;
}
`
    },
    functionNames: { python: 'is_palindrome', javascript: 'isPalindrome', java: 'isPalindrome', cpp: 'isPalindrome' },
    testCases: [
      { input: ['Racecar'], expected: true, label: 'Classic Palindrome' },
      { input: ['hello'], expected: false, label: 'Not Palindrome' },
      { input: ['A'], expected: true, label: 'Single Char' },
      { input: ['MadAm'], expected: true, label: 'Mixed Case' }
    ],
    solutions: {
      python: `def is_palindrome(s): s = s.lower(); return s == s[::-1]`,
      javascript: `function isPalindrome(s) { s = s.toLowerCase(); return s === s.split('').reverse().join(''); }`,
      java: `public static boolean isPalindrome(String s) { s = s.toLowerCase(); return s.equals(new StringBuilder(s).reverse().toString()); }`,
      cpp: `bool isPalindrome(string s) { transform(s.begin(), s.end(), s.begin(), ::tolower); string r = s; reverse(r.begin(), r.end()); return s == r; }`
    },
    xpReward: 50,
    goldReward: 20,
    visualizerType: 'array',
    visualizerConfig: { sampleData: ['R', 'a', 'c', 'e', 'c', 'a', 'r'] }
  },

  // ==========================================
  // REALM: THE LOGIC CRUCIBLE (Intermediate)
  // ==========================================
  {
    id: 'lesson-6',
    realmId: 'learn-realm-2',
    title: 'The Array Armory',
    concept: 'Lists / Arrays & Iteration',
    difficulty: 'Intermediate',
    isLesson: true,
    enemy: {
      name: 'Swarm Commander',
      avatar: '🐝',
      hp: 140,
      quote: 'My army is an array of stingers. Can you find the largest threat?'
    },
    story: 'Arrays are the fundamental collection — ordered sequences of values. The Swarm Commander challenges you to find the maximum value in an array without using built-in max functions.',
    prompt: 'Write a function that finds and returns the maximum value in an array of integers.',
    starterCodes: {
      python: `def find_max(arr: list) -> int:
    """
    Find and return the maximum value in the array.
    Do NOT use the built-in max() function.
    """
    if not arr:
        return 0
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val
`,
      javascript: `function findMax(arr) {
  if (arr.length === 0) return 0;
  let maxVal = arr[0];
  for (const num of arr) {
    if (num > maxVal) maxVal = num;
  }
  return maxVal;
}
`,
      java: `public static int findMax(int[] arr) {
    if (arr.length == 0) return 0;
    int maxVal = arr[0];
    for (int num : arr) {
        if (num > maxVal) maxVal = num;
    }
    return maxVal;
}
`,
      cpp: `int findMax(vector<int> arr) {
    if (arr.empty()) return 0;
    int maxVal = arr[0];
    for (int num : arr) {
        if (num > maxVal) maxVal = num;
    }
    return maxVal;
}
`
    },
    functionNames: { python: 'find_max', javascript: 'findMax', java: 'findMax', cpp: 'findMax' },
    testCases: [
      { input: [[3, 1, 4, 1, 5, 9]], expected: 9, label: 'Mixed Values' },
      { input: [[-5, -1, -8]], expected: -1, label: 'All Negatives' },
      { input: [[42]], expected: 42, label: 'Single Element' },
      { input: [[7, 7, 7]], expected: 7, label: 'All Same' }
    ],
    solutions: {
      python: `def find_max(arr):\n    m = arr[0]\n    for x in arr: m = x if x > m else m\n    return m`,
      javascript: `function findMax(arr) { return arr.reduce((a, b) => a > b ? a : b); }`,
      java: `public static int findMax(int[] arr) { int m = arr[0]; for (int x : arr) if (x > m) m = x; return m; }`,
      cpp: `int findMax(vector<int> arr) { int m = arr[0]; for (int x : arr) if (x > m) m = x; return m; }`
    },
    xpReward: 55,
    goldReward: 22,
    visualizerType: 'array',
    visualizerConfig: { sampleData: [3, 1, 4, 1, 5, 9] }
  },

  {
    id: 'lesson-7',
    realmId: 'learn-realm-2',
    title: 'The Map Chamber',
    concept: 'Dictionaries / Maps / Objects',
    difficulty: 'Intermediate',
    isLesson: true,
    enemy: {
      name: 'Key Master',
      avatar: '🗝️',
      hp: 150,
      quote: 'Every value hides behind a key. Can you count my scattered treasures?'
    },
    story: 'Hash maps (dictionaries, objects, maps) store key-value pairs for lightning-fast lookups. The Key Master challenges you to count character frequencies.',
    prompt: 'Write a function that counts the frequency of each character in a string and returns a dictionary/object/map.',
    starterCodes: {
      python: `def char_frequency(s: str) -> dict:
    """
    Count the frequency of each character.
    Example: char_frequency("aab") -> {"a": 2, "b": 1}
    """
    freq = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    return freq
`,
      javascript: `function charFrequency(s) {
  const freq = {};
  for (const ch of s) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}
`,
      java: `public static Map<Character, Integer> charFrequency(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char ch : s.toCharArray()) {
        freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    }
    return freq;
}
`,
      cpp: `map<char, int> charFrequency(string s) {
    map<char, int> freq;
    for (char ch : s) {
        freq[ch]++;
    }
    return freq;
}
`
    },
    functionNames: { python: 'char_frequency', javascript: 'charFrequency', java: 'charFrequency', cpp: 'charFrequency' },
    testCases: [
      { input: ['aab'], expected: { a: 2, b: 1 }, label: 'Simple Freq' },
      { input: ['hello'], expected: { h: 1, e: 1, l: 2, o: 1 }, label: 'Hello' },
      { input: ['x'], expected: { x: 1 }, label: 'Single Char' }
    ],
    solutions: {
      python: `def char_frequency(s):\n    from collections import Counter\n    return dict(Counter(s))`,
      javascript: `function charFrequency(s) { const f = {}; for (const c of s) f[c] = (f[c]||0)+1; return f; }`,
      java: `// Same as starter code`,
      cpp: `// Same as starter code`
    },
    xpReward: 60,
    goldReward: 25,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: ['a', 'a', 'b'] }
  },

  {
    id: 'lesson-8',
    realmId: 'learn-realm-2',
    title: 'The Matrix Vault',
    concept: 'Nested Loops & 2D Arrays',
    difficulty: 'Intermediate',
    isLesson: true,
    enemy: {
      name: 'Grid Warden',
      avatar: '🟩',
      hp: 160,
      quote: 'Navigate my 2D matrix or be trapped in nested dimensions!'
    },
    story: 'The Grid Warden protects a 2D matrix. You must use nested loops to traverse rows and columns and flatten a 2D array into a single list.',
    prompt: 'Write a function that takes a 2D array (list of lists) and returns a flattened 1D array.',
    starterCodes: {
      python: `def flatten(matrix: list) -> list:
    """
    Flatten a 2D list into a 1D list.
    Example: [[1,2],[3,4]] -> [1,2,3,4]
    """
    result = []
    for row in matrix:
        for val in row:
            result.append(val)
    return result
`,
      javascript: `function flatten(matrix) {
  const result = [];
  for (const row of matrix) {
    for (const val of row) {
      result.push(val);
    }
  }
  return result;
}
`,
      java: `public static int[] flatten(int[][] matrix) {
    List<Integer> list = new ArrayList<>();
    for (int[] row : matrix)
        for (int val : row) list.add(val);
    return list.stream().mapToInt(i -> i).toArray();
}
`,
      cpp: `vector<int> flatten(vector<vector<int>> matrix) {
    vector<int> result;
    for (auto& row : matrix)
        for (int val : row) result.push_back(val);
    return result;
}
`
    },
    functionNames: { python: 'flatten', javascript: 'flatten', java: 'flatten', cpp: 'flatten' },
    testCases: [
      { input: [[[1, 2], [3, 4]]], expected: [1, 2, 3, 4], label: '2x2 Matrix' },
      { input: [[[1, 2, 3]]], expected: [1, 2, 3], label: 'Single Row' },
      { input: [[[1], [2], [3]]], expected: [1, 2, 3], label: 'Single Column' }
    ],
    solutions: {
      python: `def flatten(m): return [v for r in m for v in r]`,
      javascript: `function flatten(m) { return m.flat(); }`,
      java: `// Same as starter`,
      cpp: `// Same as starter`
    },
    xpReward: 65,
    goldReward: 28,
    visualizerType: 'grid',
    visualizerConfig: { sampleData: [['1', '2'], ['3', '4']] }
  },

  {
    id: 'lesson-9',
    realmId: 'learn-realm-2',
    title: 'The Recursive Mirror',
    concept: 'Recursion Fundamentals',
    difficulty: 'Intermediate',
    isLesson: true,
    enemy: {
      name: 'Fractal Hydra',
      avatar: '🐲',
      hp: 180,
      quote: 'Every head I lose spawns two more — unless you find the base case!'
    },
    story: 'Recursion is a function that calls itself with a smaller problem until it reaches the base case. Defeat the Fractal Hydra by computing factorial recursively.',
    prompt: 'Write a recursive function that computes the factorial of n (n!).',
    starterCodes: {
      python: `def factorial(n: int) -> int:
    """
    Compute n! recursively.
    Example: factorial(5) -> 120
    Base case: factorial(0) = 1
    """
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`,
      javascript: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
`,
      java: `public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
`,
      cpp: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
`
    },
    functionNames: { python: 'factorial', javascript: 'factorial', java: 'factorial', cpp: 'factorial' },
    testCases: [
      { input: [5], expected: 120, label: '5!' },
      { input: [0], expected: 1, label: '0!' },
      { input: [1], expected: 1, label: '1!' },
      { input: [10], expected: 3628800, label: '10!' }
    ],
    solutions: {
      python: `def factorial(n): return 1 if n <= 1 else n * factorial(n - 1)`,
      javascript: `function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }`,
      java: `public static int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }`,
      cpp: `int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }`
    },
    xpReward: 70,
    goldReward: 30,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [1, 1, 2, 6, 24, 120] }
  },

  {
    id: 'lesson-10',
    realmId: 'learn-realm-2',
    title: 'The Class Forge',
    concept: 'Classes & OOP Basics',
    difficulty: 'Intermediate',
    isLesson: true,
    enemy: {
      name: 'Polymorphic Dragon',
      avatar: '🏗️',
      hp: 190,
      quote: 'My forms are many, but my interface is one. Can you build me?'
    },
    story: 'Object-Oriented Programming lets you bundle data and behavior into reusable blueprints called classes. Create a simple counter class.',
    prompt: 'Create a function that simulates a counter: given a list of operations ["inc", "inc", "dec", "get"], return the final counter value. Start at 0, inc adds 1, dec subtracts 1.',
    starterCodes: {
      python: `def run_counter(operations: list) -> int:
    """
    Simulate a counter starting at 0.
    "inc" -> +1, "dec" -> -1, "get" -> no change
    Return final value.
    """
    count = 0
    for op in operations:
        if op == "inc":
            count += 1
        elif op == "dec":
            count -= 1
    return count
`,
      javascript: `function runCounter(operations) {
  let count = 0;
  for (const op of operations) {
    if (op === "inc") count++;
    else if (op === "dec") count--;
  }
  return count;
}
`,
      java: `public static int runCounter(String[] operations) {
    int count = 0;
    for (String op : operations) {
        if (op.equals("inc")) count++;
        else if (op.equals("dec")) count--;
    }
    return count;
}
`,
      cpp: `int runCounter(vector<string> operations) {
    int count = 0;
    for (auto& op : operations) {
        if (op == "inc") count++;
        else if (op == "dec") count--;
    }
    return count;
}
`
    },
    functionNames: { python: 'run_counter', javascript: 'runCounter', java: 'runCounter', cpp: 'runCounter' },
    testCases: [
      { input: [["inc", "inc", "dec", "inc"]], expected: 2, label: 'Mixed Ops' },
      { input: [["dec", "dec"]], expected: -2, label: 'All Dec' },
      { input: [["inc"]], expected: 1, label: 'Single Inc' },
      { input: [[]], expected: 0, label: 'No Ops' }
    ],
    solutions: {
      python: `def run_counter(ops): return sum(1 if o=="inc" else -1 if o=="dec" else 0 for o in ops)`,
      javascript: `function runCounter(ops) { return ops.reduce((c, o) => o === "inc" ? c+1 : o === "dec" ? c-1 : c, 0); }`,
      java: `// Same as starter`,
      cpp: `// Same as starter`
    },
    xpReward: 75,
    goldReward: 32,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [0, 1, 2, 1, 2] }
  },

  // ==========================================
  // REALM: THE MASTER'S TRIALS (Advanced)
  // ==========================================
  {
    id: 'lesson-11',
    realmId: 'learn-realm-3',
    title: 'The Error Abyss',
    concept: 'Error Handling & Exceptions',
    difficulty: 'Advanced',
    isLesson: true,
    enemy: {
      name: 'Exception Demon',
      avatar: '💀',
      hp: 200,
      quote: 'Your code will crash unless you learn to catch my thrown curses!'
    },
    story: 'Errors crash programs. Exception handling lets you gracefully recover. Write a safe division function that returns -1 on division by zero instead of crashing.',
    prompt: 'Write a function that divides a by b. If b is 0, return -1 instead of crashing.',
    starterCodes: {
      python: `def safe_divide(a: int, b: int) -> int:
    """
    Return a // b (integer division). If b is 0, return -1.
    """
    try:
        return a // b
    except ZeroDivisionError:
        return -1
`,
      javascript: `function safeDivide(a, b) {
  if (b === 0) return -1;
  return Math.floor(a / b);
}
`,
      java: `public static int safeDivide(int a, int b) {
    if (b == 0) return -1;
    return a / b;
}
`,
      cpp: `int safeDivide(int a, int b) {
    if (b == 0) return -1;
    return a / b;
}
`
    },
    functionNames: { python: 'safe_divide', javascript: 'safeDivide', java: 'safeDivide', cpp: 'safeDivide' },
    testCases: [
      { input: [10, 3], expected: 3, label: 'Normal Division' },
      { input: [10, 0], expected: -1, label: 'Divide by Zero' },
      { input: [0, 5], expected: 0, label: 'Zero Numerator' },
      { input: [100, 10], expected: 10, label: 'Even Division' }
    ],
    solutions: {
      python: `def safe_divide(a, b): return a // b if b != 0 else -1`,
      javascript: `function safeDivide(a, b) { return b === 0 ? -1 : Math.floor(a / b); }`,
      java: `public static int safeDivide(int a, int b) { return b == 0 ? -1 : a / b; }`,
      cpp: `int safeDivide(int a, int b) { return b == 0 ? -1 : a / b; }`
    },
    xpReward: 80,
    goldReward: 35,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: [10, 3, 3] }
  },

  {
    id: 'lesson-12',
    realmId: 'learn-realm-3',
    title: 'The Lambda Forge',
    concept: 'Higher-Order Functions & Lambdas',
    difficulty: 'Advanced',
    isLesson: true,
    enemy: {
      name: 'Lambda Weaver',
      avatar: '🕷️',
      hp: 210,
      quote: 'Functions within functions... can you map, filter, and reduce?'
    },
    story: 'Higher-order functions accept or return other functions. Use map/filter patterns to transform data elegantly.',
    prompt: 'Write a function that takes a list of integers and returns a new list containing only the even numbers, each doubled.',
    starterCodes: {
      python: `def filter_double_evens(nums: list) -> list:
    """
    Filter even numbers and double each one.
    Example: [1,2,3,4,5] -> [4, 8]
    """
    return [x * 2 for x in nums if x % 2 == 0]
`,
      javascript: `function filterDoubleEvens(nums) {
  return nums.filter(x => x % 2 === 0).map(x => x * 2);
}
`,
      java: `public static int[] filterDoubleEvens(int[] nums) {
    return java.util.Arrays.stream(nums)
        .filter(x -> x % 2 == 0)
        .map(x -> x * 2)
        .toArray();
}
`,
      cpp: `vector<int> filterDoubleEvens(vector<int> nums) {
    vector<int> result;
    for (int x : nums) {
        if (x % 2 == 0) result.push_back(x * 2);
    }
    return result;
}
`
    },
    functionNames: { python: 'filter_double_evens', javascript: 'filterDoubleEvens', java: 'filterDoubleEvens', cpp: 'filterDoubleEvens' },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [4, 8], label: 'Mixed Array' },
      { input: [[1, 3, 5]], expected: [], label: 'All Odd' },
      { input: [[2, 4, 6]], expected: [4, 8, 12], label: 'All Even' },
      { input: [[0, 1]], expected: [0], label: 'Zero Is Even' }
    ],
    solutions: {
      python: `def filter_double_evens(nums): return [x*2 for x in nums if x%2==0]`,
      javascript: `function filterDoubleEvens(nums) { return nums.filter(x => x%2===0).map(x => x*2); }`,
      java: `// Same as starter`,
      cpp: `// Same as starter`
    },
    xpReward: 85,
    goldReward: 38,
    visualizerType: 'array',
    visualizerConfig: { sampleData: [1, 2, 3, 4, 5] }
  },

  {
    id: 'lesson-13',
    realmId: 'learn-realm-3',
    title: 'The Sorted Blade',
    concept: 'Sorting: Bubble Sort',
    difficulty: 'Advanced',
    isLesson: true,
    enemy: {
      name: 'Chaos Sorter',
      avatar: '🗡️',
      hp: 230,
      quote: 'Disorder is my weapon. Can you restore order element by element?'
    },
    story: 'Implement Bubble Sort: repeatedly swap adjacent elements that are out of order until the array is sorted.',
    prompt: 'Write a function that sorts an array using bubble sort and returns the sorted array.',
    starterCodes: {
      python: `def bubble_sort(arr: list) -> list:
    """
    Sort an array using bubble sort.
    Example: [5, 3, 8, 1] -> [1, 3, 5, 8]
    """
    arr = list(arr)
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`,
      javascript: `function bubbleSort(arr) {
  arr = [...arr];
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
`,
      java: `public static int[] bubbleSort(int[] arr) {
    arr = arr.clone();
    int n = arr.length;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
            }
    return arr;
}
`,
      cpp: `vector<int> bubbleSort(vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);
    return arr;
}
`
    },
    functionNames: { python: 'bubble_sort', javascript: 'bubbleSort', java: 'bubbleSort', cpp: 'bubbleSort' },
    testCases: [
      { input: [[5, 3, 8, 1, 2]], expected: [1, 2, 3, 5, 8], label: 'Mixed Array' },
      { input: [[1, 2, 3]], expected: [1, 2, 3], label: 'Already Sorted' },
      { input: [[3, 2, 1]], expected: [1, 2, 3], label: 'Reverse Sorted' },
      { input: [[42]], expected: [42], label: 'Single Element' }
    ],
    solutions: {
      python: `def bubble_sort(arr): arr = list(arr)\nfor i in range(len(arr)):\n  for j in range(len(arr)-i-1):\n    if arr[j]>arr[j+1]: arr[j],arr[j+1]=arr[j+1],arr[j]\nreturn arr`,
      javascript: `function bubbleSort(a) { a=[...a]; for(let i=0;i<a.length;i++) for(let j=0;j<a.length-i-1;j++) if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]]; return a; }`,
      java: `// Same as starter`,
      cpp: `// Same as starter`
    },
    xpReward: 90,
    goldReward: 40,
    visualizerType: 'array',
    visualizerConfig: { sampleData: [5, 3, 8, 1, 2] }
  },

  {
    id: 'lesson-14',
    realmId: 'learn-realm-3',
    title: 'The FizzBuzz Arena',
    concept: 'Classic FizzBuzz Challenge',
    difficulty: 'Advanced',
    isLesson: true,
    enemy: {
      name: 'FizzBuzz Titan',
      avatar: '🎯',
      hp: 200,
      quote: 'Fizz! Buzz! FizzBuzz! Can you handle the classic interview gauntlet?'
    },
    story: 'The legendary coding interview challenge. For numbers 1 to n, return "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both, and the number itself otherwise.',
    prompt: 'Write a function that takes n and returns a list of FizzBuzz results from 1 to n.',
    starterCodes: {
      python: `def fizzbuzz(n: int) -> list:
    """
    Return FizzBuzz results for numbers 1 to n.
    """
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result
`,
      javascript: `function fizzbuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}
`,
      java: `public static String[] fizzbuzz(int n) {
    String[] result = new String[n];
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) result[i-1] = "FizzBuzz";
        else if (i % 3 == 0) result[i-1] = "Fizz";
        else if (i % 5 == 0) result[i-1] = "Buzz";
        else result[i-1] = String.valueOf(i);
    }
    return result;
}
`,
      cpp: `vector<string> fizzbuzz(int n) {
    vector<string> result;
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) result.push_back("FizzBuzz");
        else if (i % 3 == 0) result.push_back("Fizz");
        else if (i % 5 == 0) result.push_back("Buzz");
        else result.push_back(to_string(i));
    }
    return result;
}
`
    },
    functionNames: { python: 'fizzbuzz', javascript: 'fizzbuzz', java: 'fizzbuzz', cpp: 'fizzbuzz' },
    testCases: [
      { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'], label: 'First 5' },
      { input: [15], expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'], label: 'Full Cycle' },
      { input: [1], expected: ['1'], label: 'Just 1' }
    ],
    solutions: {
      python: `def fizzbuzz(n): return ["FizzBuzz" if i%15==0 else "Fizz" if i%3==0 else "Buzz" if i%5==0 else str(i) for i in range(1,n+1)]`,
      javascript: `function fizzbuzz(n) { return Array.from({length:n},(_,i)=>(i+1)%15===0?"FizzBuzz":(i+1)%3===0?"Fizz":(i+1)%5===0?"Buzz":String(i+1)); }`,
      java: `// Same as starter`,
      cpp: `// Same as starter`
    },
    xpReward: 80,
    goldReward: 35,
    visualizerType: 'dp-table',
    visualizerConfig: { sampleData: ['1', '2', 'F', '4', 'B'] }
  },

  {
    id: 'lesson-15',
    realmId: 'learn-realm-3',
    title: 'The Complexity Oracle',
    concept: 'Binary Search',
    difficulty: 'Advanced',
    isLesson: true,
    enemy: {
      name: 'Big-O Oracle',
      avatar: '🔮',
      hp: 250,
      quote: 'O(n) is too slow! Show me the power of O(log n) with binary search!'
    },
    story: 'The Oracle demands logarithmic efficiency. Implement binary search on a sorted array to find a target element. Return its index, or -1 if not found.',
    prompt: 'Write a binary search function that returns the index of target in a sorted array, or -1 if not found.',
    starterCodes: {
      python: `def binary_search(arr: list, target: int) -> int:
    """
    Binary search in sorted array. Return index of target, or -1.
    """
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
`,
      javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
`,
      java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
`,
      cpp: `int binarySearch(vector<int> arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
`
    },
    functionNames: { python: 'binary_search', javascript: 'binarySearch', java: 'binarySearch', cpp: 'binarySearch' },
    testCases: [
      { input: [[1, 3, 5, 7, 9, 11], 7], expected: 3, label: 'Found Middle' },
      { input: [[1, 3, 5, 7, 9, 11], 1], expected: 0, label: 'First Element' },
      { input: [[1, 3, 5, 7, 9, 11], 11], expected: 5, label: 'Last Element' },
      { input: [[1, 3, 5, 7, 9, 11], 4], expected: -1, label: 'Not Found' },
      { input: [[], 5], expected: -1, label: 'Empty Array' }
    ],
    solutions: {
      python: `def binary_search(arr, target):\n    l, r = 0, len(arr) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if arr[m] == target: return m\n        elif arr[m] < target: l = m + 1\n        else: r = m - 1\n    return -1`,
      javascript: `function binarySearch(arr, target) { let l=0, r=arr.length-1; while(l<=r){const m=Math.floor((l+r)/2); if(arr[m]===target)return m; arr[m]<target?l=m+1:r=m-1;} return -1; }`,
      java: `// Same as starter`,
      cpp: `// Same as starter`
    },
    xpReward: 100,
    goldReward: 45,
    relicUnlock: {
      name: 'Scroll of Binary Wisdom',
      description: 'Master of O(log n) search — your coding journey is complete!'
    },
    visualizerType: 'array',
    visualizerConfig: { sampleData: [1, 3, 5, 7, 9, 11], pointers: ['left', 'mid', 'right'] }
  }
];
