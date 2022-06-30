import axios from 'axios';

const appState = {
    Login: 'LOGIN',
    Signup: 'SIGNUP',
    Home: 'HOME',
}
export default function MovieAPI() {
    return {
        appState: 'LOGIN',
        isOpen: false,
        apiKey: '74c04fd4828b28c1f0cefa3baff1bbfa',
        baseURL: 'https://image.tmdb.org/t/p/original/',
        moviesFound: null,
        name: null,
        pic: null,
        image: null,
        feedback: null,
        init() {
            if (localStorage['user']) {
                this.isOpen = true;
                this.appState = appState.Home
                this.user = localStorage.getItem('user')
            }
        },
        user: {
            firstname: null,
            lastname: null,
            username: null,
            password: null
        },
        logUser: {
            username: null,
            password: null
        },
        movieSearch: null,
        users: [],
        token: null,
        gotToSignUp() {
            this.appState = appState.Signup;
        },
        gotToLogin() {
            this.appState = appState.Login;
        },
        signup() {
            try {
                const signupUser = this.user
                axios
                    .post('http://localhost:5000/api/signup', signupUser)
                    .then((myApp) => {
                        console.log(myApp.data)
                        this.feedback = myApp.data.message
                        this.users = myApp.data;
                    }).catch(err => {
                        console.log(err)
                        this.feedback = err.response.data.message
                        setTimeout(() => {
                            this.feedback = ''
                        }, 3000)
                    })

            } catch (err) {
            }
        },
        login() {
            const loginUser = this.logUser;
            axios
                .post('http://localhost:5000/api/login', loginUser)
                .then((myApp) => {
                    console.log(myApp.data)
                    this.feedback = myApp.data.message
                    var { access_token, user } = myApp.data;

                    if (!access_token) {
                        return false
                    }
                    
                    this.appState = appState.Home
                    this.isOpen = true;
                    this.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    this.token = access_token
                    localStorage.setItem('access_token', this.token);
                    setTimeout(() => {
                        this.token = ''
                    }, 4000);
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        findMovies() {
            const myKey = this.apiKey
            const findMovie = this.movieSearch
            axios
                .get(`https://api.themoviedb.org/3/search/movie?api_key=${myKey}&query=${findMovie}`)
                .then((myMovies) => {
                    const { results } = myMovies.data
                    this.moviesFound = results
                })
                .then(console.log)
                .catch((err) => {
                    console.log(err)
                });
        },
        addToPlaylist(addFaveMovie) {
            console.log(addFaveMovie)

            try {
            const { username } = this.user.username ? this.user : JSON.parse(localStorage.getItem('user'))

            alert(username)

            axios
                .post(`http://localhost:5000/api/movie/${addFaveMovie.id}`, { username, title: addFaveMovie.title })
                .then(result => result.data)
                .then((data) => {
                    console.log(data)

                    console.log(result)

                    this.user = data.user;
                    console.log(this.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                })
            this.feedback = 'Just checking'
            setTimeout(() => {
                this.feedback = ''
            }, 3000)
            } catch (err) {
                alert(err);
            }

        },
        logout() {
            this.isOpen = !this.isOpen
            this.appState = appState.Login
            localStorage.clear()
        },
    }
}