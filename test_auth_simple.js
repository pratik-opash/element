const http = require('http');

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8500,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testAuth() {
    try {
        const email = 'auth_test_' + Date.now() + '@example.com';

        // 1. Register
        let res = await request('/api/auth/register', 'POST', {
            name: 'Test', email, password: 'pw1'
        });

        // 2. Login
        res = await request('/api/auth/login', 'POST', { email, password: 'pw1' });
        console.log('2. Login:', res.statusCode);
        if (res.statusCode !== 200) console.log("Login Error:", JSON.stringify(res.body));

        // 3. Forgot
        res = await request('/api/auth/forgot-password', 'POST', { email });
        console.log('3. Forgot:', res.statusCode);
        const token = res.body.resetToken;

        if (!token) {
            console.log('No token returned');
            return;
        }

        // 4. Reset
        res = await request('/api/auth/reset-password', 'POST', { token, newPassword: 'pw2' });
        console.log('4. Reset:', res.statusCode);

        // 5. Login New
        res = await request('/api/auth/login', 'POST', { email, password: 'pw2' });
        console.log('5. Login New:', res.statusCode, res.body.token ? 'GOT_TOKEN' : 'NO_TOKEN');
        if (res.statusCode !== 200) console.log("Login New Error:", JSON.stringify(res.body));

    } catch (error) {
        console.error('Error:', error);
    }
}

testAuth();
