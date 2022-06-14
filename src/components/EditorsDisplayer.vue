<template>
    <div class="editor-displayer-container">
        <div id="editorDisplayerCarsWrapper" v-if="blockData?.fields">
            <div v-for="(field, index) in blockData.fields" :key="blockData.blockID + index">
                <div class="my-2">
                    <div v-if="field.type === 'image'">
                        <image-editor :blockID="blockData.blockID" :field="field" ></image-editor>
                    </div>
                    <div v-if="field.type === 'text'">
                        <text-editor :blockID="blockData.blockID" :field="field"></text-editor>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button class="btn btn-primary my-2" @click="saveChangesHandler">
        Save Changes
    </button>
</template>

<script>
import TextEditor from "./editors/TextEditor.vue";
import ImageEditor from "./editors/ImageEditor.vue";
import {
    getConfigData, 
    getPage,
    updateConfigData
} from "../lib/api.js";

export default {
    name: "EditorsDisplayer",
    components: {
        TextEditor,
        ImageEditor,
    },
    data: function () {
        return {
            blockData: null,
            editorID: null
        };
    },
    inject: ["editorsPayload"],
    computed: {
        isEditorsPayloadNotEmpty() {
            return this.editorsPayload?.length > 0;
        },
    },

    watch: {
        editorsPayload: {
            handler(newValue) {

                const block = {
                    blockID: newValue[0].blockID,
                    fields: []
                };

                for (let index = 0; index < newValue.length; index++) {
                    const element = newValue[index];

                    const obj = {
                        type: element.type,
                        data: element.data,
                        inputSectionName: element.inputSectionName,
                    };

                    block.fields.push(obj);
                }

                this.blockData = block;
            },
        deep: true
        }
    },

    methods: {
        async saveChangesHandler() {
            const currentBlockId = this.blockData.blockID
            let currentBlock = document.getElementById(currentBlockId);
            const configData = await getConfigData("la-plagne")

            let newConfigData = []

            for (let i = 0; i < configData.data.areas[0].blocks.length; i++) {
                if (configData.data.areas[0].blocks[i].id === currentBlockId) {
                        configData.data.areas[0].blocks[i].data.linkText = this.blockData.fields[2].data
                        configData.data.areas[0].blocks[i].data.text = this.blockData.fields[1].data
                        configData.data.areas[0].blocks[i].data.title = this.blockData.fields[0].data
                }
                newConfigData = configData
            }

            for (let i = 0; i < newConfigData.data.areas[0].blocks.length; i++) {
                if (newConfigData.data.areas[0].blocks[i].id === currentBlockId) {
                        if(newConfigData.data.areas[0].blocks[i].data.linkText.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.linkText = newConfigData.data.areas[0].blocks[i].data.linkText.split('<p>')[1].split('</p>')[0] 
                        }

                        if(newConfigData.data.areas[0].blocks[i].data.text.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.text = newConfigData.data.areas[0].blocks[i].data.text.split('<p>')[1].split('</p>')[0]
                        }

                        if(newConfigData.data.areas[0].blocks[i].data.title.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.title = newConfigData.data.areas[0].blocks[i].data.title.split('<p>')[1].split('</p>')[0]
                        }
                }
            }

            this.$parent.$emit('yeoni-test');

            await updateConfigData(newConfigData,"la-plagne")

            const newHTMLPage = await getPage("la-plagne")

            var newHTMLPageDom = new DOMParser().parseFromString(newHTMLPage.data,"text/html")

            const newHTMLPageBlock = newHTMLPageDom.getElementById(currentBlockId)

            const newHTMLPageBlockChildren = newHTMLPageBlock.children

            currentBlock.replaceChildren(...newHTMLPageBlockChildren)
        },
    },
};
</script>

<style scoped>
    .editor-displayer-container {
        flex: 1;
        overflow-y: scroll;
    }
</style>