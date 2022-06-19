<template>
    <div @click="$emit('close')">
        <dialog open>
            <header>
                <slot name="header">
                    <span>
                        <h3>
                            {{title}}
                        </h3>
                        <!-- <search-bar></search-bar> -->
                    </span>
                    <button @click="$emit('close')">X</button>
                </slot>
            </header>
            <section>
                <slot></slot>
            </section>
            <menu>
                <slot name="acitions"></slot>
            </menu>
        </dialog>
    </div>
</template>

<script scoped>


export default {
    name: "MainModal",

    props: {
        title: {
            type: String,
            required: false,
        },
    },

    emits: [
        'close'
    ],

    components: {

    },

    data: function () {
        return {
            data: {

            },
            state: {

            },
        };
    },

    mounted() {

    },
};
</script>

<style scoped>
    div {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100vh;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 10;
    }

    dialog {
        position: fixed;
        top: 100px;
        left: 550px;
        width: 80%;
        z-index: 100;
        border-radius: 12px;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

    header {
        background-color: white;
        color: white;
        width: 100%;
        padding: 1rem;
        display: flex;
        border-bottom: 1px solid #eee;
        align-items: center;
        justify-content: space-between;
    }

    header h3 {
        color: black;
        font-size: 1.17em;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        font-weight: 500;
    }

    button {
        padding: 5px;
        margin: 16px;
        width: 5%;
        border-radius: 3px;
        color: black;
        border: none;
        font-weight: 800;
        background-color: #f2f2f7;
    }

    button:hover {
        background-color: #dcdce0;
    }

    section {
        padding: 1rem;
    }

    menu {
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
        margin: 0;
    }

    @media (min-width: 768px) {
        dialog {
            width: 40%;
        }
    }
</style>