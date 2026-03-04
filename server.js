const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const handleError = (res, status, message, error = null) => {
    console.error(message, error || '');
    return res.status(status).json({ success: false, message });
};

app.post('/register', async (req, res) => {
    const { name, username, password, account_number } = req.body;

    if (!name || !username || !password || !account_number) {
        return handleError(res, 400, 'Vui lòng cung cấp tên, tài khoản, mật khẩu và số tài khoản!');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingUsers] = await connection.query(
            'SELECT id FROM users WHERE username = ? OR account_number = ?',
            [username, account_number]
        );
        if (existingUsers.length > 0) {
            await connection.rollback();
            return handleError(res, 400, 'Tài khoản hoặc số tài khoản đã tồn tại!');
        }

        await connection.query(
            'INSERT INTO users (name, username, password, balance, account_number) VALUES (?, ?, ?, 0.00, ?)',
            [name, username, password, account_number]
        );

        await connection.commit();
        return res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
    } catch (error) {
        if (connection) await connection.rollback();
        return handleError(res, 500, 'Lỗi đăng ký người dùng', error);
    } finally {
        if (connection) connection.release();
    }
});

app.get('/users', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return handleError(res, 400, 'Vui lòng cung cấp tài khoản để kiểm tra quyền truy cập!');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query(
            'SELECT id, name, username, balance, account_number FROM users'
        );

        if (results.length > 0) {
            return res.status(200).json({
                success: true,
                users: results
            });
        } else {
            return res.status(200).json({
                success: true,
                users: []
            });
        }
    } catch (error) {
        return handleError(res, 500, 'Lỗi truy vấn danh sách tài khoản', error);
    } finally {
        if (connection) connection.release();
    }
});

app.post('/cash-in', async (req, res) => {
    const { username, account_number, amount, recipient_name, recipient_account_number } = req.body;

    if (!username || !account_number || !amount || !recipient_name || !recipient_account_number) {
        return handleError(res, 400, 'Vui lòng cung cấp tài khoản, số tài khoản, số tiền, tên người nhận và số tài khoản người nhận!');
    }

    if (isNaN(amount) || amount <= 0) {
        return handleError(res, 400, 'Số tiền phải là một số dương!');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [userResult] = await connection.query(
            'SELECT id, balance FROM users WHERE username = ? AND account_number = ? FOR UPDATE',
            [username, account_number]
        );

        if (userResult.length === 0) {
            await connection.rollback();
            return handleError(res, 404, 'Tài khoản không tồn tại!');
        }

        const userId = userResult[0].id;
        const currentBalance = userResult[0].balance;
        const amountInCents = amount * 100;
        const newBalance = currentBalance + amountInCents;

        await connection.query(
            'UPDATE users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );

        const transactionDetails = JSON.stringify({
            username,
            account_number,
            amount,
            recipient_name,
            recipient_account_number,
            type: 'CASH_IN',
            timestamp: new Date().toISOString()
        });
        await connection.query(
            'INSERT INTO transaction_logs (details) VALUES (?)',
            [transactionDetails]
        );

        await connection.commit();
        return res.status(200).json({
            success: true,
            message: 'Nạp tiền thành công!',
            balance: newBalance / 100
        });
    } catch (error) {
        if (connection) await connection.rollback();
        return handleError(res, 500, 'Lỗi thực hiện giao dịch nạp tiền', error);
    } finally {
        if (connection) connection.release();
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return handleError(res, 400, 'Vui lòng nhập tài khoản và mật khẩu!');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query(
            'SELECT id, name, username, balance, account_number FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (results.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công!',
                user: results[0]
            });
        } else {
            return handleError(res, 401, 'Tài khoản hoặc mật khẩu không đúng!');
        }
    } catch (error) {
        return handleError(res, 500, 'Lỗi truy vấn database', error);
    } finally {
        if (connection) connection.release();
    }
});

app.post('/cash-out', async (req, res) => {
    const { username, account_number, amount, recipient_account_number, recipient_name } = req.body;

    if (!username || !account_number || !amount || !recipient_account_number || !recipient_name) {
        return handleError(res, 400, 'Vui lòng cung cấp tài khoản, số tài khoản, số tiền, số tài khoản người nhận và tên người nhận!');
    }

    const amountInCents = amount * 100;
    if (isNaN(amountInCents) || amountInCents <= 0) {
        return handleError(res, 400, 'Số tiền phải là một số dương!');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [userResult] = await connection.query(
            'SELECT id, balance FROM users WHERE username = ? AND account_number = ? FOR UPDATE',
            [username, account_number]
        );

        if (userResult.length === 0) {
            await connection.rollback();
            return handleError(res, 404, 'Tài khoản không tồn tại!');
        }

        const userId = userResult[0].id;
        const currentBalance = userResult[0].balance;

        if (currentBalance < amountInCents) {
            await connection.rollback();
            return handleError(res, 400, 'Số dư không đủ để thực hiện giao dịch!');
        }

        const newBalance = currentBalance - amountInCents;
        await connection.query(
            'UPDATE users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );

        const transactionDetails = JSON.stringify({
            username,
            account_number,
            amount,
            recipient_account_number,
            recipient_name,
            type: 'CASH_OUT',
            timestamp: new Date().toISOString()
        });
        await connection.query(
            'INSERT INTO transaction_logs (details) VALUES (?)',
            [transactionDetails]
        );

        await connection.commit();
        return res.status(200).json({
            success: true,
            message: 'Rút tiền thành công!',
            balance: newBalance / 100
        });
    } catch (error) {
        if (connection) await connection.rollback();
        return handleError(res, 500, 'Lỗi thực hiện giao dịch rút tiền', error);
    } finally {
        if (connection) connection.release();
    }
});

app.get('/transactions', async (req, res) => {
    const { username, lastTimestamp } = req.query;

    if (!username) {
        return handleError(res, 400, 'Vui lòng cung cấp tài khoản!');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const query = 'SELECT details FROM transaction_logs WHERE JSON_EXTRACT(details, "$.username") = ? AND JSON_EXTRACT(details, "$.type") = "CASH_IN"' +
                      (lastTimestamp ? ' AND JSON_EXTRACT(details, "$.timestamp") > ?' : '');
        const params = [username];
        if (lastTimestamp) params.push(lastTimestamp);

        const [results] = await connection.query(query, params);

        const transactions = results.map(row => JSON.parse(row.details));
        return res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        return handleError(res, 500, 'Lỗi truy vấn giao dịch', error);
    } finally {
        if (connection) connection.release();
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server backend đang chạy trên cổng ${port}`);
});