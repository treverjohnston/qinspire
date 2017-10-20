<template>
    <div class="todo">
        <h1>Todo List</h1>
        <div v-for="item in todos">
            <h1>{{item.title}}</h1>
            <p>{{item.description}}</p>
        </div>
    </div>
</template>

<script>
    import {
        QBtn
    } from 'quasar'

    export default {
        name: 'todo',
        components: {
            QBtn
        },
        data() {
            return {
            }
        },
        computed: {
            todos() {
                return this.$store.state.todos
            }
        }
    }
</script>

<style>
</style>