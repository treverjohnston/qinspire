<template>
    <div class="todo">
        <q-btn push class="full-width" color="transparent" @click="addItem" icon="note_add">Add New Item</q-btn>
        <div v-for="item in todos">
            <q-list>
                <div v-if="item.completed">
                    <q-item>
                        <q-item-side left>
                            <q-btn small push class="list" color="green-9" round icon="done" @click="toggleComplete(item._id)"></q-btn>
                        </q-item-side>
                        <q-item-main></q-item-main>
                        <q-item-side right>
                            <q-btn class="delete" small @click="deleteTask(item._id)" push round icon="delete"></q-btn>
                        </q-item-side>
                    </q-item>
                    <q-collapsible indent @click="toggleComplete(item._id)" :label="item.title">
                        <div>
                            <p>{{item.description}}</p>
                        </div>
                    </q-collapsible>
                </div>
                <div v-else>
                    <q-item>
                        <q-item-side left>
                            <q-btn push small class="list" color="red-9" round icon="clear" @click="toggleComplete(item._id)"></q-btn>
                        </q-item-side>
                        <q-item-main></q-item-main>
                        <q-item-side right>
                            <q-btn class="delete" small @click="deleteTask(item._id)" push round icon="delete"></q-btn>
                        </q-item-side>
                    </q-item>
                    <q-collapsible indent @click="toggleComplete(item._id)" :label="item.title">
                        <div>
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
        QList,
        QItemMain,
        QItemSide,
        QItemTile,
        Dialog,
        QItem
    } from 'quasar'

    export default {
        name: 'todo',
        components: {
            QBtn,
            QCollapsible,
            QList,
            QItemMain,
            QItemSide,
            QItemTile,
            Dialog,
            QItem
        },
        data() {
            return {
            }
        },
        computed: {
            todos() {
                return this.$store.state.todos
            },
            info() {
                return this.$store.state.info
            }
        },
        methods: {
            toggleComplete(id) {
                var obj = {
                    userId: this.info._id,
                    todoId: id
                }
                this.$store.dispatch('toggleComplete', obj)
            },
            addItem() {
                Dialog.create({
                    title: 'Add a ToDo Item',
                    // message: `Currently logged in as ${this.info.name}`,
                    form: {
                        title: {
                            type: 'text',
                            label: 'Task',
                            model: ''
                        },
                        description: {
                            type: 'text',
                            label: 'Description',
                            model: ''
                        }
                    },
                    buttons: [
                        {
                            label: 'Cancel',
                            color: 'negative'
                        },
                        {
                            label: 'Add Item',
                            handler: (data) => {
                                this.$store.dispatch('addTodo', data)
                            }
                        }
                    ]
                })
            },
            deleteTask(id) {
                var obj = {
                    todoId: id,
                    userId: this.info._id
                }
                var _this = this
                swal("Are you sure you want to delete this?", {
                    buttons: {
                        cancel: "Nope!",
                        delete: true,
                    },
                })
                    .then((value) => {
                        switch (value) {
                            case "delete":
                                this.$store.dispatch('deleteTodo', obj)
                                swal("Welp, that's gone forever");
                                break;

                            case "cancel":
                                return;

                            default:
                                return;
                        }
                    })
            }
        },
        mounted() {
            // this.$store.dispatch('getUserTodos', this.info._id)
        }
    }
</script>

<style scoped>
    .list {
        margin-bottom: 1rem;
    }
    .q-list{
        border: none;
    }

    .delete {
        color: rgb(190, 5, 5);
        margin-bottom: .5rem;
    }
</style>