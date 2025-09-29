const ValidationPipeline = require('../validation_pipeline');

/**
 * Comprehensive Test Suite for Code Validation Pipeline
 */
class PipelineTestSuite {
    constructor() {
        this.pipeline = new ValidationPipeline();
        this.testResults = [];
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting Code Validation Pipeline Test Suite');
        console.log('=' .repeat(60));

        const testGroups = [
            { name: 'HTML Validation Tests', method: 'testHTMLValidation' },
            { name: 'CSS Validation Tests', method: 'testCSSValidation' },
            { name: 'JavaScript Validation Tests', method: 'testJavaScriptValidation' },
            { name: 'Solidity Validation Tests', method: 'testSolidityValidation' },
            { name: 'Self-Reflection Tests', method: 'testSelfReflection' },
            { name: 'Integration Tests', method: 'testIntegration' },
            { name: 'Error Handling Tests', method: 'testErrorHandling' }
        ];

        for (const group of testGroups) {
            console.log(`\n📋 ${group.name}`);
            console.log('-'.repeat(40));
            await this[group.method]();
        }

        this.printSummary();
    }

    /**
     * Test HTML validation
     */
    async testHTMLValidation() {
        // Test valid HTML
        await this.runTest('Valid HTML', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a simple HTML page with a title and paragraph',
                language: 'html',
                codeGenerator: () => `
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a test paragraph.</p>
</body>
</html>`
            });
            
