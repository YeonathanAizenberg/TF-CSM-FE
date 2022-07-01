<template>
    <div v-show="isShowSideBar" class="card sidebar-component">
        <EditorsDisplayer
            v-if="this.isAnyBlockSelected"
            :handleFormDataSetUp="handleFormDataSetUp"
            :configFile="configFile"
            :editorsPayload="editorsPayload"
            @make-save-button-available="makeSaveButtonAvailable"
        ></EditorsDisplayer>
        <BlockSelector
            v-else
            :handleFormDataSetUp="handleFormDataSetUp"
            :configFile="configFile"
            :definitionFile="definitionFile"
            @make-save-button-available="makeSaveButtonAvailable"
            @update-config="updateConfig"
            @selected-block-bridge="selectedBlockBridge"
            @block-click="handleBlockClick"
        ></BlockSelector>
        <button
            :disabled="!isEdited"
            v-if="!this.isAnyBlockSelected"
            class="btn btn-primary my-2"
            @click="saveChangesHandler"
        >
            Save Changes
        </button>
    </div>


    <button
        type="button"
        @click="toggleSidebar"
        class="toggle-sidebar btn btn-primary mr-1"
        :class="{ 'move-toggle-sidebar': isShowSideBar }"
    >
        <svg
            v-if="isShowSideBar"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-right"
            viewBox="0 0 16 16"
        >
            <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
        </svg>

        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-left"
            viewBox="0 0 16 16"
        >
            <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
        </svg>
    </button>
</template>

<script>
    import EditorsDisplayer from "./EditorsDisplayer.vue";
    import BlockSelector from "./BlockSelector.vue";
    import saveNewPage from "../lib/saveNewPage"

    export default {
        name: "SidebarComp",

        components: { EditorsDisplayer, BlockSelector },

        props: {
            isShowSideBar: Boolean,
            isAnyBlockSelected:Boolean,
            handleFormDataSetUp: Function,
            configFile: Object,
            editorsPayload: Array,
            definitionFile: Object,
            isEdited: Boolean,
        },

        data: function () {
            return {
                state: {
                    isSavaButtonDisabled: true,
                },
            };
        },

        computed: {
            toggleIcon() {
                return this.isShowSideBar ? "bi-arrow-left" : "bi-arrow-right";
            },

        },
        methods: {
            toggleSidebar() {
                this.$emit("toggleSidebar");
            },

            updateConfig(newPreviewConfig){
                this.$emit('update-config', newPreviewConfig);
            },

            selectedBlockBridge(newBlock) {
                this.$emit('select-block', newBlock);
            },

            handleBlockClick(e){
                this.$emit("selected-block", e)
            },

            makeSaveButtonAvailable(){
                this.state.isSavaButtonDisabled = false
            },

            async saveChangesHandler() {
                saveNewPage(this.configFile, "la-plagne")
            },
        },
    };
</script>

<style scoped>
    .sidebar-component {
        display: flex;
        flex-direction: column;
        width: 37%;
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 100;

        background-color: #fff;
        padding: 1.5rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .toggle-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
    }
    .move-toggle-sidebar {
        right: 37%;
    }
</style>
