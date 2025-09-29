const ValidationPipeline = require('../validation_pipeline');

/**
 * Example Usage of Code Validation Pipeline
 * 
 * This example demonstrates how to use the validation pipeline
 * with different code generators and problem statements.
 */

async function runExamples() {
    console.log('🚀 Code Validation Pipeline - Usage Examples');
    console.log('='.repeat(60));

    const pipeline = new ValidationPipeline();

    // Example 1: HTML Form Generation
    console.log('\n📝 Example 1: HTML Contact Form');
    console.log('-'.repeat(40));

    const htmlResult = await pipeline.execute({
        problemStatement: 'Create a contact form with name, email, and message fields that includes proper validation',
        language: 'html',
        codeGenerator: async (context) => {
            console.log(`   Generating HTML (attempt ${context.attempt})...`);
            
            if (context.attempt === 1) {
                // First attempt: basic form
                return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
</head>
<body>
    <h1>Contact Us</h1>
    <form id="contactForm" action="/submit" method="post">
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div>
            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        
        <button type="submit">Send Message</button>
    </form>
</body>
</html>`;
            } else {
                // If needed, enhanced version with better validation
                return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <style>
        .form-group { margin-bottom: 15px; }
        .error { color: red; font-size: 12px; }
        input, textarea { width: 100%; padding: 8px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; }
    </style>
</head>
<body>
    <h1>Contact Us</h1>
    <form id="contactForm" action="/submit" method="post" novalidate>
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required minlength="2">
            <div class="error" id="nameError"></div>
        </div>
        
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <div class="error" id="emailError"></div>
        </div>
        
        <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="5" required minlength="10"></textarea>
            <div class="error" id="messageError"></div>
        </div>
        
        <button type="submit">Send Message</button>
    </form>
    
    <script>
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            // Basic validation would go here
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                e.preventDefault();
                alert('Please fill in all fields');
            }
        });
    </script>
</body>
</html>`;
            }
        }
    });

    console.log(`   Result: ${htmlResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (htmlResult.success) {
        console.log(`   Attempts: ${htmlResult.metadata.attempts}`);
        console.log(`   Code length: ${htmlResult.code.length} characters`);
        console.log(`   Confidence: ${(htmlResult.validationResults.reflection.confidence * 100).toFixed(1)}%`);
    }

    // Example 2: JavaScript Calculator
    console.log('\n🧮 Example 2: JavaScript Calculator');
    console.log('-'.repeat(40));

    const jsResult = await pipeline.execute({
        problemStatement: 'Create a calculator class with add, subtract, multiply, and divide methods that handles edge cases',
        language: 'javascript',
        codeGenerator: async (context) => {
            console.log(`   Generating JavaScript (attempt ${context.attempt})...`);
            
            return `
/**
 * Calculator class with basic arithmetic operations
 */
class Calculator {
    /**
     * Add two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} Sum of a and b
     */
    add(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return a + b;
    }

    /**
     * Subtract two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} Difference of a and b
     */
    subtract(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return a - b;
    }

    /**
     * Multiply two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} Product of a and b
     */
    multiply(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return a * b;
    }

    /**
     * Divide two numbers
     * @param {number} a - Dividend
     * @param {number} b - Divisor
     * @returns {number} Quotient of a and b
     * @throws {Error} If divisor is zero
     */
    divide(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        return a / b;
    }

    /**
     * Calculate percentage
     * @param {number} value - The value
     * @param {number} percentage - The percentage
     * @returns {number} Percentage of the value
     */
    percentage(value, percentage) {
        if (typeof value !== 'number' || typeof percentage !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return (value * percentage) / 100;
    }
}

// Example usage
const calc = new Calculator();

// Test the calculator
try {
    console.log('5 + 3 =', calc.add(5, 3));
    console.log('10 - 4 =', calc.subtract(10, 4));
    console.log('6 * 7 =', calc.multiply(6, 7));
    console.log('15 / 3 =', calc.divide(15, 3));
    console.log('20% of 100 =', calc.percentage(100, 20));
} catch (error) {
    console.error('Calculator error:', error.message);
}

module.exports = Calculator;`;
        }
    });

    console.log(`   Result: ${jsResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (jsResult.success) {
        console.log(`   Attempts: ${jsResult.metadata.attempts}`);
        console.log(`   Code length: ${jsResult.code.length} characters`);
        console.log(`   Confidence: ${(jsResult.validationResults.reflection.confidence * 100).toFixed(1)}%`);
    }

    // Example 3: CSS Responsive Layout
    console.log('\n🎨 Example 3: CSS Responsive Layout');
    console.log('-'.repeat(40));

    const cssResult = await pipeline.execute({
        problemStatement: 'Create responsive CSS for a mobile-first navigation menu with dropdown functionality',
        language: 'css',
        codeGenerator: async (context) => {
            console.log(`   Generating CSS (attempt ${context.attempt})...`);
            
            return `
/* Mobile-first responsive navigation menu */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
}

/* Navigation styles */
.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 0;
    position: relative;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ecf0f1;
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-item {
    position: relative;
}

.nav-link {
    color: #ecf0f1;
    text-decoration: none;
    padding: 0.5rem 1rem;
    display: block;
    transition: background-color 0.3s ease;
}

.nav-link:hover {
    background-color: #34495e;
}

/* Dropdown menu */
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #34495e;
    min-width: 200px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
}

.nav-item:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    color: #ecf0f1;
    padding: 0.75rem 1rem;
    text-decoration: none;
    display: block;
    transition: background-color 0.3s ease;
}

.dropdown-item:hover {
    background-color: #2c3e50;
}

/* Mobile menu toggle */
.nav-toggle {
    display: none;
    background: none;
    border: none;
    color: #ecf0f1;
    font-size: 1.5rem;
    cursor: pointer;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 70px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 70px);
        background-color: #2c3e50;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        transition: left 0.3s ease;
        z-index: 999;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-item {
        width: 100%;
        text-align: center;
    }

    .nav-link {
        padding: 1rem;
        border-bottom: 1px solid #34495e;
        width: 100%;
    }

    .nav-toggle {
        display: block;
    }

    /* Mobile dropdown adjustments */
    .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        background-color: #34495e;
        min-width: auto;
        width: 100%;
    }

    .nav-item:hover .dropdown-menu {
        display: block;
    }
}

/* Tablet styles */
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .nav-container {
        padding: 0 2rem;
    }

    .nav-link {
        padding: 0.5rem 0.75rem;
    }
}

/* Desktop styles */
@media screen and (min-width: 1025px) {
    .nav-container {
        padding: 0 3rem;
    }

    .nav-link {
        padding: 0.5rem 1.5rem;
    }

    .dropdown-menu {
        min-width: 250px;
    }
}

/* Animation for smooth transitions */
.nav-menu,
.dropdown-menu {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Accessibility improvements */
.nav-link:focus,
.dropdown-item:focus {
    outline: 2px solid #3498db;
    outline-offset: 2px;
}

/* Utility classes */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}`;
        }
    });

    console.log(`   Result: ${cssResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (cssResult.success) {
        console.log(`   Attempts: ${cssResult.metadata.attempts}`);
        console.log(`   Code length: ${cssResult.code.length} characters`);
        console.log(`   Confidence: ${(cssResult.validationResults.reflection.confidence * 100).toFixed(1)}%`);
    }

    // Example 4: Error handling with failed generation
    console.log('\n❌ Example 4: Intentional Failure Test');
    console.log('-'.repeat(40));

    const failResult = await pipeline.execute({
        problemStatement: 'Create a complex e-commerce platform with user authentication, product management, and payment processing',
        language: 'javascript',
        codeGenerator: async (context) => {
            console.log(`   Generating inadequate code (attempt ${context.attempt})...`);
            
            // Always return something that doesn't address the complex requirement
            return `
function hello() {
    console.log("This doesn't address e-commerce at all");
}`;
        }
    });

    console.log(`   Result: ${failResult.success ? '✅ SUCCESS' : '❌ FAILED (as expected)'}`);
    if (!failResult.success) {
        console.log(`   Error: ${failResult.error}`);
        if (failResult.lastAttempt && failResult.lastAttempt.reflectionResult) {
            console.log(`   Confidence: ${(failResult.lastAttempt.reflectionResult.confidence * 100).toFixed(1)}%`);
            console.log(`   Issues: ${failResult.lastAttempt.reflectionResult.issues.join(', ')}`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Examples Summary');
    console.log('='.repeat(60));

    const results = [htmlResult, jsResult, cssResult, failResult];
    const successful = results.filter(r => r.success).length;
    
    console.log(`Total Examples: ${results.length}`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${results.length - successful}`);
    
    console.log('\n🎉 Examples completed!');
    console.log('\nTo run the full test suite, use: npm test');
}

// Run examples if this file is executed directly
if (require.main === module) {
    runExamples().catch(console.error);
}

module.exports = { runExamples };