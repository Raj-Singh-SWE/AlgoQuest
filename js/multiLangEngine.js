/**
 * AlgoQuest Multi-Language Code Execution Engine
 * Supports Python (Pyodide WASM), JavaScript (native), Java & C++ (Piston API).
 */

class MultiLangEngine {
  constructor() {
    this.currentLanguage = localStorage.getItem('algoquest_language') || 'python';
    this.onStatusChange = null;

    // Language metadata
    this.languages = {
      python: {
        id: 'python',
        label: 'Python',
        icon: '🐍',
        color: '#3572A5',
        fileExt: '.py',
        monacoId: 'python',
        pistonLang: 'python',
        pistonVersion: '3.10.0'
      },
      javascript: {
        id: 'javascript',
        label: 'JavaScript',
        icon: '📜',
        color: '#f1e05a',
        fileExt: '.js',
        monacoId: 'javascript',
        pistonLang: 'javascript',
        pistonVersion: '18.15.0'
      },
      java: {
        id: 'java',
        label: 'Java',
        icon: '☕',
        color: '#b07219',
        fileExt: '.java',
        monacoId: 'java',
        pistonLang: 'java',
        pistonVersion: '15.0.2'
      },
      cpp: {
        id: 'cpp',
        label: 'C++',
        icon: '⚙️',
        color: '#f34b7d',
        fileExt: '.cpp',
        monacoId: 'cpp',
        pistonLang: 'c++',
        pistonVersion: '10.2.0'
      }
    };
  }

