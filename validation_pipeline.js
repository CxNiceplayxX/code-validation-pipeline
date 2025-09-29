const HTMLValidator = require('./validators/html_validator');
const CSSValidator = require('./validators/css_validator');
const JavaScriptValidator = require('./validators/js_validator');
const SolidityValidator = require('./validators/solidity_validator');
const SelfReflection = require('./components/self_reflection');

/**
 * Main Code Validation Pipeline - Orchestrates the complete validation process
 * 
 * Implementation of the 5-step pipeline:
 * 1. Generate code
 * 2. Parse code for syntax errors (HTML/CSS/JS/Solidity validators)
 * 3. If errors found, regenerate code from scratch (NOT patch)
 * 4. Only output code after validation passes
 * 5. Add self-reflection: "Is this code solving the actual stated problem"
 */
class ValidationPipeline {
    constructor() {
        this.maxRegenerationAttempts = 3;
        this.supportedLanguages = ['html', 'css', 'javascript', 'js', 'solidity'];
        this.validators = {
            'html': HTMLValidator,
            'css': CSSValidator,
            'javascript': JavaScriptValidator,
            'js': JavaScriptValidator,
            'solidity': SolidityValidator
        };
    }

    /**
     * Main pipeline execution method
     * @param {Object} options - Configuration options
     * @param {string} options.problemStatement - The original problem to solve
     * @param {string} options.language - Target programming language
     * @param {Function} options.codeGenerator - Function that generates code
     * @param {Object} options.generatorContext - Context for the code generator
     * @returns {Object} - Final validation result with code or error
     */
    async execute(options) {
        const {
            problemStatement,
            language,
            codeGenerator,
            generatorContext = {}
        } = options;

        // Validate input parameters
        const inputValidation = this.validateInput(options);
        if (!inputValidation.isValid) {
            return inputValidation;
        }

        console.log(`🚀 Starting code validation pipeline for ${language}`);
        console.log(`📋 Problem: ${problemStatement}`);

        let attempt = 1;
        let finalResult = null;

        while (attempt <= this.maxRegenerationAttempts) {
            console.log(`\n🔄 Attempt ${attempt}/${this.maxRegenerationAttempts}`);

            try {
                // Step 1: Generate code
                console.log('📝 Step 1: Generating code...');
                const generatedCode = await this.generateCode(codeGenerator, {
                    problemStatement,
                    language,
                    attempt,
                    ...generatorContext
                });

                if (!generatedCode) {
                    throw new Error('Code generator returned empty code');
                }

                console.log(`✅ Generated ${generatedCode.length} characters of code`);

                // Step 2: Parse code for syntax errors
                console.log('🔍 Step 2: Validating syntax...');
                const syntaxValidation = this.validateSyntax(generatedCode, language);
                
                console.log(`Syntax validation: ${syntaxValidation.isValid ? '✅ PASSED' : '❌ FAILED'}`);
                if (!syntaxValidation.isValid) {
                    console.log('❌ Syntax errors found:');
                    syntaxValidation.errors.forEach(error => console.log(`   - ${error}`));
                    
                    if (syntaxValidation.warnings.length > 0) {
                        console.log('⚠️  Warnings:');
                        syntaxValidation.warnings.forEach(warning => console.log(`   - ${warning}`));
                    }

                    // Step 3: If errors found, regenerate from scratch
                    if (attempt < this.maxRegenerationAttempts) {
                        console.log(`🔄 Regenerating code from scratch (attempt ${attempt + 1})...`);
                        attempt++;
                        continue;
                    } else {
                        return {
                            success: false,
                            error: 'Maximum regeneration attempts exceeded',
                            lastAttempt: {
                                code: generatedCode,
                                syntaxValidation,
                                attempt
                            }
                        };
                    }
                }

                console.log('✅ Syntax validation passed!');

                // Step 4: Code validation passed - proceed to self-reflection
                console.log('🧠 Step 5: Performing self-reflection analysis...');
                const reflectionResult = this.performSelfReflection(
                    problemStatement,
                    generatedCode,
                    language
                );

                console.log(`Self-reflection: ${reflectionResult.addressesProblem ? '✅ ADDRESSES PROBLEM' : '❌ DOES NOT ADDRESS PROBLEM'}`);
                console.log(`Confidence: ${(reflectionResult.confidence * 100).toFixed(1)}%`);

                if (!reflectionResult.addressesProblem) {
                    console.log('❌ Self-reflection issues:');
                    reflectionResult.issues.forEach(issue => console.log(`   - ${issue}`));
                    
                    if (reflectionResult.suggestions.length > 0) {
                        console.log('💡 Suggestions:');
                        reflectionResult.suggestions.forEach(suggestion => console.log(`   - ${suggestion}`));
                    }

                    if (attempt < this.maxRegenerationAttempts) {
                        console.log(`🔄 Code doesn't address the problem. Regenerating from scratch (attempt ${attempt + 1})...`);
                        
                        // Enhance generator context with reflection feedback
                        generatorContext.previousAttempts = generatorContext.previousAttempts || [];
                        generatorContext.previousAttempts.push({
                            attempt,
                            code: generatedCode,
                            syntaxValidation,
                            reflectionResult
                        });
                        
                        attempt++;
                        continue;
                    } else {
                        return {
                            success: false,
                            error: 'Code does not address the stated problem after maximum attempts',
                            lastAttempt: {
                                code: generatedCode,
                                syntaxValidation,
                                reflectionResult,
                                attempt
                            }
                        };
                    }
                }

                // Step 4: All validations passed - return successful result
                finalResult = {
                    success: true,
                    code: generatedCode,
                    language,
                    validationResults: {
                        syntax: syntaxValidation,
                        reflection: reflectionResult
                    },
                    metadata: {
                        attempts: attempt,
                        generatedAt: new Date().toISOString(),
                        problemStatement,
                        language
                    }
                };

                console.log(`🎉 Pipeline completed successfully in ${attempt} attempt(s)!`);
                break;

            } catch (error) {
                console.log(`❌ Error in attempt ${attempt}: ${error.message}`);
                
                if (attempt < this.maxRegenerationAttempts) {
                    console.log(`🔄 Retrying (attempt ${attempt + 1})...`);
                    attempt++;
                    continue;
                } else {
                    return {
                        success: false,
                        error: `Pipeline failed after ${this.maxRegenerationAttempts} attempts: ${error.message}`,
                        lastError: error
                    };
                }
            }
        }

        return finalResult;
    }

