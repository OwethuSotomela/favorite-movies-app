const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

module.exports = function (app, db) {

    app.get('/api/test', function (req, res) {
        res.json({
            name: "OwSoto"
        })
    })

    app.post('/api/signup', async function (req, res) {
        try {
            const { firstname, lastname, username, password } = req.body;

            console.log({ firstname, lastname, username, password });


            var newUser = await db.oneOrNone("SELECT * FROM users WHERE username = $1", [username])

            if (newUser !== null) {
                throw new Error('User already exist!')
            }

            const encrypted = await bcrypt.hash(password, 10)

            await db.none(`INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)`, [firstname, lastname, username, encrypted]);
            res.status(200).json({
                message: 'New user successfully registered'
            })

        } catch (e) {
            console.log(e.message)
            res.status(500).json({
                message: e.message
            })
        }
    })

    app.post('/api/login', async function (req, res) {
        try {
            const { username, password } = req.body;

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username]);

            if (!user) {
                isValidUser = await bcrypt.compare(password, user.encrypted)

                if (!isValidUser) {
                    return res.status(500).json({
                        success: false,
                        access_token: null
                    });
                }
            } else {
                jwt.sign({ user }, 'secret', { expiresIn: '24h' }, (err, token) => {
                    return res.json({
                        success: true,
                        access_token: token
                    });
                })
            }

        } catch (error) {
            console.error(error.message);
        }
    })

    app.post('/playlist', async function (req, res) {
        try {

        } catch {

        }
    })

}