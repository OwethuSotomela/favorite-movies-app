const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const axios = require('axios');

module.exports = function (app, db) {

    async function getMovieById(id) {
        return axios
            .get(`https://api.themoviedb.org/3/movie/${id}?api_key=74c04fd4828b28c1f0cefa3baff1bbfa&append_to_response=videos`)
            .then((myMovie) => {
                return myMovie.data
            })

    }

    app.get('/api/test', function (req, res) {
        res.json({
            name: "OwSoto"
        })
    })

    app.post('/api/signup', async function (req, res) {
        try {
            const { firstname, lastname, username, password } = req.body;

            console.log({ firstname, lastname, username, password });

            console.log({ username });

            if (username == null) {
                throw new Error("Username should be entered")
            }

            if (password == null) {
                throw new Error("Password should be entered")
            }

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
                        access_token: null,
                        user: null
                    });
                }
            } else {
                jwt.sign({ user }, 'secret', { expiresIn: '24h' }, (err, token) => {
                    return res.json({
                        success: true,
                        access_token: token,
                        user: user
                    });
                })
            }

        } catch (error) {
            console.error(error.message);
        }
    })

    app.post('/api/movie/:id', async function (req, res) {
        try {
            const { username } = req.body

            const { id } = req.params;

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username])

            if (!user) {
                console.log('No one home')
            } else {
                await db.none(`INSERT INTO user_playlist (users_id, movie_list) VALUES ($1, $2)`, [user.id, id])

                res.status(200).json({
                    message: 'A movie added into the playlist',
                    user
                })
            }

        } catch (error) {
            console.error(error.message);
        }
    })

    app.get('/api/playlist/:username', async function (req, res) {
        try {

            const { username } = req.params

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username])
            
            if (!user) {
                console.log('No user here')
            }

            const movieIds = await db.manyOrNone(`SELECT * FROM user_playlist WHERE users_id = $1`, [user.id]);

            const moviesPromises = movieIds.map(async (movie) => {
                return await getMovieById(movie.movie_list)
            })

            const movies = await Promise.all(moviesPromises)

            res.json({
                user: user,
                data: movies,
            })
        } catch(e) {
            console.log(e)
            res.status(500).json({
               error: e.message
            })
        }
    })

	app.delete('/api/playlist/:id', async function (req, res) {

		try {
			const { id } = req.params;
			const movieRemoved = await db.one(`DELETE FROM user_playlist WHERE movie_list = $1`, [id])

			res.json({
				message: 'Movie deleted',
				data: movieRemoved
			})
		} catch (err) {
			res.json({
				status: 'Failed to delete',
				error: err.stack
			})
		}
	})

}