    /**
     * Validate input parameters
     */
    validateInput(options) {
        const { problemStatement, language, codeGenerator } = options;

        if (!problemStatement || typeof problemStatement !== 'string' || problemStatement.trim().length === 0) {
            return {
                isValid: false,
                error: 'Problem statement must be a non-empty string'
            };
        }

        if (!language || typeof language !== 'string') {
            return {
                isValid: false,
                error: 'Language must be specified as a string'
            };
        }

        const normalizedLanguage = language.toLowerCase();
        if (!this.supportedLanguages.includes(normalizedLanguage)) {
            return {
                isValid: false,
                error: `Unsupported language: ${language}. Supported languages: ${this.supportedLanguages.join(', ')}`
            };
        }

        if (!codeGenerator || typeof codeGenerator !== 'function') {
            return {
                isValid: false,
                error: 'Code generator must be a function'
            };
        }

        return { isValid: true };
    }

    /**
     * Generate code using the provided generator function
     */
    async generateCode(codeGenerator, context) {
        try {
            const code = await codeGenerator(context);
            
            if (!code || typeof code !== 'string') {
                throw new Error('Code generator must return a string');
            }

            return code.trim();
        } catch (error) {
            throw new Error(`Code generation failed: ${error.message}`);
        }
    }

    /**
     * Validate syntax using language-specific validators
     */
    validateSyntax(code, language) {
        const normalizedLanguage = language.toLowerCase();
        const validator = this.validators[normalizedLanguage];

        if (!validator) {
            throw new Error(`No validator found for language: ${language}`);
        }

        try {
            const result = validator.validate(code);
            return result;
        } catch (error) {
            return {
                isValid: false,
                errors: [`Validation error: ${error.message}`],
                warnings: []
            };
        }
    }

    /**
     * Perform self-reflection analysis
     */
    performSelfReflection(problemStatement, code, language) {
        try {
            const result = SelfReflection.analyze(problemStatement, code, language.toLowerCase());
            return result;
        } catch (error) {
            return {
                addressesProblem: false,
                confidence: 0,
                issues: [`Self-reflection failed: ${error.message}`],
                suggestions: []
            };
        }
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    /**
     * Get pipeline statistics
     */
    getStats() {
        return {
            supportedLanguages: this.supportedLanguages.length,
            maxAttempts: this.maxRegenerationAttempts,
            validators: Object.keys(this.validators).length
        };
    }

    /**
     * Set maximum regeneration attempts
     */
    setMaxAttempts(maxAttempts) {
        if (typeof maxAttempts !== 'number' || maxAttempts < 1) {
            throw new Error('Max attempts must be a positive number');
        }
        this.maxRegenerationAttempts = maxAttempts;
    }
}

module.exports = ValidationPipeline;