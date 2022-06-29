<template>
    <main-modal v-if="this.state.isShowModal" title="Add Block" :isModalLoading="this.state.isModalLoading" @close="closeModal">
        <template #default>
            <new-block-ref v-for="definition in data.definitionFile.data.definitions" :key="definition.type" :type="definition.type" :image="definition.image" @add-new-block="addNewBlock"></new-block-ref>
        </template>
    </main-modal>
    <div v-if="this.state.isLoading" class="loading">
        Loading...
    </div>
    <div class="blocks-refs-container" v-else>
        <block-ref v-for="block in data.configFileBlocks" :key="block.id" :blockID="block.id" :type="block.type" @open-add-new-block-modal="openAddNewBlockModal"></block-ref>
    </div>
</template>

<script scoped>
import { generatePage, getConfigData } from '@/lib/api';
import BlockRef from "./BlockRef.vue";
import NewBlockRef from './NewBlockRef.vue';
import MainModal from './MainModal.vue';
import definitionFile from "../data/definition.js"
import { addEventListeners } from '@/utils/utils';

export default {
    name: "BlockSelector",
    components: {
        BlockRef,
        MainModal,
        NewBlockRef
    },

    data: function () {
        return {
            data: {
                configFile: {},
                configFileBlocks: {},
                definitionFile
            },
            state: {
                isLoading: true,
                isShowModal: false,
                isModalLoading: false
            },
        };
    },

    props: {
        editableBlockClicked: {
            type: Function,
            required: false,
        },

        editableBlockChildrenClicked: {
            type: Function,
            required: false,
        },

        newConfigFile: {
            type: Object,
            required: false,
        },
    },

    methods: {
        openAddNewBlockModal() {
            this.state.isShowModal = true
        },
        closeModal() {
            this.state.isShowModal = false
        },
        async addNewBlock(type) {
            this.state.isModalLoading = true
            let newBlock= {
                id: "blockID" + Math.floor(Math.random() * (99 - this.data.configFileBlocks.length+1) + this.data.configFileBlocks.length+1),
                // type: "video",
                type: "",
                version:'1',
                htmlTemplatePath: "",
                cssPath: "",
                data: {}
            };

            for (let i = 0; i < definitionFile.data.definitions.length; i++) {
                if (definitionFile.data.definitions[i].type === type) {
                    newBlock.data = definitionFile.data.definitions[i].inputs
                    newBlock.type = definitionFile.data.definitions[i].type
                    newBlock.htmlTemplatePath = `../components/${definitionFile.data.definitions[i].type}/${definitionFile.data.definitions[i].type}.ejs`
                    newBlock.cssPath = `../components/${definitionFile.data.definitions[i].type}/${definitionFile.data.definitions[i].type}.scss`
                }
            }

            this.data.configFileBlocks.push(newBlock)

            //Update UI
            const newBlocks = this.data.configFileBlocks
            const newPreviewConfig = this.data.configFile

            newPreviewConfig.data.areas[0].blocks = newBlocks

            const previewHTML = await generatePage("la-plagne",newPreviewConfig)
            var previewHTMLPageDom = new DOMParser().parseFromString(previewHTML.data,"text/html")

            const previewArea = previewHTMLPageDom.getElementById(newBlock.id).parentElement;
            let currentArea = document.getElementById(newBlocks[0].id).parentElement;

            addEventListeners(previewArea,this.editableBlockClicked,this.editableBlockChildrenClicked)

            this.$parent.$emit('update-config-locally', newPreviewConfig);

            this.$parent.$emit('select-block', newBlock);

            currentArea.replaceWith(previewArea)

            this.state.isModalLoading = false
            this.state.isShowModal = false
        }
    },

    async mounted() {
        if(this.newConfigFile?.data?.areas[0]?.blocks) {
            this.data.configFile = this.newConfigFile;
            this.data.configFileBlocks = this.data.configFile.data.areas[0].blocks
        } else {
            this.data.configFile = await getConfigData("la-plagne");
            this.data.configFileBlocks = this.data.configFile.data.areas[0].blocks
        }
        this.state.isLoading = false
    },
};
</script>

<style >
    .blocks-refs-container {
        flex: 1;
        overflow-y: scroll;
    }
</style>