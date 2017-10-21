<template>
    <div class="todo">
        <h1>Todo List</h1>
        <div v-for="item in todos">
            <q-list inset-separator>
                <div v-if="item.completed">
                    <q-collapsible @click="toggleComplete(item._id)" icon-toggle icon="done" :label="item.title">
                        <div>
                            <q-btn @click="toggleComplete(item._id)" icon="done"></q-btn>
                            <p>{{item.description}}</p>
                        </div>
                    </q-collapsible>
                </div>
                <div v-else>
                    <q-collapsible @click="toggleComplete(item._id)" icon-toggle icon="clear" :label="item.title">
                        <div>
                                <q-btn @click="toggleComplete(item._id)" icon="clear"></q-btn>                                
                            <p>{{item.description}}</p>
                        </div>
                    </q-collapsible>
                </div>
            </q-list>
        </div>
    </div>
</template>

<script>
    import {
        QBtn,
        QCollapsible,
        QList
    } from 'quasar'

    export default {
        name: 'todo',
        components: {
            QBtn,
            QCollapsible,
            QList
        },
        data() {
            return {
            }
        },
        computed: {
            todos() {
                return this.$store.state.todos
            },
            info(){
                return this.$store.state.info
            }
        },
        methods:{
            toggleComplete(id){
                var obj = {
                    userId: this.info._id,
                    todoId: id
                }
                this.$store.dispatch('toggleComplete', obj)
            }
        }
    }
</script>

<style>
</style>