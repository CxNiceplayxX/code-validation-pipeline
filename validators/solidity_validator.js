/**
 * Solidity Validator - Validates Solidity smart contract syntax and structure
 */
class SolidityValidator {
    /**
     * Validate Solidity code for syntax errors
     * @param {string} solidityCode - The Solidity code to validate
     * @returns {Object} - Validation result with success status and errors
     */
    static validate(solidityCode) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        try {
            // Basic structure validation
            if (!solidityCode || typeof solidityCode !== 'string') {
                result.isValid = false;
                result.errors.push('Solidity code must be a non-empty string');
                return result;
            }

            // Check for basic Solidity structure
            const hasPragma = /pragma\s+solidity\s+[\^~>=<]*\d+\.\d+\.\d+/i.test(solidityCode);
            if (!hasPragma) {
                result.warnings.push('Missing pragma solidity version directive');
            }

            // Check basic syntax errors
            const syntaxErrors = this.checkSyntaxErrors(solidityCode);
            if (syntaxErrors.length > 0) {
                result.errors.push(...syntaxErrors);
                result.isValid = false;
            }

            // Check Solidity-specific errors
            const solidityErrors = this.checkSolidityErrors(solidityCode);
            if (solidityErrors.length > 0) {
                result.errors.push(...solidityErrors);
                result.isValid = false;
            }

            // Check for security issues and best practices
            const securityWarnings = this.checkSecurityBestPractices(solidityCode);
            result.warnings.push(...securityWarnings);

        } catch (error) {
            result.isValid = false;
            result.errors.push(`Solidity validation error: ${error.message}`);
        }

