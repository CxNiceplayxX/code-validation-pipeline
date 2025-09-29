# Code Validation Pipeline

A comprehensive code validation system that implements a 5-step pipeline to ensure generated code is syntactically correct and addresses the stated problem requirements.

## 🚀 Features

### 5-Step Validation Process

1. **Generate Code** - Uses provided code generator function
2. **Parse & Validate Syntax** - Language-specific syntax validation 
3. **Regenerate on Errors** - Regenerates from scratch (NOT patches) if errors found
4. **Validate Only After Success** - Only outputs code after all validations pass
5. **Self-Reflection Analysis** - Analyzes if code actually solves the stated problem

### Supported Languages

- **HTML** - Full DOM parsing and structure validation
- **CSS** - Syntax validation and best practices checking
- **JavaScript** - AST parsing with Babel and Node.js VM validation
- **Solidity** - Smart contract syntax and security best practices

### Key Capabilities

- ✅ **Syntax Validation** - Comprehensive parsing and error detection
- 🧠 **Self-Reflection** - Semantic analysis of problem alignment
- 🔄 **Automatic Regeneration** - Up to configurable attempts when validation fails
- 📊 **Detailed Reporting** - Validation results, confidence scores, and suggestions
- 🛡️ **Error Handling** - Robust error management and recovery
- 📈 **Context Passing** - Feedback between regeneration attempts

## 📦 Installation

```bash
# Clone or download the validation pipeline
cd code_validation_pipeline

# Install dependencies
npm run install-deps

# Or manually install
npm install jsdom css @babel/parser
```

## 🎯 Quick Start

```javascript
const ValidationPipeline = require('./validation_pipeline');

const pipeline = new ValidationPipeline();

// Basic usage
const result = await pipeline.execute({
    problemStatement: 'Create a function to calculate the sum of two numbers',
    language: 'javascript',
    codeGenerator: async (context) => {
        return `
function sum(a, b) {
    return a + b;
}`;
    }
});

if (result.success) {
    console.log('✅ Code generated and validated successfully!');
    console.log('Code:', result.code);
    console.log('Confidence:', result.validationResults.reflection.confidence);
} else {
    console.log('❌ Validation failed:', result.error);
}
```

## 📖 Detailed Usage

### Pipeline Configuration

```javascript
const pipeline = new ValidationPipeline();

// Configure maximum regeneration attempts (default: 3)
pipeline.setMaxAttempts(5);

// Get supported languages
console.log(pipeline.getSupportedLanguages());
// Output: ['html', 'css', 'javascript', 'js', 'solidity']

// Get pipeline statistics
console.log(pipeline.getStats());
```

### Code Generator Function

The code generator function receives a context object and should return a string of code:

```javascript
const codeGenerator = async (context) => {
    // Context includes:
    // - problemStatement: The original problem
    // - language: Target language
    // - attempt: Current attempt number (1, 2, 3...)
    // - previousAttempts: Array of previous failed attempts with feedback
    
    if (context.attempt === 1) {
        // First attempt
        return generateBasicSolution();
    } else {
        // Use feedback from previous attempts
        const lastAttempt = context.previousAttempts[context.previousAttempts.length - 1];
        return generateImprovedSolution(lastAttempt.reflectionResult.suggestions);
    }
};
```

### HTML Validation Example

```javascript
const htmlResult = await pipeline.execute({
    problemStatement: 'Create a contact form with name, email, and message fields',
    language: 'html',
    codeGenerator: async () => `
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
</head>
<body>
    <form action="/submit" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        
        <button type="submit">Send</button>
    </form>
</body>
</html>`
});
```

### CSS Validation Example

```javascript
const cssResult = await pipeline.execute({
    problemStatement: 'Create responsive CSS for a mobile-first navigation menu',
    language: 'css',
    codeGenerator: async () => `
.navbar {
    background-color: #333;
    padding: 1rem;
}

.nav-menu {
    display: flex;
    list-style: none;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
}

@media (max-width: 768px) {
    .nav-menu {
        flex-direction: column;
    }
}`
});
```

### JavaScript Validation Example

```javascript
const jsResult = await pipeline.execute({
    problemStatement: 'Create a calculator with add, subtract, multiply, divide methods',
    language: 'javascript',
    codeGenerator: async () => `
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
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }
}`
});
```

### Solidity Validation Example

```javascript
const solidityResult = await pipeline.execute({
    problemStatement: 'Create a simple storage contract that can set and get a value',
    language: 'solidity',
    codeGenerator: async () => `
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
```

## 🔍 Understanding Results

### Success Response

```javascript
{
    success: true,
    code: "// Generated and validated code",
    language: "javascript",
    validationResults: {
        syntax: {
            isValid: true,
            errors: [],
            warnings: ["Found 2 console statements - remember to remove before production"]
        },
        reflection: {
            addressesProblem: true,
            confidence: 0.85,
            issues: [],
            suggestions: [],
            analysis: {
                problemKeywords: {
                    actions: ['create', 'calculate'],
                    entities: ['calculator'],
                    technologies: ['javascript']
                }
            }
        }
    },
    metadata: {
        attempts: 1,
        generatedAt: "2023-12-07T10:30:00.000Z",
        problemStatement: "Create a calculator...",
        language: "javascript"
    }
}
```

### Failure Response

```javascript
{
    success: false,
    error: "Code does not address the stated problem after maximum attempts",
    lastAttempt: {
        code: "// Last generated code",
        syntaxValidation: { /* validation results */ },
        reflectionResult: {
            addressesProblem: false,
            confidence: 0.25,
            issues: [
                "Code does not implement the required actions from the problem statement",
                "Code is missing key entities or components mentioned in the problem"
            ],
            suggestions: [
                "Implement missing actions: calculate, add, subtract",
                "Add the missing calculator functionality"
            ]
        },
        attempt: 3
    }
}
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Test results include:
- HTML validation tests
- CSS validation tests  
- JavaScript validation tests
- Solidity validation tests
- Self-reflection analysis tests
- Integration tests
- Error handling tests

