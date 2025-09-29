const { JSDOM } = require('jsdom');

/**
 * HTML Validator - Validates HTML syntax and structure
 */
class HTMLValidator {
    /**
     * Validate HTML code for syntax errors
     * @param {string} htmlCode - The HTML code to validate
     * @returns {Object} - Validation result with success status and errors
     */
    static validate(htmlCode) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        try {
            // Basic structure validation
            if (!htmlCode || typeof htmlCode !== 'string') {
                result.isValid = false;
                result.errors.push('HTML code must be a non-empty string');
                return result;
            }

            // Check for basic HTML structure
            const hasHtml = /<html[\s>]/i.test(htmlCode) || htmlCode.trim().startsWith('<!DOCTYPE');
            const hasHead = /<head[\s>]/i.test(htmlCode);
            const hasBody = /<body[\s>]/i.test(htmlCode);

            // Use JSDOM to parse and validate
            const dom = new JSDOM(htmlCode, {
                includeNodeLocations: true,
                storageQuota: 10000000
            });

            // Check for parsing errors by examining the DOM
            const document = dom.window.document;
            
            // Look for parse errors in the DOM
            const parseErrors = this.checkForParseErrors(document);
            if (parseErrors.length > 0) {
                result.errors.push(...parseErrors);
                result.isValid = false;
            }

            // Check for unclosed tags
            const unclosedTags = this.checkUnclosedTags(htmlCode);
            if (unclosedTags.length > 0) {
                result.errors.push(...unclosedTags);
                result.isValid = false;
            }

            // Check for malformed attributes
            const malformedAttrs = this.checkMalformedAttributes(htmlCode);
            if (malformedAttrs.length > 0) {
                result.errors.push(...malformedAttrs);
                result.isValid = false;
            }

            // Warnings for best practices
            if (!hasHtml && htmlCode.length > 50) {
                result.warnings.push('Missing <html> tag for complete document');
            }
            if (!hasHead && hasHtml) {
                result.warnings.push('Missing <head> section');
            }
            if (!hasBody && hasHtml) {
                result.warnings.push('Missing <body> section');
            }

        } catch (error) {
            result.isValid = false;
            result.errors.push(`HTML parsing error: ${error.message}`);
        }

        return result;
    }

    /**
     * Check for parsing errors in the DOM
     */
    static checkForParseErrors(document) {
        const errors = [];
        
        // Check for elements that couldn't be parsed properly
        const allElements = document.querySelectorAll('*');
        allElements.forEach((element, index) => {
            // Check for invalid tag names
            if (element.tagName && element.tagName.includes(':') && !element.tagName.startsWith('xml:')) {
                errors.push(`Invalid tag name at element ${index}: ${element.tagName}`);
            }
        });

        return errors;
    }

    /**
     * Check for unclosed tags using regex patterns
     */
    static checkUnclosedTags(htmlCode) {
        const errors = [];
        const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        
        // Find all opening tags
        const openingTagPattern = /<(\w+)(?:\s[^>]*)?>/g;
        const closingTagPattern = /<\/(\w+)>/g;
        
        const openingTags = [];
        const closingTags = [];
        
        let match;
        
        // Collect opening tags
        while ((match = openingTagPattern.exec(htmlCode)) !== null) {
            const tagName = match[1].toLowerCase();
            if (!selfClosingTags.includes(tagName)) {
                openingTags.push({
                    name: tagName,
                    position: match.index,
                    fullMatch: match[0]
                });
            }
        }
        
        // Collect closing tags
        while ((match = closingTagPattern.exec(htmlCode)) !== null) {
            closingTags.push({
                name: match[1].toLowerCase(),
                position: match.index
            });
        }
        
        // Simple check for major unclosed tags
        const tagCounts = {};
        openingTags.forEach(tag => {
            tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
        });
        
        closingTags.forEach(tag => {
            if (tagCounts[tag.name]) {
                tagCounts[tag.name]--;
            }
        });
        
        // Report unclosed tags
        Object.entries(tagCounts).forEach(([tagName, count]) => {
            if (count > 0) {
                errors.push(`Unclosed tag: <${tagName}> (${count} unclosed)`);
            }
        });
        
        return errors;
    }

    /**
     * Check for malformed attributes
     */
    static checkMalformedAttributes(htmlCode) {
        const errors = [];
        
        // Check for attributes without proper quotes
        const malformedAttrPattern = /\s(\w+)=([^"'\s>][^\s>]*)/g;
        let match;
        
        while ((match = malformedAttrPattern.exec(htmlCode)) !== null) {
            const attrName = match[1];
            const attrValue = match[2];
            if (attrValue && !attrValue.startsWith('"') && !attrValue.startsWith("'")) {
                errors.push(`Unquoted attribute value: ${attrName}=${attrValue}`);
            }
        }
        
        return errors;
    }
}

module.exports = HTMLValidator;