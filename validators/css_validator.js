const css = require('css');

/**
 * CSS Validator - Validates CSS syntax and structure
 */
class CSSValidator {
    /**
     * Validate CSS code for syntax errors
     * @param {string} cssCode - The CSS code to validate
     * @returns {Object} - Validation result with success status and errors
     */
    static validate(cssCode) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        try {
            // Basic structure validation
            if (!cssCode || typeof cssCode !== 'string') {
                result.isValid = false;
                result.errors.push('CSS code must be a non-empty string');
                return result;
            }

            // Parse CSS using css library
            const ast = css.parse(cssCode, {
                silent: true // Don't throw on errors, collect them instead
            });

            // Check for parsing errors
            if (ast.parsingErrors && ast.parsingErrors.length > 0) {
                ast.parsingErrors.forEach(error => {
                    result.errors.push(`CSS parsing error at line ${error.line}: ${error.message}`);
                });
                result.isValid = false;
            }

            // Additional syntax validation
            const syntaxErrors = this.checkSyntaxErrors(cssCode);
            if (syntaxErrors.length > 0) {
                result.errors.push(...syntaxErrors);
                result.isValid = false;
            }

            // Check for common CSS mistakes
            const commonErrors = this.checkCommonErrors(cssCode);
            if (commonErrors.length > 0) {
                result.errors.push(...commonErrors);
                result.isValid = false;
            }

            // Best practice warnings
            const warnings = this.checkBestPractices(cssCode, ast);
            result.warnings.push(...warnings);

        } catch (error) {
            result.isValid = false;
            result.errors.push(`CSS validation error: ${error.message}`);
        }

        return result;
    }

    /**
     * Check for basic syntax errors
     */
    static checkSyntaxErrors(cssCode) {
        const errors = [];

        // Check for unmatched braces
        const openBraces = (cssCode.match(/{/g) || []).length;
        const closeBraces = (cssCode.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
            errors.push(`Unmatched braces: ${openBraces} opening, ${closeBraces} closing`);
        }

        // Check for unmatched parentheses
        const openParens = (cssCode.match(/\(/g) || []).length;
        const closeParens = (cssCode.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
            errors.push(`Unmatched parentheses: ${openParens} opening, ${closeParens} closing`);
        }

        // Check for unterminated strings
        const singleQuotes = (cssCode.match(/'/g) || []).length;
        const doubleQuotes = (cssCode.match(/"/g) || []).length;
        
        if (singleQuotes % 2 !== 0) {
            errors.push('Unterminated single-quoted string');
        }
        if (doubleQuotes % 2 !== 0) {
            errors.push('Unterminated double-quoted string');
        }

        // Check for invalid property declarations (missing colons)
        const lines = cssCode.split('\n');
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('/*') && !trimmed.includes('*/')) {
                // Inside CSS rule, check for property declarations
                if (trimmed.includes('{') || trimmed.includes('}')) return;
                
                // Look for potential property declarations missing colons
                const propertyPattern = /^[a-zA-Z-]+\s+[^:;]+;?\s*$/;
                if (propertyPattern.test(trimmed) && !trimmed.includes(':')) {
                    errors.push(`Missing colon in property declaration at line ${index + 1}: ${trimmed}`);
                }
            }
        });

        return errors;
    }

    /**
     * Check for common CSS errors
     */
    static checkCommonErrors(cssCode) {
        const errors = [];

        // Check for duplicate selectors (basic check)
        const selectorPattern = /([^{}]+)\s*{/g;
        const selectors = [];
        let match;

        while ((match = selectorPattern.exec(cssCode)) !== null) {
            const selector = match[1].trim();
            if (selectors.includes(selector)) {
                errors.push(`Duplicate selector: ${selector}`);
            }
            selectors.push(selector);
        }

        // Check for invalid property values
        const propertyValuePattern = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
        while ((match = propertyValuePattern.exec(cssCode)) !== null) {
            const property = match[1].toLowerCase();
            const value = match[2].trim();

            // Check for common invalid values
            if (property === 'color' && value && !this.isValidColor(value)) {
                errors.push(`Invalid color value: ${property}: ${value}`);
            }

            if (property.includes('margin') || property.includes('padding')) {
                if (value && !this.isValidSpacing(value)) {
                    errors.push(`Invalid spacing value: ${property}: ${value}`);
                }
            }
        }

        return errors;
    }

    /**
     * Check for CSS best practices
     */
    static checkBestPractices(cssCode, ast) {
        const warnings = [];

        // Check for !important usage
        const importantCount = (cssCode.match(/!important/g) || []).length;
        if (importantCount > 0) {
            warnings.push(`Found ${importantCount} !important declarations - consider avoiding for maintainability`);
        }

        // Check for very long selectors
        const selectorPattern = /([^{}]+)\s*{/g;
        let match;
        while ((match = selectorPattern.exec(cssCode)) !== null) {
            const selector = match[1].trim();
            if (selector.split(' ').length > 4) {
                warnings.push(`Long selector chain may affect performance: ${selector}`);
            }
        }

        // Check for missing semicolons
        const lines = cssCode.split('\n');
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed && trimmed.includes(':') && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
                warnings.push(`Missing semicolon at line ${index + 1}: ${trimmed}`);
            }
        });

        return warnings;
    }

    /**
     * Basic color value validation
     */
    static isValidColor(value) {
        // Basic validation for common color formats
        const colorPatterns = [
            /^#[0-9a-fA-F]{3}$/, // #rgb
            /^#[0-9a-fA-F]{6}$/, // #rrggbb
            /^rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, // rgb()
            /^rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[01]?\.?\d*\s*\)$/, // rgba()
            /^hsl\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, // hsl()
            /^hsla\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[01]?\.?\d*\s*\)$/ // hsla()
        ];

        const namedColors = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray', 'grey', 'transparent', 'inherit', 'initial', 'unset'];
        
        return colorPatterns.some(pattern => pattern.test(value)) || 
               namedColors.includes(value.toLowerCase());
    }

    /**
     * Basic spacing value validation
     */
    static isValidSpacing(value) {
        // Basic validation for spacing values
        const spacingPattern = /^(\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)|0|auto|inherit|initial|unset)(\s+(\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)|0|auto|inherit|initial|unset)){0,3}$/;
        
        return spacingPattern.test(value.trim());
    }
}

module.exports = CSSValidator;