## 📋 Examples

Run the example usage scenarios:

```bash
npm run example
```

The examples demonstrate:
- HTML contact form generation
- JavaScript calculator implementation
- CSS responsive navigation menu
- Error handling with intentional failures

## 🏗️ Architecture

### Core Components

```
validation_pipeline.js           # Main orchestrator
├── validators/
│   ├── html_validator.js       # HTML syntax validation
│   ├── css_validator.js        # CSS syntax validation
│   ├── js_validator.js         # JavaScript syntax validation
│   └── solidity_validator.js   # Solidity syntax validation
├── components/
│   └── self_reflection.js      # Problem alignment analysis
├── tests/
│   └── pipeline_test.js        # Comprehensive test suite
└── examples/
    └── usage_example.js        # Usage examples
```

### Validation Flow

```
Input Problem → Generate Code → Syntax Validation → Self-Reflection → Output
     ↑                                ↓                    ↓
     └── Regenerate (max 3 attempts) ←── FAIL ←────────────┘
```

### Self-Reflection Analysis

The self-reflection component performs:

1. **Keyword Extraction** - Identifies actions, entities, technologies, requirements
2. **Code Analysis** - Extracts functions, classes, patterns, frameworks  
3. **Alignment Checking** - Compares problem requirements with code implementation
4. **Confidence Scoring** - Calculates alignment score (0.0 - 1.0)
5. **Issue Identification** - Lists specific problems with the code
6. **Suggestion Generation** - Provides actionable improvement recommendations

## ⚙️ Configuration Options

### Pipeline Settings

```javascript
const pipeline = new ValidationPipeline();

// Set maximum regeneration attempts (default: 3)
pipeline.setMaxAttempts(5);

// Get configuration info
const stats = pipeline.getStats();
console.log(`Supports ${stats.supportedLanguages} languages`);
console.log(`Max attempts: ${stats.maxAttempts}`);
console.log(`Available validators: ${stats.validators}`);
```

### Generator Context

The code generator receives context with:

- `problemStatement` - Original problem description
- `language` - Target programming language
- `attempt` - Current attempt number (1-based)
- `previousAttempts` - Array of previous failed attempts with:
  - `attempt` - Attempt number
  - `code` - Previously generated code
  - `syntaxValidation` - Syntax validation results
  - `reflectionResult` - Self-reflection analysis

## 🛡️ Error Handling

The pipeline handles various error scenarios:

- **Invalid Language** - Rejects unsupported languages
- **Missing Generator** - Validates required parameters
- **Generator Errors** - Catches and reports generator exceptions  
- **Validation Failures** - Attempts regeneration up to max attempts
- **Syntax Errors** - Provides detailed error messages and locations
- **Alignment Issues** - Offers specific suggestions for improvement

## 📊 Best Practices

### Writing Effective Problem Statements

✅ **Good Examples:**
```
"Create a responsive contact form with name, email, and message fields that includes client-side validation"

"Implement a calculator class with add, subtract, multiply, and divide methods that handles edge cases like division by zero"

"Build a Solidity smart contract for an ERC20 token with transfer and balance functions"
```

❌ **Poor Examples:**
```
"Make something with HTML"
"Create code"  
"Build a website"
```

### Code Generator Best Practices

1. **Use Attempt Context** - Leverage previous attempt feedback
2. **Handle Edge Cases** - Include error handling and validation
3. **Follow Conventions** - Use language-specific best practices
4. **Add Documentation** - Include comments and documentation
5. **Consider Scalability** - Write maintainable, readable code

### Interpreting Results

- **Confidence Score 0.8+** - Excellent alignment with requirements
- **Confidence Score 0.6-0.8** - Good alignment, minor gaps
- **Confidence Score 0.4-0.6** - Moderate alignment, some issues
- **Confidence Score <0.4** - Poor alignment, major problems

## 🤝 Contributing

The validation pipeline is designed to be extensible:

### Adding New Language Validators

1. Create validator in `validators/` directory
2. Implement `validate(code)` method returning `{isValid, errors, warnings}`
3. Add to `ValidationPipeline.validators` mapping
4. Update `supportedLanguages` array
5. Add comprehensive tests

### Enhancing Self-Reflection

1. Extend keyword extraction in `extractProblemKeywords()`
2. Add language-specific analysis in `analyzeCodeFeatures()`  
3. Improve alignment algorithms in `checkAlignment()`
4. Add new suggestion categories in `generateSuggestions()`

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Dependencies

- **jsdom** (^22.1.0) - HTML parsing and validation
- **css** (^3.0.0) - CSS parsing and analysis
- **@babel/parser** (^7.23.0) - JavaScript AST parsing

## 🎉 Conclusion

The Code Validation Pipeline provides a robust, extensible system for ensuring generated code meets both syntactic correctness and semantic requirements. By combining traditional syntax validation with intelligent self-reflection analysis, it helps maintain high code quality and relevance to stated problems.

For questions, issues, or contributions, please refer to the test suite and examples for comprehensive usage patterns and implementation details.