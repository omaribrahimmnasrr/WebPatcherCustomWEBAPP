const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('🧪 Testing API endpoints...\n');

    try {
        // Test 1: Valid contact form submission
        console.log('1. Testing valid contact form submission...');
        const validResponse = await axios.post(`${BASE_URL}/api/contact`, {
            name: 'John Doe',
            message: 'Hello, this is a test message!'
        });
        console.log('✅ Valid submission:', validResponse.status, validResponse.data);

        // Test 2: Invalid contact form (missing name)
        console.log('\n2. Testing invalid contact form (missing name)...');
        try {
            await axios.post(`${BASE_URL}/api/contact`, {
                message: 'Hello, this is a test message!'
            });
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status, error.response.data);
        }

        // Test 3: Invalid contact form (missing message)
        console.log('\n3. Testing invalid contact form (missing message)...');
        try {
            await axios.post(`${BASE_URL}/api/contact`, {
                name: 'John Doe'
            });
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status, error.response.data);
        }

        // Test 4: Invalid contact form (empty fields)
        console.log('\n4. Testing invalid contact form (empty fields)...');
        try {
            await axios.post(`${BASE_URL}/api/contact`, {
                name: '',
                message: ''
            });
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status, error.response.data);
        }

        // Test 5: Invalid contact form (fields too long)
        console.log('\n5. Testing invalid contact form (fields too long)...');
        try {
            await axios.post(`${BASE_URL}/api/contact`, {
                name: 'A'.repeat(101), // Too long
                message: 'B'.repeat(1001) // Too long
            });
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status, error.response.data);
        }

        // Test 6: Hello API endpoint
        console.log('\n6. Testing hello API endpoint...');
        const helloResponse = await axios.get(`${BASE_URL}/api/hello`);
        console.log('✅ Hello API:', helloResponse.status, helloResponse.data);

        // Test 7: Unsafe HTML endpoint
        console.log('\n7. Testing unsafe HTML endpoint...');
        const htmlResponse = await axios.get(`${BASE_URL}/api/unsafe-html`);
        console.log('✅ Unsafe HTML:', htmlResponse.status, 'Content length:', htmlResponse.data.length);

        // Test 8: 404 endpoint
        console.log('\n8. Testing 404 endpoint...');
        try {
            await axios.get(`${BASE_URL}/api/nonexistent`);
        } catch (error) {
            console.log('✅ Correctly returned 404:', error.response.status, error.response.data);
        }

        console.log('\n🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testAPI();
}

module.exports = testAPI;
