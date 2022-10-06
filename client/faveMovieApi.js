import axios from 'axios';

// const URL_BASE = import.meta.env.VITE_SERVER_URL;
const URL_Heroku = 'https://movies-app-os.herokuapp.com';

const appState = {
    Login: 'LOGIN',
    Signup: 'SIGNUP',
    Home: 'HOME',
    Playlist: 'PLAYLIST'
}
export default function MovieAPI() {
    return {
        appState: 'LOGIN',
        isOpen: false,
        apiKey: '74c04fd4828b28c1f0cefa3baff1bbfa',
        moviesFound: null,
        name: null,
        pic: null,
        image: null,
        myPlaylist: [],

        feedback: '',
        playfeed: '',
        removefeed: '',
        movieAdded: 'New movie added to the playlist !',
        movieRemoved: 'Movie removed from the playlist !',
        notSearched: 'Enter the name of the movie click search button',

        init() {

            if (localStorage['user'] !== 'undefined') {
                this.isOpen = true;
                // this.appState = appState.Login
                if (localStorage['user']) {
                    this.user = localStorage.getItem('user')
                    if (localStorage['screen']) {
                        console.log(localStorage.getItem('screen'))
                        alert(localStorage.getItem('screen'))
                        localStorage.getItem('screen')
                    } else {
                        this.changeScreen(appState.Home)
                    }
                    if (localStorage["user"]) {
                        this.user = localStorage.getItem("user");
                    }
                }
            }
        },

        changeScreen(name) {
            this.appState = name;
            localStorage.setItem('screen', name)
        },

        user: {
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            proPic: ''
        },
        logUser: {
            username: 'OwSoto',
            password: 'owe123'
        },
        movieSearch: '',
        users: [],
        token: '',

        gotToSignUp() {
            this.changeScreen(appState.Signup);
        },
        gotToLogin() {
            this.changeScreen(appState.Login);
        },
        signup() {
            try {
                const signupUser = this.user
                console.log({ signupUser: this.user });
                axios
                    .post(`${URL_Heroku}/api/signup`, signupUser)
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
                .post(`${URL_Heroku}/api/login`, loginUser)
                .then((myApp) => {
                    // console.log(myApp.data)
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
                    }, 3000);
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    this.feedback = err.response.data.message
                    setTimeout(() => {
                        this.feedback = ''
                    }, 3000)
                });
        },

        findMovies() {
            const myKey = this.apiKey
            const findMovie = this.movieSearch

            if (!findMovie) {

                setTimeout(() => {
                    this.openPopup()
                }, 1000)

            } else {

                axios
                    .get(`https://api.themoviedb.org/3/search/movie?api_key=${myKey}&query=${findMovie}`)
                    .then((myMovies) => {
                        const { results } = myMovies.data
                        this.moviesFound = results
                        console.log(this.moviesFound)
                    })
                    .then(
                        setTimeout(() => {
                            this.displayMovies()
                        })
                    )
                    .catch((err) => {
                        console.log(err)
                    });
            }

        },

        displayMovies() {
            movies.classList.add("show-movies")
        },

        addToPlaylist(addFaveMovie) {
            try {
                const { username } = this.user.username ? this.user : JSON.parse(localStorage.getItem('user'))
                axios
                    .post(`${URL_Heroku}/api/movie/${addFaveMovie.id}`, { username })
                    .then(result => result.data)
                    .then((data) => {
                        this.gettingUserPlaylist()
                    })
                this.playfeed = this.movieAdded
                setTimeout(() => {
                    this.playfeed = ''
                }, 4000)
            } catch (err) {
                // alert(err.message);
            }
        },
        gettingUserPlaylist() {
            alert("Are you working?")
            const { username } = this.user.username ? this.user : JSON.parse(localStorage.getItem('user'))
            axios
                .get(`${URL_Heroku}/api/playlist/${username}`)
                .then(r => r.data)
                .then((myMovies) => {

                    this.myPlaylist = myMovies.data
                    this.user = myMovies.user;

                    localStorage.setItem('user', JSON.stringify(this.user));
                }).catch(e => {
                    console.log(e);
                    // alert('Error')
                })
        },
        deleteMovie(faveMovie) {
            try {
                axios
                    .delete(`${URL_Heroku}/api/playlist/${faveMovie.id}`)
                    .then(() => this.gettingUserPlaylist())

                this.removefeed = this.movieRemoved
                setTimeout(() => {
                    this.removefeed = ''
                }, 4000)
                    .catch(e => {
                        console.log(e);
                    })
            } catch (e) {
                console.log(e.message)

            }
        },
        gotToPlaylist() {
            this.changeScreen(appState.Playlist)
        },
        logout() {
            this.isOpen = !this.isOpen
            this.appState = appState.Login
            localStorage.clear()
        },

        // testing this popup here 
        openPopup() {
            popup.classList.add("open-popup")
        },
        closePopup() {
            popup.classList.remove("open-popup")
        }
    }
}