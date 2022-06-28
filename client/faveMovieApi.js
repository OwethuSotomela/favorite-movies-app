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
        moviesFound: null,
        name: null,
        pic: null,
        image: null,
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
            const signupUser = this.user
            axios
                .post('http://localhost:5000/api/signup', signupUser)
                .then((myApp) => {
                    console.log(myApp.data)
                })
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
                    this.parseJwt()
                    this.token = JSON.stringify(this.parseJwt(access_token))
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
        parseJwt: (access_token) => {
            try {
                return JSON.parse(atob(access_token.split('.')[1]));
            } catch (e) {
                return null;
            }
        },
        findMovies() {
            const myKey = this.apiKey
            const findMovie = this.movieSearch
            axios
                .get(`https://api.themoviedb.org/3/search/movie?api_key=${myKey}&query=${findMovie}`)
                .then((myMovies) => {
                    console.log(myMovies)
            
                    this.moviesFound = JSON.stringify(myMovies.data)
                    // this.moviesFound = myMovies.data.id 
                    // this.name = myMovies.data.title
                    // this.pic = myMovies.data.backdrop_path
                    // this.image = myMovies.data.poster_path
                    // console.log(this.title, this.pic, this.name)
                })
                .catch((err) => {
                    console.log(err)
                });

        },
        logout() {
            this.isOpen = !this.isOpen
            this.appState = appState.Login
            localStorage.clear()
        },
    }
}