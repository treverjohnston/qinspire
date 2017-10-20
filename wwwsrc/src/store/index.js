import vue from 'vue'
import axios from 'axios'
import vuex from 'vuex'
import router from '../router'

var production = !window.location.host.includes('localhost');
var baseUrl = production ? '//keepur.herokuapp.com/' : '//localhost:3000/';

let api = axios.create({
    // baseURL: '//keepur.herokuapp.com/api/',
    baseURL: baseUrl + 'api/',
    timeout: 4000,
    withCredentials: true
})
let auth = axios.create({
    // baseURL: '//keepur.herokuapp.com/',
    baseURL: baseUrl,
    timeout: 4000,
    withCredentials: true
})

vue.use(vuex)

var store = new vuex.Store({
    state: {
        todos: {},
        logged: false,
        info: {}
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
                // console.log(obj[i])
                var item = obj[i]
                vue.set(state.todos, item._id, item)

            }
            // console.log('setting todo', state.todos)
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
        }
    },
    actions: {

        deleteTodo({ commit, dispatch }, obj) {
            api.delete(`todo/${obj.todoId}`)
                .then(res => {
                    // console.log('delete', res)
                    // commit('resetState')
                    dispatch('getTodos')
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
        // getTodos({ commit, dispatch }) {
        //     api('todo')
        //         .then(res => {
        //             // console.log('settinvaults', res.data.data)
        //             commit('setTodos', res.data.data)
        //         })
        //         .catch(err => {
        //             // console.log("eerrrroror")
        //             commit('handleError', err)
        //             // router.push('/')
        //         })
        // },

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
                        .catch(err => {
                            commit('handleError', err)
                            router.push('/')
                        })
                    // console.log(res)
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