            if (!result.success || !result.code) {
                throw new Error('Valid HTML should pass validation');
            }
        });

        // Test invalid HTML (unclosed tags)
        await this.runTest('Invalid HTML - Unclosed Tags', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a simple HTML page',
                language: 'html',
                codeGenerator: () => `
<html>
<head>
    <title>Test Page
</head>
<body>
    <h1>Hello World</h1>
    <p>Unclosed paragraph
</body>`
            });
            
            if (result.success) {
                throw new Error('Invalid HTML should fail validation');
            }
        });

        // Test HTML with missing elements
        await this.runTest('HTML Self-Reflection Test', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a contact form with name, email, and message fields',
                language: 'html',
                codeGenerator: () => `
<!DOCTYPE html>
<html>
<head><title>Simple Page</title></head>
<body>
    <h1>Just a heading</h1>
</body>
</html>`
            });
            
            // This should pass syntax but may fail self-reflection
            // as it doesn't include the required form elements
            if (result.success && result.validationResults.reflection.confidence > 0.6) {
                throw new Error('HTML should fail self-reflection for missing form elements');
            }
        });
    }

    /**
     * Test CSS validation
     */
    async testCSSValidation() {
        // Test valid CSS
        await this.runTest('Valid CSS', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create CSS styles for a responsive layout',
                language: 'css',
                codeGenerator: () => `
body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}`
            });
            
            if (!result.success || !result.code) {
                throw new Error('Valid CSS should pass validation');
            }
        });

        // Test invalid CSS (unmatched braces)
        await this.runTest('Invalid CSS - Unmatched Braces', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create basic CSS styles',
                language: 'css',
                codeGenerator: () => `
body {
    margin: 0;
    padding: 20px;

.container {
    max-width: 1200px;
}`
            });
            
            if (result.success) {
                throw new Error('Invalid CSS should fail validation');
            }
        });

        // Test CSS self-reflection
        await this.runTest('CSS Self-Reflection Test', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create responsive mobile-first CSS for a navigation menu',
                language: 'css',
                codeGenerator: () => `
p {
    color: blue;
}`
            });
            
            // Simple paragraph styling doesn't address navigation menu requirement
            if (result.success && result.validationResults.reflection.confidence > 0.4) {
                throw new Error('CSS should fail self-reflection for navigation menu requirement');
            }
        });
    }

    /**
     * Test JavaScript validation
     */
    async testJavaScriptValidation() {
        // Test valid JavaScript
        await this.runTest('Valid JavaScript', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a function to calculate the sum of two numbers',
                language: 'javascript',
                codeGenerator: () => `
function calculateSum(a, b) {
    return a + b;
}

function multiply(x, y) {
    return x * y;
}

const result = calculateSum(5, 3);
console.log(result);`
            });
            
            if (!result.success || !result.code) {
                throw new Error('Valid JavaScript should pass validation');
            }
        });

        // Test invalid JavaScript (syntax errors)
        await this.runTest('Invalid JavaScript - Syntax Error', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a simple function',
                language: 'javascript',
                codeGenerator: () => `
function test( {
    console.log("missing closing parenthesis"
    return "invalid";
}`
            });
            
            if (result.success) {
                throw new Error('Invalid JavaScript should fail validation');
            }
        });

        // Test JavaScript self-reflection
        await this.runTest('JavaScript Self-Reflection Test', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a user authentication system with login and registration',
                language: 'javascript',
                codeGenerator: () => `
function sayHello() {
    return "Hello World";
}`
            });
            
            // Simple hello function doesn't address authentication requirement
            if (result.success && result.validationResults.reflection.confidence > 0.3) {
                throw new Error('JavaScript should fail self-reflection for authentication requirement');
            }
        });
    }

    /**
     * Test Solidity validation
     */
    async testSolidityValidation() {
        // Test valid Solidity
        await this.runTest('Valid Solidity', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a simple smart contract for storing a value',
                language: 'solidity',
                codeGenerator: () => `
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedValue;
    
    function setValue(uint256 _value) public {
        storedValue = _value;
    }
    
    function getValue() public view returns (uint256) {
        return storedValue;
    }
}`
            });
            
            if (!result.success || !result.code) {
                throw new Error('Valid Solidity should pass validation');
            }
        });

        // Test invalid Solidity (missing visibility)
        await this.runTest('Invalid Solidity - Missing Function Visibility', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a simple contract',
                language: 'solidity',
                codeGenerator: () => `
pragma solidity ^0.8.0;

contract Test {
    function test() {
        // Missing visibility modifier
    }
}`
            });
            
            if (result.success) {
                throw new Error('Solidity with missing visibility should fail validation');
            }
        });

        // Test Solidity self-reflection
        await this.runTest('Solidity Self-Reflection Test', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create an ERC20 token contract with transfer and balance functions',
                language: 'solidity',
                codeGenerator: () => `
pragma solidity ^0.8.0;

contract Simple {
    uint256 public number = 42;
}`
            });
            
            // Simple number storage doesn't address ERC20 token requirement
            if (result.success && result.validationResults.reflection.confidence > 0.4) {
                throw new Error('Solidity should fail self-reflection for ERC20 token requirement');
            }
        });
    }

    /**
     * Test self-reflection component
     */
    async testSelfReflection() {
        await this.runTest('Self-Reflection Alignment Test', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a calculator function that can add, subtract, multiply, and divide two numbers',
                language: 'javascript',
                codeGenerator: () => `
class Calculator {
    add(a, b) {
        return a + b;
    }
    
    subtract(a, b) {
        return a - b;
    }
    
    multiply(a, b) {
        return a * b;
    }
    
    divide(a, b) {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    }
}

const calc = new Calculator();`
            });
            
            if (!result.success || result.validationResults.reflection.confidence < 0.7) {
                throw new Error('Calculator implementation should have high confidence score');
            }
        });

        await this.runTest('Self-Reflection Misalignment Test', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create a complete e-commerce shopping cart with add, remove, and checkout functionality',
                language: 'javascript',
                codeGenerator: () => `
function hello() {
    console.log("Hello world");
}`
            });
            
            if (result.success) {
                throw new Error('Simple hello function should not address e-commerce requirement');
            }
        });
    }

    /**
     * Test integration scenarios
     */
    async testIntegration() {
        await this.runTest('Multi-Attempt Regeneration', async () => {
            let attemptCount = 0;
            
            const result = await this.pipeline.execute({
                problemStatement: 'Create a form validation function',
                language: 'javascript',
                codeGenerator: (context) => {
                    attemptCount++;
                    
                    if (attemptCount === 1) {
                        // First attempt: invalid syntax
                        return `function validate( { return true; }`;
                    } else if (attemptCount === 2) {
                        // Second attempt: valid syntax but doesn't address problem
                        return `function sayHello() { return "hello"; }`;
                    } else {
                        // Third attempt: valid and addresses problem
                        return `
function validateForm(formData) {
    if (!formData.email || !formData.email.includes('@')) {
        return false;
    }
    if (!formData.name || formData.name.trim().length === 0) {
        return false;
    }
    return true;
}`;
                    }
                }
            });
            
            if (!result.success || result.metadata.attempts !== 3) {
                throw new Error('Should succeed on third attempt with valid form validation');
            }
        });

        await this.runTest('Context Passing Between Attempts', async () => {
            const contexts = [];
            
            await this.pipeline.execute({
                problemStatement: 'Create a simple counter',
                language: 'javascript',
                codeGenerator: (context) => {
                    contexts.push(context);
                    
                    if (contexts.length === 1) {
                        return `invalid syntax {`;
                    } else {
                        // Should have access to previous attempts
                        if (!context.previousAttempts || context.previousAttempts.length === 0) {
                            throw new Error('Context should include previous attempts');
                        }
                        return `
let counter = 0;
function increment() { counter++; }
function getCount() { return counter; }`;
                    }
                }
            });
            
            if (contexts.length < 2) {
                throw new Error('Should have made multiple attempts');
            }
        });
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        await this.runTest('Invalid Language', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create something',
                language: 'cobol',
                codeGenerator: () => 'some code'
            });
            
            if (result.isValid !== false) {
                throw new Error('Should reject unsupported language');
            }
        });

        await this.runTest('Missing Code Generator', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create something',
                language: 'javascript'
                // Missing codeGenerator
            });
            
            if (result.isValid !== false) {
                throw new Error('Should reject missing code generator');
            }
        });

        await this.runTest('Code Generator Error', async () => {
            const result = await this.pipeline.execute({
                problemStatement: 'Create something',
                language: 'javascript',
                codeGenerator: () => {
                    throw new Error('Generator failed');
                }
            });
            
            if (result.success) {
                throw new Error('Should handle code generator errors');
            }
        });

        await this.runTest('Maximum Attempts Exceeded', async () => {
            this.pipeline.setMaxAttempts(2);
            
            const result = await this.pipeline.execute({
                problemStatement: 'Create a function',
                language: 'javascript',
                codeGenerator: () => `invalid syntax {`
            });
            
            if (result.success) {
                throw new Error('Should fail after maximum attempts');
            }
            
            // Reset to default
            this.pipeline.setMaxAttempts(3);
        });
    }

    /**
     * Run a single test
     */
    async runTest(testName, testFunction) {
        try {
            await testFunction();
            console.log(`✅ ${testName}`);
            this.testResults.push({ name: testName, status: 'PASSED' });
        } catch (error) {
            console.log(`❌ ${testName}: ${error.message}`);
            this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
        }
    }

    /**
     * Print test summary
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 Test Summary');
        console.log('='.repeat(60));
        
        const passed = this.testResults.filter(r => r.status === 'PASSED').length;
        const failed = this.testResults.filter(r => r.status === 'FAILED').length;
        const total = this.testResults.length;
        
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAILED')
                .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
        }
        
        console.log('\n🎉 Test suite completed!');
        
        // Return summary for programmatic use
        return {
            total,
            passed,
            failed,
            successRate: (passed / total) * 100,
            results: this.testResults
        };
    }
}

// Export for module use
module.exports = PipelineTestSuite;

// Run tests if this file is executed directly
if (require.main === module) {
    (async () => {
        const testSuite = new PipelineTestSuite();
        await testSuite.runAllTests();
    })();
}