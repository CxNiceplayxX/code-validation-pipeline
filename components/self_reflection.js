/**
 * Self-Reflection Component - Analyzes whether generated code solves the actual stated problem
 */
class SelfReflection {
    /**
     * Analyze if the generated code addresses the original problem statement
     * @param {string} originalProblem - The original problem or requirement
     * @param {string} generatedCode - The code that was generated
     * @param {string} language - The programming language of the code
     * @returns {Object} - Analysis result with validation and suggestions
     */
    static analyze(originalProblem, generatedCode, language) {
        const result = {
            addressesProblem: true,
            confidence: 0,
            issues: [],
            suggestions: [],
            analysis: {
                problemKeywords: [],
                codeFeatures: [],
                alignment: []
            }
        };

        try {
            // Extract key requirements from the problem statement
            const problemKeywords = this.extractProblemKeywords(originalProblem);
            result.analysis.problemKeywords = problemKeywords;

            // Analyze code features
            const codeFeatures = this.analyzeCodeFeatures(generatedCode, language);
            result.analysis.codeFeatures = codeFeatures;

            // Check alignment between problem and solution
            const alignment = this.checkAlignment(problemKeywords, codeFeatures, originalProblem, generatedCode);
            result.analysis.alignment = alignment;

            // Calculate confidence score
            result.confidence = this.calculateConfidence(alignment);

            // Determine if code addresses the problem
            result.addressesProblem = result.confidence >= 0.6;

            // Generate specific feedback
            if (!result.addressesProblem) {
                result.issues = this.identifyIssues(alignment, problemKeywords, codeFeatures);
                result.suggestions = this.generateSuggestions(alignment, problemKeywords, codeFeatures, language);
            }

        } catch (error) {
            result.addressesProblem = false;
            result.confidence = 0;
            result.issues.push(`Self-reflection analysis error: ${error.message}`);
        }

        return result;
    }

    /**
     * Extract key requirements and concepts from the problem statement
     */
    static extractProblemKeywords(problemStatement) {
        const keywords = {
            actions: [],
            entities: [],
            requirements: [],
            technologies: [],
            patterns: []
        };

        const text = problemStatement.toLowerCase();

        // Common action words in programming tasks
        const actionWords = [
            'create', 'build', 'make', 'generate', 'implement', 'develop',
            'calculate', 'compute', 'process', 'parse', 'validate', 'verify',
            'sort', 'filter', 'search', 'find', 'display', 'show', 'render',
            'save', 'store', 'load', 'fetch', 'retrieve', 'update', 'delete',
            'connect', 'authenticate', 'authorize', 'handle', 'manage',
            'optimize', 'compress', 'encrypt', 'decode', 'transform'
        ];

        // Technology and framework keywords
        const techKeywords = [
            'html', 'css', 'javascript', 'react', 'vue', 'angular', 'node',
            'express', 'mongodb', 'mysql', 'postgresql', 'api', 'rest',
            'graphql', 'websocket', 'json', 'xml', 'csv', 'database',
            'blockchain', 'solidity', 'ethereum', 'smart contract', 'web3',
            'frontend', 'backend', 'fullstack', 'responsive', 'mobile'
        ];

        // UI/UX related keywords
        const uiKeywords = [
            'button', 'form', 'input', 'dropdown', 'menu', 'modal', 'popup',
            'table', 'list', 'grid', 'card', 'navbar', 'sidebar', 'footer',
            'header', 'layout', 'responsive', 'mobile', 'desktop'
        ];

        // Business logic keywords
        const businessKeywords = [
            'user', 'customer', 'admin', 'account', 'profile', 'login',
            'registration', 'payment', 'order', 'product', 'service',
            'notification', 'email', 'report', 'analytics', 'dashboard'
        ];

        // Extract actions
        actionWords.forEach(word => {
            if (text.includes(word)) {
                keywords.actions.push(word);
            }
        });

        // Extract technologies
        techKeywords.forEach(tech => {
            if (text.includes(tech)) {
                keywords.technologies.push(tech);
            }
        });

        // Extract UI elements
        uiKeywords.forEach(ui => {
            if (text.includes(ui)) {
                keywords.entities.push(ui);
            }
        });

        // Extract business entities
        businessKeywords.forEach(business => {
            if (text.includes(business)) {
                keywords.entities.push(business);
            }
        });

        // Extract requirements (sentences with "should", "must", "need to")
        const requirementMatches = text.match(/(should|must|need to|required to|has to)[^.!?]*/g);
        if (requirementMatches) {
            keywords.requirements = requirementMatches;
        }

        return keywords;
    }

