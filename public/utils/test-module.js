/**
 * Test Module for LazyLoader Testing
 * Simple module to test dynamic loading functionality
 */

export default class TestModule {
    constructor() {
        this.name = 'TestModule';
        this.version = '1.0.0';
        this.loaded = true;
    }

    getInfo() {
        return {
            name: this.name,
            version: this.version,
            loaded: this.loaded,
            timestamp: Date.now()
        };
    }

    testMethod() {
        return 'Test method executed successfully';
    }
}

// Named exports for testing
export const testFunction = () => 'Test function executed';
export const testConstant = 'test-value'; 