// controllers/UserController.js

const bcrypt = require('bcrypt');
const pool = require('../db/connectDB')();
var jwt = require('jsonwebtoken');

class UserController {

    static register = async (req, res) => {
        try {
            const { name, email, mobileNumber, alternateNumber, password, pincode, city, state, country, role } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const [isUserExist] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

            if (isUserExist.length > 0) {
                res.status(401).json({ 'status': 'failed', 'message': 'Email Already Registered' });
            } else {
                const [isUserExistWithMobileNumber] = await pool.query('SELECT * FROM users WHERE mobileNumber = ?', [mobileNumber]);

                if (isUserExistWithMobileNumber.length > 0) {
                    res.status(401).json({ 'status': 'failed', 'message': 'Mobile Number Already Registered' });
                } else {
                    const [dataSaved] = await pool.query('INSERT INTO users SET ?', {
                        name,
                        mobileNumber,
                        alternateNumber,
                        email,
                        pincode,
                        city,
                        state,
                        country,
                        password: hashPassword,
                        role: role || "User",
                    });
    
                    if (dataSaved.affectedRows > 0) {
                        const accountSid = 'ACf9e834e4785ab47528169a86c521d1bc';
                        const authToken = '6c3ceeff670fb96ab31c8d0f08afd5a0';
                        const client = require('twilio')(accountSid, authToken);
    
                        client.messages
                            .create({
                                body: `Thank you for registering at Studio Sasvat! We’re excited to have you on board and can’t wait for you to explore our unique collection of art and decor. Happy shopping!`,
                                from: 'whatsapp:+14155238886',
                                to: `whatsapp:+91${mobileNumber}`
                            })
                            .then(message => console.log(message.sid))
                            
                        res.status(201).json({ 'status': 'success', 'message': 'Registration Successful' });
                    } else {
                        res.status(401).json({ 'status': 'failed', 'message': 'Internal Server Error' });
                    }
                }
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (email && password) {
                const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

                if (user.length > 0) {
                    const isPasswordMatched = await bcrypt.compare(password, user[0].password);

                    if (isPasswordMatched) {
                        const token = jwt.sign({
                            id: user[0]._id,
                            name: user[0].name,
                            email: user[0].email,
                            mobileNumber: user[0].mobileNumber,
                            alternateNumber: user[0].alternateNumber,
                            pincode: user[0].pincode,
                            city: user[0].city,
                            state: user[0].state,
                            country: user[0].country,
                            role: user[0].role,
                        },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '30 days' });

                        res.status(200).json({ 'status': 'success', 'message': 'Login Successfully', token });
                    } else {
                        res.status(401).json({ 'status': 'failed', 'message': 'Invalid Email or Password' });
                    }
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'User not Found' });
                }
            } else {
                res.status(400).json({ 'status': 'failed', 'message': 'All Fields are required' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchUserById = async (req, res) => {
        try {
            const userId = req.user_id;
            const [data] = await pool.query('SELECT * FROM users WHERE _id = ?', [userId]);

            if (data.length > 0) {
                res.status(200).json({
                    success: true,
                    data: data[0]
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAllUsers = async (req, res) => {
        try {
            const searchedRole = req.headers["searched-status"] || '';
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
    
            const fetchRecordTill = recordsPerPage * pageNumber;
            const fetchRecordFrom = fetchRecordTill - recordsPerPage;

            const [allUsers] = await pool.query(`SELECT * FROM users`)
            const totalRecords = allUsers.length

            if (searchedRole == '') {
                if (searchedRecord == '') {
                    var [data] = await pool.query('SELECT * FROM users ORDER BY _id DESC LIMIT ? OFFSET ?', [recordsPerPage, fetchRecordFrom]);
                } else {
                    var [data] = await pool.query(`SELECT * FROM users WHERE (name LIKE '%${searchedRecord}%' OR mobileNumber LIKE '%${searchedRecord}%' OR email LIKE '%${searchedRecord}%') ORDER BY _id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
                }
            } else {
                if (searchedRecord == '') {
                    var [data] = await pool.query(`SELECT * FROM users WHERE role = '${searchedRole}' ORDER BY _id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
                } else {
                    var [data] = await pool.query(`SELECT * FROM users WHERE (name LIKE '%${searchedRecord}%' OR mobileNumber LIKE '%${searchedRecord}%' OR emailr LIKE '%${searchedRecord}%') AND role = '${searchedRole}' ORDER BY _id DESC LIMIT ? OFFSET ?`, [recordsPerPage, fetchRecordFrom]);
                }
            }

            res.status(200).json({
                success: true,
                data,
                totalRecords
            });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static changeUserStatus = async (req, res) => {
        try {
            const userId = req.params.id;
    
            const [userData] = await pool.query(`SELECT * FROM users WHERE _id = ?`, [userId]);
    
            if (userData && userData.length > 0) {
                let newRole;
    
                if (userData[0].role === 'Admin') {
                    newRole = 'User';
                } else {
                    newRole = 'Admin';
                }
    
                console.log(`Changing role to: ${newRole}`);
    
                const [dataSaved] = await pool.query('UPDATE users SET role = ? WHERE _id = ?', [newRole, userId]);
    
                if (dataSaved.affectedRows > 0) {
                    res.status(200).json({ status: 'success', message: 'User Status Updated Successfully' });
                } else {
                    res.status(500).json({ status: 'failed', message: 'Failed to update user role' });
                }
            } else {
                res.status(404).json({ status: 'failed', message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    }

    static updateUser = async (req, res) => {
        try {
            const userId = req.user_id;
            const { name, pincode, city, state, country } = req.body;

            const [dataSaved] = await pool.query('UPDATE users SET ? WHERE _id = ?', [{
                name,
                pincode,
                city,
                state,
                country,
            }, userId]);

            if (dataSaved.affectedRows > 0) {
                res.status(200).json({ 'status': 'success', 'message': 'Your Details Updated Successfully' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static forgotPassword = async (req, res) => {
        try {
            const { mobileNumber } = req.body;
    
            const [user] = await pool.query('SELECT * FROM users WHERE mobileNumber = ?', [mobileNumber]);
    
            if (user.length === 0) {
                return res.status(404).json({ 'status': 'failed', 'message': 'User not found' });
            }
    
            const otp = Math.floor(100000 + Math.random() * 900000);
    
            await pool.query('DELETE FROM tokens WHERE mobileNumber = ?', [mobileNumber]);
    
            await pool.query('INSERT INTO tokens SET ?', {
                mobileNumber,
                otp,
            });
    
            const accountSid = 'ACf9e834e4785ab47528169a86c521d1bc';
            const authToken = '6c3ceeff670fb96ab31c8d0f08afd5a0';
            const client = require('twilio')(accountSid, authToken);
    
            client.messages
                .create({
                    body: `Your OTP for password reset is ${otp}. Do not share it with anyone.`,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:+91${mobileNumber}`
                })
                .then(message => console.log(`OTP sent: ${message.sid}`));
    
            res.status(200).json({ 'status': 'success', 'message': 'OTP sent to your WhatsApp number', 'userId': user[0]._id });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static verifyOtp = async (req, res) => {
        try {
            const { mobileNumber, otp } = req.body;
    
            const [tokenRecord] = await pool.query('SELECT * FROM tokens WHERE mobileNumber = ? AND otp = ?', [mobileNumber, otp]);
    
            if (tokenRecord.length === 0) {
                return res.status(401).json({ 'status': 'failed', 'message': 'Invalid OTP' });
            }
    
            // OTP verified
            res.status(200).json({ 'status': 'success', 'message': 'OTP verified' });
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const { userId, newPassword, confirmPassword } = req.body;
    
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ 'status': 'failed', 'message': 'Passwords do not match' });
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);
    
            const [dataSaved] = await pool.query('UPDATE users SET password = ? WHERE _id = ?', [hashPassword, userId]);
    
            if (dataSaved.affectedRows > 0) {
                res.status(200).json({ 'status': 'success', 'message': 'Password reset successful' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }
        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

}

module.exports = UserController;