    /**
     * Analyze features and structure of the generated code
     */
    static analyzeCodeFeatures(code, language) {
        const features = {
            functions: [],
            classes: [],
            variables: [],
            imports: [],
            exports: [],
            frameworks: [],
            patterns: [],
            uiElements: [],
            businessLogic: []
        };

        const codeText = code.toLowerCase();

        // Language-specific analysis
        switch (language) {
            case 'javascript':
            case 'js':
                this.analyzeJavaScriptFeatures(code, features);
                break;
            case 'html':
                this.analyzeHTMLFeatures(code, features);
                break;
            case 'css':
                this.analyzeCSSFeatures(code, features);
                break;
            case 'solidity':
                this.analyzeSolidityFeatures(code, features);
                break;
        }

        // Generic pattern detection
        this.analyzeGenericPatterns(code, features);

        return features;
    }

    /**
     * Analyze JavaScript-specific features
     */
    static analyzeJavaScriptFeatures(code, features) {
        // Extract functions
        const functionMatches = code.match(/function\s+(\w+)|const\s+(\w+)\s*=\s*\([^)]*\)\s*=>|(\w+)\s*:\s*function/g);
        if (functionMatches) {
            features.functions = functionMatches;
        }

        // Extract classes
        const classMatches = code.match(/class\s+(\w+)/g);
        if (classMatches) {
            features.classes = classMatches;
        }

        // Extract imports
        const importMatches = code.match(/import.*from\s+['"][^'"]*['"]/g);
        if (importMatches) {
            features.imports = importMatches;
        }

