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
        playlist(){
            alert('Hi, Oz!')
        }
    }
}