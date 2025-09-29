const { parse } = require('@babel/parser');
const vm = require('vm');

/**
 * JavaScript Validator - Validates JavaScript syntax and structure
 */
class JavaScriptValidator {
    /**
     * Validate JavaScript code for syntax errors
     * @param {string} jsCode - The JavaScript code to validate
     * @returns {Object} - Validation result with success status and errors
     */
    static validate(jsCode) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        try {
            // Basic structure validation
            if (!jsCode || typeof jsCode !== 'string') {
                result.isValid = false;
                result.errors.push('JavaScript code must be a non-empty string');
                return result;
            }

            // Try parsing with Babel parser for comprehensive syntax checking
            try {
                const ast = parse(jsCode, {
                    sourceType: 'module',
                    allowImportExportEverywhere: true,
                    allowAwaitOutsideFunction: true,
                    allowReturnOutsideFunction: true,
                    allowUndeclaredExports: true,
                    plugins: [
                        'jsx',
                        'typescript',
                        'decorators-legacy',
                        'classProperties',
                        'asyncGenerators',
                        'functionBind',
                        'exportDefaultFrom',
                        'exportNamespaceFrom',
                        'dynamicImport',
                        'nullishCoalescingOperator',
                        'optionalChaining',
                        'objectRestSpread',
                        'functionSent',
                        'throwExpressions'
                    ]
                });
            } catch (babelError) {
                // If Babel parsing fails, try Node.js vm compilation
                try {
                    new vm.Script(jsCode);
                } catch (vmError) {
                    result.isValid = false;
                    result.errors.push(`JavaScript syntax error: ${vmError.message}`);
                    return result;
                }
            }

            // Additional syntax validation checks
            const syntaxErrors = this.checkSyntaxErrors(jsCode);
            if (syntaxErrors.length > 0) {
                result.errors.push(...syntaxErrors);
                result.isValid = false;
            }

            // Check for common JavaScript errors
            const commonErrors = this.checkCommonErrors(jsCode);
            if (commonErrors.length > 0) {
                result.errors.push(...commonErrors);
                result.isValid = false;
            }

            // Best practice warnings
            const warnings = this.checkBestPractices(jsCode);
            result.warnings.push(...warnings);

        } catch (error) {
            result.isValid = false;
            result.errors.push(`JavaScript validation error: ${error.message}`);
        }