        // Detect frameworks
        if (code.includes('React') || code.includes('jsx') || code.includes('useState')) {
            features.frameworks.push('React');
        }
        if (code.includes('Vue') || code.includes('v-if') || code.includes('v-for')) {
            features.frameworks.push('Vue');
        }
        if (code.includes('express') || code.includes('app.get') || code.includes('app.post')) {
            features.frameworks.push('Express');
        }
    }

    /**
     * Analyze HTML features
     */
    static analyzeHTMLFeatures(code, features) {
        // Extract HTML elements
        const elementMatches = code.match(/<(\w+)[^>]*>/g);
        if (elementMatches) {
            const elements = elementMatches.map(match => match.match(/<(\w+)/)[1]);
            features.uiElements = [...new Set(elements)];
        }

        // Detect forms
        if (code.includes('<form')) {
            features.patterns.push('form');
        }
        if (code.includes('<input')) {
            features.patterns.push('user-input');
        }
        if (code.includes('<button')) {
            features.patterns.push('interactive');
        }
    }

    /**
     * Analyze CSS features
     */
    static analyzeCSSFeatures(code, features) {
        // Extract selectors
        const selectorMatches = code.match(/([.#]?[\w-]+)\s*{/g);
        if (selectorMatches) {
            features.uiElements = selectorMatches.map(match => match.replace(/\s*{/, ''));
        }

        // Detect responsive design
        if (code.includes('@media')) {
            features.patterns.push('responsive');
        }
        if (code.includes('flexbox') || code.includes('display: flex')) {
            features.patterns.push('flexbox');
        }
        if (code.includes('grid') || code.includes('display: grid')) {
            features.patterns.push('grid');
        }
    }

    /**
     * Analyze Solidity features
     */
    static analyzeSolidityFeatures(code, features) {
        // Extract contracts
        const contractMatches = code.match(/contract\s+(\w+)/g);
        if (contractMatches) {
            features.classes = contractMatches;
        }

        // Extract functions
        const functionMatches = code.match(/function\s+(\w+)/g);
        if (functionMatches) {
            features.functions = functionMatches;
        }

        // Detect patterns
        if (code.includes('payable')) {
            features.patterns.push('payment');
        }
        if (code.includes('onlyOwner') || code.includes('modifier')) {
            features.patterns.push('access-control');
        }
        if (code.includes('event') || code.includes('emit')) {
            features.patterns.push('events');
        }
    }

    /**
     * Analyze generic patterns across languages
     */
    static analyzeGenericPatterns(code, features) {
        const codeText = code.toLowerCase();

        // Authentication patterns
        if (codeText.includes('login') || codeText.includes('authenticate') || codeText.includes('password')) {
            features.businessLogic.push('authentication');
        }

        // CRUD operations
        if (codeText.includes('create') && codeText.includes('read') && codeText.includes('update') && codeText.includes('delete')) {
            features.patterns.push('crud');
        }

        // API patterns
        if (codeText.includes('api') || codeText.includes('endpoint') || codeText.includes('fetch') || codeText.includes('axios')) {
            features.patterns.push('api');
        }

        // Database patterns
        if (codeText.includes('database') || codeText.includes('db') || codeText.includes('query') || codeText.includes('schema')) {
            features.patterns.push('database');
        }
    }

    /**
     * Check alignment between problem requirements and code implementation
     */
    static checkAlignment(problemKeywords, codeFeatures, originalProblem, generatedCode) {
        const alignment = {
            actionAlignment: 0,
            entityAlignment: 0,
            technologyAlignment: 0,
            requirementAlignment: 0,
            overallAlignment: 0,
            missingElements: [],
            extraElements: []
        };

        // Check action alignment
        const requiredActions = problemKeywords.actions;
        const implementedActions = this.findImplementedActions(generatedCode, requiredActions);
        alignment.actionAlignment = requiredActions.length > 0 ? implementedActions.length / requiredActions.length : 1;

        // Check entity alignment
        const requiredEntities = problemKeywords.entities;
        const implementedEntities = this.findImplementedEntities(generatedCode, codeFeatures, requiredEntities);
        alignment.entityAlignment = requiredEntities.length > 0 ? implementedEntities.length / requiredEntities.length : 1;

        // Check technology alignment
        const requiredTech = problemKeywords.technologies;
        const implementedTech = this.findImplementedTech(codeFeatures, requiredTech);
        alignment.technologyAlignment = requiredTech.length > 0 ? implementedTech.length / requiredTech.length : 1;

        // Check requirement fulfillment
        alignment.requirementAlignment = this.checkRequirementFulfillment(problemKeywords.requirements, generatedCode);

        // Calculate overall alignment
        alignment.overallAlignment = (
            alignment.actionAlignment * 0.3 +
            alignment.entityAlignment * 0.3 +
            alignment.technologyAlignment * 0.2 +
            alignment.requirementAlignment * 0.2
        );

        // Identify missing elements
        alignment.missingElements = this.findMissingElements(problemKeywords, codeFeatures, generatedCode);

        return alignment;
    }

    /**
     * Find implemented actions in the code
     */
    static findImplementedActions(code, requiredActions) {
        const implementedActions = [];
        const codeText = code.toLowerCase();

        requiredActions.forEach(action => {
            if (codeText.includes(action) || 
                codeText.includes(action.slice(0, -1)) || // handle verb forms
                this.findActionImplementation(code, action)) {
                implementedActions.push(action);
            }
        });

        return implementedActions;
    }

    /**
     * Find specific action implementations in code
     */
    static findActionImplementation(code, action) {
        const actionMappings = {
            'create': ['new ', 'create', 'add', 'insert', 'post'],
            'read': ['get', 'fetch', 'read', 'find', 'select'],
            'update': ['put', 'patch', 'update', 'modify', 'edit'],
            'delete': ['delete', 'remove', 'destroy'],
            'validate': ['validate', 'check', 'verify', 'test'],
            'calculate': ['calculate', 'compute', '+', '-', '*', '/', 'math'],
            'sort': ['sort', 'order', 'arrange'],
            'filter': ['filter', 'where', 'find']
        };

        const implementations = actionMappings[action] || [action];
        return implementations.some(impl => code.toLowerCase().includes(impl));
    }

    /**
     * Find implemented entities in the code
     */
    static findImplementedEntities(code, codeFeatures, requiredEntities) {
        const implementedEntities = [];
        const codeText = code.toLowerCase();

        requiredEntities.forEach(entity => {
            if (codeText.includes(entity) ||
                codeFeatures.uiElements.some(elem => elem.includes(entity)) ||
                codeFeatures.businessLogic.some(logic => logic.includes(entity))) {
                implementedEntities.push(entity);
            }
        });

        return implementedEntities;
    }

    /**
     * Find implemented technologies
     */
    static findImplementedTech(codeFeatures, requiredTech) {
        const implementedTech = [];

        requiredTech.forEach(tech => {
            if (codeFeatures.frameworks.some(fw => fw.toLowerCase().includes(tech)) ||
                codeFeatures.imports.some(imp => imp.toLowerCase().includes(tech))) {
                implementedTech.push(tech);
            }
        });

        return implementedTech;
    }

    /**
     * Check if requirements are fulfilled
     */
    static checkRequirementFulfillment(requirements, code) {
        if (requirements.length === 0) return 1;

        let fulfilledCount = 0;
        const codeText = code.toLowerCase();

        requirements.forEach(requirement => {
            // Simple keyword matching for requirement fulfillment
            const reqWords = requirement.split(' ').filter(word => word.length > 3);
            const matchCount = reqWords.filter(word => codeText.includes(word)).length;
            
            if (matchCount / reqWords.length >= 0.5) {
                fulfilledCount++;
            }
        });

        return fulfilledCount / requirements.length;
    }

    /**
     * Find missing elements from the problem statement
     */
    static findMissingElements(problemKeywords, codeFeatures, generatedCode) {
        const missing = [];
        const codeText = generatedCode.toLowerCase();

        // Check for missing actions
        problemKeywords.actions.forEach(action => {
            if (!this.findActionImplementation(generatedCode, action)) {
                missing.push(`Missing action: ${action}`);
            }
        });

        // Check for missing entities
        problemKeywords.entities.forEach(entity => {
            if (!codeText.includes(entity)) {
                missing.push(`Missing entity: ${entity}`);
            }
        });

        // Check for missing technologies
        problemKeywords.technologies.forEach(tech => {
            if (!codeText.includes(tech) && !codeFeatures.frameworks.some(fw => fw.toLowerCase().includes(tech))) {
                missing.push(`Missing technology: ${tech}`);
            }
        });

        return missing;
    }

    /**
     * Calculate confidence score based on alignment
     */
    static calculateConfidence(alignment) {
        return Math.max(0, Math.min(1, alignment.overallAlignment));
    }

    /**
     * Identify specific issues with the generated code
     */
    static identifyIssues(alignment, problemKeywords, codeFeatures) {
        const issues = [];

        if (alignment.actionAlignment < 0.5) {
            issues.push('Code does not implement the required actions from the problem statement');
        }

        if (alignment.entityAlignment < 0.5) {
            issues.push('Code is missing key entities or components mentioned in the problem');
        }

        if (alignment.technologyAlignment < 0.3) {
            issues.push('Code does not use the required technologies or frameworks');
        }

        if (alignment.requirementAlignment < 0.4) {
            issues.push('Code does not fulfill the specific requirements outlined in the problem');
        }

        if (alignment.missingElements.length > 3) {
            issues.push(`Multiple missing elements: ${alignment.missingElements.slice(0, 3).join(', ')}...`);
        }

        return issues;
    }

    /**
     * Generate suggestions for improvement
     */
    static generateSuggestions(alignment, problemKeywords, codeFeatures, language) {
        const suggestions = [];

        if (alignment.actionAlignment < 0.5) {
            const missingActions = problemKeywords.actions.filter(action => 
                !this.findActionImplementation(JSON.stringify(codeFeatures), action)
            );
            suggestions.push(`Implement missing actions: ${missingActions.join(', ')}`);
        }

        if (alignment.entityAlignment < 0.5) {
            suggestions.push('Add the missing UI elements or business entities mentioned in the problem');
        }

        if (alignment.technologyAlignment < 0.3) {
            const missingTech = problemKeywords.technologies.filter(tech => 
                !codeFeatures.frameworks.some(fw => fw.toLowerCase().includes(tech))
            );
            suggestions.push(`Integrate required technologies: ${missingTech.join(', ')}`);
        }

        if (problemKeywords.requirements.length > 0 && alignment.requirementAlignment < 0.4) {
            suggestions.push('Review and implement the specific requirements mentioned in the problem statement');
        }

        // Language-specific suggestions
        if (language === 'html' && !codeFeatures.uiElements.length) {
            suggestions.push('Add HTML elements to create the user interface');
        }

        if (language === 'javascript' && !codeFeatures.functions.length) {
            suggestions.push('Add functions to implement the required functionality');
        }

        return suggestions;
    }
}

module.exports = SelfReflection;