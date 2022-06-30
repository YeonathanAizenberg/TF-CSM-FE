<template>
    <teleport to="body">
        <div >
            <dialog open>
                <header>
                    <slot name="header">
                        <span>
                            <h3>
                                {{title}}
                            </h3>
                            <!-- <search-bar></search-bar> -->
                        </span>
                        <button @click="handleClose">X</button>
                    </slot>
                </header>
                <section  v-if="isModalLoading" class="loading">
                    <slot name="loading"></slot>
                </section>
                <section v-else >
                    <slot ></slot>
                </section>
                <menu>
                    <slot name="acitions"></slot>
                </menu>
            </dialog>
        </div>
    </teleport>
</template>

<script scoped>
    export default {
        name: "MainModal",

        props: {
            title: String,
            isModalLoading: Boolean,
        },

        methods:{
            handleClose(){
                this.$emit('close')
            }
        }
    };
</script>

<style scoped>
    div {
        position: fixed;
        display: flex;
        align-items: center;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100vh;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 100;
    }

    dialog {
        width: 820px;
        z-index: 100;
        border-radius: 12px;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        height: 512px;
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
        font-weight: 600;
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
        height: 83%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        overflow: auto;
    }

    menu {
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
        margin: 0;
    }

    .loading {
        position: absolute;
        top: 45%;
        left: 45%;
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #005fa9;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
}
</style>