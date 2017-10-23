import vue from 'vue'
import axios from 'axios'
import vuex from 'vuex'
import router from '../router'

var production = !window.location.host.includes('localhost');
var baseUrl = production ? '//inspireq.herokuapp.com/' : '//localhost:3000/';

let api = axios.create({
    baseURL: baseUrl + 'api/',
    timeout: 4000,
    withCredentials: true
})
let auth = axios.create({
    baseURL: baseUrl,
    timeout: 4000,
    withCredentials: true
})
let photo = axios.create({
    baseURL: 'http://www.splashbase.co/api/v1/images/search/',
    timeout: 4000,
    withCredentials: false
})
// let quote = axios.create({
//     baseURL: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
//     timeout: 4000,
//     withCredentials: true,
//     headers: {
//         "X-Mashape-Key": "UpLWWSYZ0HmshPmFybLvFyrlOWEZp1RXVu3jsnVm0B3XONFr2c",
//         "Accept": "application/json"
//     }
// })
let quote = axios.create({
    baseURL: 'http://quotesondesign.com/api/3.0/',
    timeout: 4000,
    withCredentials: false
})

vue.use(vuex)

var store = new vuex.Store({
    state: {
        todos: {},
        logged: false,
        info: {},
        photo: [{ webformatURL: "../assets/seaBackground.jpg" }],
        quote: {}
    },
    mutations: {
        clearState(state) {
            state.info = {},
                state.todos = {}
        },
        handleError(state, err) {
            console.error(err)
            // state.error = err
        },
        setTodos(state, obj) {
            for (var i = 0; i < obj.length; i++) {
                // console.log('obj',obj[i])
                var item = obj[i]
                vue.set(state.todos, item._id, item)

            }
            // console.log('setting todo', state.todos)
        },
        updateTodo(state, obj) {
            vue.set(state.todos, obj._id, obj)
        },
        addTodo(state, obj) {
            vue.set(state.todos, obj._id, obj)
            // console.log('adding to vaults', state.vaults)
        },
        setLogged(state) {
            state.logged = !state.logged
        },
        setInfo(state, obj) {
            state.info = obj.data
            // console.log('info', state.info)
        },
        clearTodos(state) {
            state.todos = {}
        },
        setPhoto(state, obj) {
            state.photo = obj
            // console.log(state.photo)
        },
        setQuote(state, obj) {
            state.quote = obj
        }
    },
    actions: {
        getQuote({ commit, dispatch }) {
            quote('api-3.0.json')
                .then(res => {
                    console.log('resquote', res)
                    commit('setQuote', res.data)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        getPhoto({ commit, dispatch }) {
            photo(`?query=mountain`)
                .then(res => {
                    // console.log(res)
                    // debugger
                    var rand = Math.floor((Math.random() * res.data.images.length) + 1);
                    commit('setPhoto', res.data.images[rand])
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        toggleComplete({ commit, dispatch }, obj) {
            api.put(`user/${obj.userId}/todos/${obj.todoId}`)
                .then(res => {
                    // console.log(res)
                    commit('updateTodo', res.data.data)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        deleteTodo({ commit, dispatch }, obj) {
            api.delete(`todo/${obj.todoId}`)
                .then(res => {
                    // console.log('delete', res)
                    commit('clearTodos')
                    dispatch('getUserTodos', obj.userId)
                })
                .catch(err => {
                    commit('handleError', err)
                    // router.push('/')
                })
        },
        getUserTodos({ commit, dispatch }, id) {
            // console.log("id", id)
            api(`user/${id}/todos`)
                .then(res => {
                    // console.log('todos',res)
                    commit('setTodos', res.data.data)
                })
                .catch(err => {
                    // console.log("eerrrroror")
                    commit('handleError', err)
                    // router.push('/')
                })
        },
        addTodo({ commit, dispatch }, obj) {
            // console.log("add vault:", obj)
            api.post('todo', obj)
                .then(res => {
                    commit('addTodo', res.data.data)
                })
                .catch(err => {
                    // console.log("eerrrroror")
                    commit('handleError', err)
                    // router.push('/')
                })
        },

        getAuth({ commit, dispatch }) {
            auth('authenticate')
                .then(res => {
                    // console.log("auth res", res)
                    if (res.data.data == null) {
                        console.log("failed login")
                        return router.push('/')
                    }
                    else if (res.data.data._id !== null) {
                        console.log("successful login")
                        commit('setLogged')
                        commit('setInfo', res.data)
                        dispatch('getUserTodos', res.data.data._id)
                    } else {
                        console.log("login failed")
                    }
                })
                .catch(err => {
                    commit('handleError', err)
                    router.push('/')
                })
        },
        register({ commit, dispatch }, obj) {
            auth.post('register', obj)
                .then(res => {
                    swal({
                        title: 'Account Created',
                        text: `Logged in as ${res.data.data.name}`,
                        timer: 3000
                    }).then(
                        function () {
                            commit('setLogged')
                            commit('setInfo', res.data)
                            dispatch('getUserTodos', res.data.data._id)
                        },
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                console.log('I was closed by the timer')
                            }
                        })
                    // console.log(res)
                })
                .catch(err => {
                    swal({
                        title: 'Something went wrong',
                        text: 'Please try again',
                        timer: 3000
                    })
                    commit('handleError', err)
                    router.push('/')
                })
        },
        login({ commit, dispatch }, obj) {
            auth.post('login', obj)
                .then(res => {
                    swal({
                        title: 'Logged in as',
                        text: res.data.data.name,
                        timer: 2000
                    }).then(
                        function () {
                            commit('setInfo', res.data)
                            commit('setLogged')
                            dispatch('getUserTodos', res.data.data._id)
                            // console.log('logres', res)
                        },
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                console.log('I was closed by the timer')
                            }
                        })
                        .catch(err => {
                            commit('handleError', err)
                            router.push('/')
                        })
                    // console.log(res)
                })
                .catch(err => {
                    swal({
                        title: 'Invalid Username or Password',
                        timer: 3000
                    })
                    commit('handleError', err)
                    router.push('/')
                })
        },
        logout({ commit, dispatch }) {
            auth.delete('logout')
                .then(res => {
                    console.log(res)
                    commit('setLogged')
                    commit('clearState')
                }).catch(err => {
                    commit('handleError', err)
                    router.push('/')
                })
        }
    }
})


export default store