        return result;
    }

    /**
     * Check for basic syntax errors
     */
    static checkSyntaxErrors(solidityCode) {
        const errors = [];

        // Check for unmatched braces
        const openBraces = (solidityCode.match(/{/g) || []).length;
        const closeBraces = (solidityCode.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
            errors.push(`Unmatched braces: ${openBraces} opening, ${closeBraces} closing`);
        }

        // Check for unmatched parentheses
        const openParens = (solidityCode.match(/\(/g) || []).length;
        const closeParens = (solidityCode.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
            errors.push(`Unmatched parentheses: ${openParens} opening, ${closeParens} closing`);
        }

        // Check for unmatched brackets
        const openBrackets = (solidityCode.match(/\[/g) || []).length;
        const closeBrackets = (solidityCode.match(/\]/g) || []).length;
        
        if (openBrackets !== closeBrackets) {
            errors.push(`Unmatched brackets: ${openBrackets} opening, ${closeBrackets} closing`);
        }

        // Check for unterminated strings
        const singleQuotes = this.countUnescapedChars(solidityCode, "'");
        const doubleQuotes = this.countUnescapedChars(solidityCode, '"');
        
        if (singleQuotes % 2 !== 0) {
            errors.push('Unterminated single-quoted string');
        }
        if (doubleQuotes % 2 !== 0) {
            errors.push('Unterminated double-quoted string');
        }

        return errors;
    }

    /**
     * Check for Solidity-specific errors
     */
    static checkSolidityErrors(solidityCode) {
        const errors = [];

        // Check for missing contract declaration
        const hasContract = /contract\s+\w+/i.test(solidityCode) || 
                          /interface\s+\w+/i.test(solidityCode) || 
                          /library\s+\w+/i.test(solidityCode);
        
        if (!hasContract && solidityCode.length > 100) {
            errors.push('Missing contract, interface, or library declaration');
        }

        // Check for invalid function visibility
        const functionPattern = /function\s+\w+\s*\([^)]*\)([^{]*){/g;
        let match;
        
        while ((match = functionPattern.exec(solidityCode)) !== null) {
            const functionSignature = match[0];
            const modifiers = match[1] || '';
            
            // Check if function has visibility modifier
            const hasVisibility = /\b(public|private|internal|external)\b/i.test(modifiers);
            if (!hasVisibility && !modifiers.includes('constructor')) {
                errors.push(`Function missing visibility modifier: ${functionSignature.split('{')[0]}`);
            }
        }

        // Check for invalid data locations
        const invalidDataLocation = /\b(string|bytes|array)\s+\w+(?!\s+(memory|storage|calldata))/g;
        while ((match = invalidDataLocation.exec(solidityCode)) !== null) {
            errors.push(`Missing data location for reference type: ${match[0]}`);
        }

        // Check for outdated syntax
        const outdatedPatterns = [
            {
                pattern: /var\s+\w+/g,
                message: 'Use of "var" is deprecated, specify explicit types'
            },
            {
                pattern: /throw\s*;/g,
                message: 'Use of "throw" is deprecated, use "revert()" instead'
            },
            {
                pattern: /suicide\s*\(/g,
                message: 'Use of "suicide" is deprecated, use "selfdestruct" instead'
            }
        ];

        outdatedPatterns.forEach(({ pattern, message }) => {
            const matches = solidityCode.match(pattern);
            if (matches) {
                errors.push(`${message}: found ${matches.length} occurrences`);
            }
        });

        // Check for invalid pragma format
        const pragmaMatches = solidityCode.match(/pragma\s+solidity\s+([^;]+);/gi);
        if (pragmaMatches) {
            pragmaMatches.forEach(pragma => {
                const versionPart = pragma.match(/pragma\s+solidity\s+([^;]+);/i)[1];
                if (!this.isValidSolidityVersion(versionPart)) {
                    errors.push(`Invalid pragma solidity version format: ${pragma}`);
                }
            });
        }

        return errors;
    }

    /**
     * Check for security issues and best practices
     */
    static checkSecurityBestPractices(solidityCode) {
        const warnings = [];

        // Check for potential reentrancy issues
        const externalCalls = solidityCode.match(/\.call\s*\(|\.delegatecall\s*\(|\.send\s*\(|\.transfer\s*\(/g);
        if (externalCalls && externalCalls.length > 0) {
            warnings.push(`Found ${externalCalls.length} external calls - review for reentrancy vulnerabilities`);
        }

        // Check for tx.origin usage
        const txOriginUsage = (solidityCode.match(/tx\.origin/g) || []).length;
        if (txOriginUsage > 0) {
            warnings.push(`Found ${txOriginUsage} uses of tx.origin - consider using msg.sender instead`);
        }

        // Check for block timestamp dependency
        const timestampUsage = (solidityCode.match(/block\.timestamp|now\b/g) || []).length;
        if (timestampUsage > 0) {
            warnings.push(`Found ${timestampUsage} uses of block.timestamp - be aware of miner manipulation risks`);
        }

        // Check for floating pragma
        const floatingPragma = /pragma\s+solidity\s+\^/i.test(solidityCode);
        if (floatingPragma) {
            warnings.push('Using floating pragma (^) - consider pinning to specific version for production');
        }

        // Check for missing events on state changes
        const stateVarPattern = /\b\w+\s*=\s*[^;]+;/g;
        const eventPattern = /emit\s+\w+\s*\(/g;
        
        const stateChanges = (solidityCode.match(stateVarPattern) || []).length;
        const events = (solidityCode.match(eventPattern) || []).length;
        
        if (stateChanges > events + 2) { // Allow some margin
            warnings.push('Consider emitting events for important state changes for better transparency');
        }

        // Check for hardcoded addresses
        const addressPattern = /0x[0-9a-fA-F]{40}/g;
        const addresses = solidityCode.match(addressPattern);
        if (addresses && addresses.length > 0) {
            warnings.push(`Found ${addresses.length} hardcoded addresses - consider using parameters or constants`);
        }

        // Check for missing NatSpec documentation
        const functions = (solidityCode.match(/function\s+\w+/g) || []).length;
        const natspecComments = (solidityCode.match(/\/\*\*[\s\S]*?\*\//g) || []).length;
        
        if (functions > natspecComments && functions > 1) {
            warnings.push('Consider adding NatSpec documentation for better code documentation');
        }

        // Check for gas optimization opportunities
        if (solidityCode.includes('for') && solidityCode.includes('.length')) {
            warnings.push('Consider caching array length in loops for gas optimization');
        }

        // Check for unsafe arithmetic
        if (!/SafeMath|checked/i.test(solidityCode) && /[\+\-\*\/]/g.test(solidityCode)) {
            const arithmeticOps = (solidityCode.match(/[\+\-\*\/]/g) || []).length;
            if (arithmeticOps > 5) {
                warnings.push('Consider using SafeMath or checked arithmetic to prevent overflow/underflow');
            }
        }

        return warnings;
    }

    /**
     * Validate Solidity version format
     */
    static isValidSolidityVersion(versionString) {
        // Basic validation for Solidity version formats
        const patterns = [
            /^\d+\.\d+\.\d+$/, // exact version: 0.8.0
            /^\^\d+\.\d+\.\d+$/, // caret range: ^0.8.0
            /^>=\d+\.\d+\.\d+\s+<\d+\.\d+\.\d+$/, // range: >=0.8.0 <0.9.0
            /^>=\d+\.\d+\.\d+$/, // minimum: >=0.8.0
            /^<\d+\.\d+\.\d+$/, // maximum: <0.9.0
            /^~\d+\.\d+\.\d+$/ // tilde range: ~0.8.0
        ];

        return patterns.some(pattern => pattern.test(versionString.trim()));
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
}

module.exports = SolidityValidator;