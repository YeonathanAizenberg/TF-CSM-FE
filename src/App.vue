<template>
    <div v-if="isModeEdit">
        <editor-manager></editor-manager>
    </div>
    <div v-else>
        <div class="position-error-msg">
            <p class="display-1 text-danger">The Page is Not in Edit Mode</p>
        </div>
    </div>
</template>

<script>
import EditorManager from "./components/EditorManager.vue";
import { init } from "../swapRelatedFiles/blocks-swap.js";

export default {
    name: "App",
    components: {
        EditorManager,
    },
    data() {
        return {
            isModeEdit: false,
        };
    },

    mounted() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        if (params?.mode && params?.mode === "edit") {
            this.isModeEdit = true;

            init();
        }
    },
};
</script>

<style scoped>
.position-error-msg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