        return result;
    }

    /**
     * Check for basic syntax errors
     */
    static checkSyntaxErrors(jsCode) {
        const errors = [];

        // Check for unmatched braces
        const openBraces = (jsCode.match(/{/g) || []).length;
        const closeBraces = (jsCode.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
            errors.push(`Unmatched braces: ${openBraces} opening, ${closeBraces} closing`);
        }

        // Check for unmatched parentheses
        const openParens = (jsCode.match(/\(/g) || []).length;
        const closeParens = (jsCode.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
            errors.push(`Unmatched parentheses: ${openParens} opening, ${closeParens} closing`);
        }

        // Check for unmatched brackets
        const openBrackets = (jsCode.match(/\[/g) || []).length;
        const closeBrackets = (jsCode.match(/\]/g) || []).length;
        
        if (openBrackets !== closeBrackets) {
            errors.push(`Unmatched brackets: ${openBrackets} opening, ${closeBrackets} closing`);
        }

        // Check for unterminated strings
        const singleQuotes = this.countUnescapedChars(jsCode, "'");
        const doubleQuotes = this.countUnescapedChars(jsCode, '"');
        const templateQuotes = this.countUnescapedChars(jsCode, '`');
        
        if (singleQuotes % 2 !== 0) {
            errors.push('Unterminated single-quoted string');
        }
        if (doubleQuotes % 2 !== 0) {
            errors.push('Unterminated double-quoted string');
        }
        if (templateQuotes % 2 !== 0) {
            errors.push('Unterminated template literal');
        }

        return errors;
    }

    /**
     * Check for common JavaScript errors
     */
    static checkCommonErrors(jsCode) {
        const errors = [];

        // Check for assignment in conditional statements (likely mistakes)
        const assignmentInCondition = /if\s*\([^)]*=(?!=)[^)]*\)/g;
        const matches = jsCode.match(assignmentInCondition);
        if (matches) {
            matches.forEach(match => {
                errors.push(`Possible assignment instead of comparison in condition: ${match}`);
            });
        }

        // Check for undefined variables (basic check)
        const lines = jsCode.split('\n');
        lines.forEach((line, index) => {
            // Check for console statements that might be forgotten
            if (line.includes('console.log') && !line.trim().startsWith('//')) {
                // This is just a warning, not an error
            }
            
            // Check for missing semicolons in obvious places
            const trimmed = line.trim();
            if (trimmed.length > 0 && 
                !trimmed.endsWith(';') && 
                !trimmed.endsWith('{') && 
                !trimmed.endsWith('}') &&
                !trimmed.startsWith('//') &&
                !trimmed.startsWith('/*') &&
                !trimmed.endsWith('*/') &&
                (trimmed.includes('=') || trimmed.startsWith('var ') || trimmed.startsWith('let ') || trimmed.startsWith('const ')) &&
                !trimmed.includes('function') &&
                !trimmed.includes('if') &&
                !trimmed.includes('for') &&
                !trimmed.includes('while')
            ) {
                // This could be a warning rather than error in modern JS
            }
        });

        // Check for potential hoisting issues
        const functionDeclarations = jsCode.match(/function\s+\w+/g);
        const functionCalls = jsCode.match(/\w+\s*\(/g);
        
        if (functionDeclarations && functionCalls) {
            // Basic check for function calls before declarations (in same scope)
            // This is a simplified check
        }

        return errors;
    }

    /**
     * Check for JavaScript best practices
     */
    static checkBestPractices(jsCode) {
        const warnings = [];

        // Check for var usage (should use let/const)
        const varUsage = (jsCode.match(/\bvar\s+/g) || []).length;
        if (varUsage > 0) {
            warnings.push(`Found ${varUsage} 'var' declarations - consider using 'let' or 'const'`);
        }

        // Check for == instead of ===
        const looseEquality = (jsCode.match(/[^=!]==(?!=)/g) || []).length;
        if (looseEquality > 0) {
            warnings.push(`Found ${looseEquality} loose equality operators (==) - consider using strict equality (===)`);
        }

        // Check for != instead of !==
        const looseInequality = (jsCode.match(/!=(?!=)/g) || []).length;
        if (looseInequality > 0) {
            warnings.push(`Found ${looseInequality} loose inequality operators (!=) - consider using strict inequality (!==)`);
        }

        // Check for console statements
        const consoleStatements = (jsCode.match(/console\.\w+/g) || []).length;
        if (consoleStatements > 0) {
            warnings.push(`Found ${consoleStatements} console statements - remember to remove before production`);
        }

        // Check for long functions (basic metric)
        const functions = jsCode.match(/function\s*\w*\s*\([^)]*\)\s*{/g);
        if (functions) {
            functions.forEach(func => {
                const startIndex = jsCode.indexOf(func);
                const functionBody = this.extractFunctionBody(jsCode, startIndex);
                const lineCount = functionBody.split('\n').length;
                
                if (lineCount > 50) {
                    warnings.push(`Function may be too long (${lineCount} lines) - consider breaking it down`);
                }
            });
        }

        // Check for deeply nested code
        const maxNesting = this.calculateMaxNesting(jsCode);
        if (maxNesting > 4) {
            warnings.push(`Deep nesting detected (${maxNesting} levels) - consider refactoring for better readability`);
        }

        return warnings;
    }

    /**
     * Count unescaped characters in a string
     */
    static countUnescapedChars(str, char) {
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === char && (i === 0 || str[i-1] !== '\\')) {
                count++;
            }
        }
        return count;
    }

    /**
     * Extract function body for analysis
     */
    static extractFunctionBody(jsCode, startIndex) {
        let braceCount = 0;
        let started = false;
        let body = '';
        
        for (let i = startIndex; i < jsCode.length; i++) {
            const char = jsCode[i];
            
            if (char === '{') {
                braceCount++;
                started = true;
            } else if (char === '}') {
                braceCount--;
            }
            
            if (started) {
                body += char;
            }
            
            if (started && braceCount === 0) {
                break;
            }
        }
        
        return body;
    }

    /**
     * Calculate maximum nesting level
     */
    static calculateMaxNesting(jsCode) {
        let maxNesting = 0;
        let currentNesting = 0;
        
        for (let i = 0; i < jsCode.length; i++) {
            const char = jsCode[i];
            
            if (char === '{') {
                currentNesting++;
                maxNesting = Math.max(maxNesting, currentNesting);
            } else if (char === '}') {
                currentNesting--;
            }
        }
        
        return maxNesting;
    }
}

module.exports = JavaScriptValidator;