  setLanguage(langId) {
    if (this.languages[langId]) {
      this.currentLanguage = langId;
      localStorage.setItem('algoquest_language', langId);
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getLanguageMeta(langId) {
    return this.languages[langId || this.currentLanguage];
  }

  getAllLanguages() {
    return Object.values(this.languages);
  }

  /**
   * Main entry: run user code against a level's test cases in the current language.
   */
  async runTests(userCode, level) {
    const lang = this.currentLanguage;
    const startTime = performance.now();

    switch (lang) {
      case 'python':
        return await this.runPythonTests(userCode, level, startTime);
      case 'javascript':
        return await this.runJavaScriptTests(userCode, level, startTime);
      case 'java':
      case 'cpp':
        return await this.runPistonTests(userCode, level, lang, startTime);
      default:
        return this.makeErrorResult(level, 'Unsupported language: ' + lang, startTime);
    }
  }

  // ==========================================
  // PYTHON — Delegates to existing Pyodide engine
  // ==========================================
  async runPythonTests(userCode, level, startTime) {
    if (window.pythonEngine) {
      return await window.pythonEngine.runLevelTests(userCode, level);
    }
    return this.makeErrorResult(level, 'Python engine not initialized', startTime);
  }

  // ==========================================
  // JAVASCRIPT — Native browser sandbox
  // ==========================================
  async runJavaScriptTests(userCode, level, startTime) {
    const results = [];
    let allPassed = true;
    let capturedLogs = [];

    for (let i = 0; i < level.testCases.length; i++) {
      const tc = level.testCases[i];
      const tcStart = performance.now();
      let actual = null;
      let error = null;
      let passed = false;

      try {
        capturedLogs = [];
        const mockConsole = {
          log: (...args) => capturedLogs.push(args.map(String).join(' ')),
          warn: (...args) => capturedLogs.push('[WARN] ' + args.map(String).join(' ')),
          error: (...args) => capturedLogs.push('[ERROR] ' + args.map(String).join(' '))
        };

        // Get the function name for this level
        const fnName = level.functionNames?.javascript || level.functionNames?.python || this.extractFunctionName(userCode);

        // Create a sandboxed function with captured console
        const wrappedCode = `
          "use strict";
          const console = __mockConsole__;
          ${userCode}
          return typeof ${fnName} === 'function' ? ${fnName}(...__args__) : undefined;
        `;

        const sandboxFn = new Function('__mockConsole__', '__args__', wrappedCode);
        const inputCopy = JSON.parse(JSON.stringify(tc.input));
        actual = sandboxFn(mockConsole, inputCopy);
        passed = this.deepEqual(actual, tc.expected);
      } catch (e) {
        error = e.message || String(e);
        passed = false;
      }

      if (!passed) allPassed = false;

      results.push({
        caseNumber: i + 1,
        label: tc.label,
        input: tc.input,
        expected: tc.expected,
        actual,
        passed,
        timeMs: (performance.now() - tcStart).toFixed(2),
        error
      });
    }

    return {
      passed: allPassed,
      totalPassed: results.filter(r => r.passed).length,
      totalCases: results.length,
      results,
      stdout: capturedLogs.join('\n'),
      error: null,
      durationMs: (performance.now() - startTime).toFixed(1)
    };
  }

  // ==========================================
  // JAVA / C++ — Piston API remote execution
  // ==========================================
  async runPistonTests(userCode, level, lang, startTime) {
    const results = [];
    let allPassed = true;
    let combinedStdout = '';

    const langMeta = this.languages[lang];
    const fnName = level.functionNames?.[lang] || level.functionNames?.javascript || 'solve';

    for (let i = 0; i < level.testCases.length; i++) {
      const tc = level.testCases[i];
      const tcStart = performance.now();
      let actual = null;
      let error = null;
      let passed = false;

      try {
        // Build the complete source file with test harness
        const fullSource = this.buildPistonSource(userCode, tc, lang, fnName);

        // Call Piston API
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: langMeta.pistonLang,
            version: langMeta.pistonVersion,
            files: [{ content: fullSource }],
            stdin: '',
            args: [],
            compile_timeout: 10000,
            run_timeout: 5000
          })
        });

        if (!response.ok) {
          throw new Error(`Piston API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.compile && data.compile.stderr) {
          error = data.compile.stderr;
        } else if (data.run && data.run.stderr) {
          error = data.run.stderr;
        } else if (data.run && data.run.output !== undefined) {
          const outputStr = data.run.output.trim();
          combinedStdout += outputStr + '\n';

          // Parse the output — we expect the last line to be the JSON result
          const outputLines = outputStr.split('\n');
          const resultLine = outputLines[outputLines.length - 1];

          try {
            actual = JSON.parse(resultLine);
          } catch {
            actual = resultLine;
          }

          passed = this.deepEqual(actual, tc.expected);
        }
      } catch (e) {
        error = e.message || String(e);
        if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
          error = 'Network error: Java/C++ execution requires internet (Piston API). Please check your connection.';
        }
        passed = false;
      }

      if (!passed) allPassed = false;

      results.push({
        caseNumber: i + 1,
        label: tc.label,
        input: tc.input,
        expected: tc.expected,
        actual,
        passed,
        timeMs: (performance.now() - tcStart).toFixed(2),
        error
      });
    }

    return {
      passed: allPassed,
      totalPassed: results.filter(r => r.passed).length,
      totalCases: results.length,
      results,
      stdout: combinedStdout,
      error: null,
      durationMs: (performance.now() - startTime).toFixed(1)
    };
  }

  /**
   * Wrap user code + test invocation for Piston API execution.
   */
  buildPistonSource(userCode, testCase, lang, fnName) {
    const inputJson = JSON.stringify(testCase.input);

    if (lang === 'java') {
      return `
import java.util.*;
import com.google.gson.Gson;

public class Main {
    ${userCode}

    public static void main(String[] args) {
        // For simplicity, we print the expected-format result
        // The user's function is called with the test input
        try {
            ${this.buildJavaTestCall(fnName, testCase)}
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}`;
    }

    if (lang === 'cpp') {
      return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <stack>
#include <queue>
#include <sstream>
using namespace std;

${userCode}

int main() {
    try {
        ${this.buildCppTestCall(fnName, testCase)}
    } catch (const exception& e) {
        cerr << e.what() << endl;
    }
    return 0;
}`;
    }

    return userCode;
  }

  buildJavaTestCall(fnName, tc) {
    // Simplified: print the result as JSON-ish string for comparison
    const input = tc.input;
    if (Array.isArray(tc.expected)) {
      return `
            int[] input = new int[]{${input[0].join(', ')}};
            int[] result = ${fnName}(input);
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < result.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(result[i]);
            }
            sb.append("]");
            System.out.println(sb.toString());
      `;
    }
    if (typeof tc.expected === 'number') {
      if (input.length === 1 && Array.isArray(input[0])) {
        return `
            int[] input = new int[]{${input[0].join(', ')}};
            int result = ${fnName}(input);
            System.out.println(result);
        `;
      }
      if (input.length === 1 && typeof input[0] === 'number') {
        return `
            int result = ${fnName}(${input[0]});
            System.out.println(result);
        `;
      }
    }
    if (typeof tc.expected === 'boolean') {
      return `
            boolean result = ${fnName}("${input[0]}");
            System.out.println(result);
      `;
    }
    // Generic fallback
    return `System.out.println("unsupported");`;
  }

  buildCppTestCall(fnName, tc) {
    const input = tc.input;
    if (Array.isArray(tc.expected)) {
      return `
        vector<int> input = {${input[0].join(', ')}};
        vector<int> result = ${fnName}(input);
        cout << "[";
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) cout << ",";
            cout << result[i];
        }
        cout << "]" << endl;
      `;
    }
    if (typeof tc.expected === 'number') {
      if (input.length === 1 && Array.isArray(input[0])) {
        return `
        vector<int> input = {${input[0].join(', ')}};
        int result = ${fnName}(input);
        cout << result << endl;
        `;
      }
      if (input.length === 1 && typeof input[0] === 'number') {
        return `
        int result = ${fnName}(${input[0]});
        cout << result << endl;
        `;
      }
    }
    if (typeof tc.expected === 'boolean') {
      return `
        string s = "${input[0]}";
        bool result = ${fnName}(s);
        cout << (result ? "true" : "false") << endl;
      `;
    }
    return `cout << "unsupported" << endl;`;
  }

  // Utility: extract function name from code
  extractFunctionName(code) {
    // Python: def func_name(
    let match = code.match(/def\s+(\w+)\s*\(/);
    if (match) return match[1];
    // JS: function funcName( or const funcName =
    match = code.match(/function\s+(\w+)\s*\(/);
    if (match) return match[1];
    match = code.match(/(?:const|let|var)\s+(\w+)\s*=/);
    if (match) return match[1];
    return 'solve';
  }

  // Deep equality check
  deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;

    // Handle boolean vs string comparison from Piston
    if (typeof a === 'string' && typeof b === 'boolean') {
      return (a === 'true' && b === true) || (a === 'false' && b === false);
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const k of keysA) {
        if (!this.deepEqual(a[k], b[k])) return false;
      }
      return true;
    }
    return false;
  }

  makeErrorResult(level, errorMsg, startTime) {
    return {
      passed: false,
      totalPassed: 0,
      totalCases: level.testCases.length,
      results: [],
      stdout: '',
      error: errorMsg,
      durationMs: (performance.now() - startTime).toFixed(1)
    };
  }
}

window.multiLangEngine = new MultiLangEngine();
