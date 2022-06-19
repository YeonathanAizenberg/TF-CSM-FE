<template>
    <div v-if="this.state.isLoading">
        Loading...
    </div>
    <div class="header-wrapper" v-if="!this.state.isLoading">
        <button class="btn btn-primary my-2" @click="backToBlockSelector" >
            Back
        </button>
        <div class="block-refs-wrapper">
            <div></div>
            <div>{{this.editorsPayload[0]?.blockRefType}}</div>
            <div>#{{this.editorsPayload[0]?.blockID}}</div>
        </div>
    </div>
    <div class="editor-displayer-container" v-if="!this.state.isLoading">
        <div id="editorDisplayerCarsWrapper" v-if="data.blockData?.fields">
            <div v-for="(field, index) in data.blockData.fields" :key="data.blockData.blockID + index">
                <div class="my-2">
                    <div v-if="field.type === 'image'">
                        <image-editor :blockID="data.blockData.blockID" :field="field" @update-image-locally="updateImageLocally"></image-editor>
                    </div>
                    <div v-if="field.type === 'text'">
                        <text-editor :blockID="data.blockData.blockID" :field="field"></text-editor>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button class="btn btn-primary my-2" @click="saveChangesHandler" v-if="!this.state.isLoading">
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

    emits:[
        'unselect-block', 
        'update-config-locally'
        ],

    data: function () {
        return {
            data: {
                blockData: null,
                modifiedImageUrl: ""
            },
            state: {
                isLoading: false
            },
        };
    },

    props: {
        editableBlockChildrenClicked: {
            type: Function,
            required: false,
        },
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

                this.data.blockData = block;
            },
        deep: true
        }
    },

    methods: {

        backToBlockSelector() {
            this.$parent.$emit('unselect-block');
        },

        updateImageLocally(newImageUrl) {
            // this.data.modifiedImageUrl = newImageUrl
            console.log('newImageUrl',newImageUrl)
        },

        async saveChangesHandler() {
            this.state.isLoading = true
            const currentBlockId = this.data.blockData.blockID
            let currentBlock = document.getElementById(currentBlockId);
            const configData = await getConfigData("la-plagne")

            let newConfigData = []

            for (let i = 0; i < configData.data.areas[0].blocks.length; i++) {
                if (configData.data.areas[0].blocks[i].id === currentBlockId) {
                    if(configData.data.areas[0].blocks[i].type === "borderText") {
                        configData.data.areas[0].blocks[i].data.linkText = this.data.blockData.fields[2].data
                        configData.data.areas[0].blocks[i].data.text = this.data.blockData.fields[1].data
                        configData.data.areas[0].blocks[i].data.title = this.data.blockData.fields[0].data
                    } else {
                        configData.data.areas[0].blocks[i].data.title = this.data.blockData.fields[0].data
                        // configData.data.areas[0].blocks[i].data.url = this.data.modifiedImageUrl
                        configData.data.areas[0].blocks[i].data.url = "https://picsum.photos/200"
                    }
                }
                newConfigData = configData
            }

            for (let i = 0; i < newConfigData.data.areas[0].blocks.length; i++) {
                if (newConfigData.data.areas[0].blocks[i].id === currentBlockId) {
                    if(newConfigData.data.areas[0].blocks[i].type === "borderText") {
                        if(newConfigData.data.areas[0].blocks[i].data.linkText.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.linkText = newConfigData.data.areas[0].blocks[i].data.linkText.split('<p>')[1].split('</p>')[0] 
                        }
    
                        if(newConfigData.data.areas[0].blocks[i].data.text.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.text = newConfigData.data.areas[0].blocks[i].data.text.split('<p>')[1].split('</p>')[0]
                        }
    
                        if(newConfigData.data.areas[0].blocks[i].data.title.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.title = newConfigData.data.areas[0].blocks[i].data.title.split('<p>')[1].split('</p>')[0]
                        }
                    } else {
                        if(newConfigData.data.areas[0].blocks[i].data.title.includes('<p>')) {
                            newConfigData.data.areas[0].blocks[i].data.title = newConfigData.data.areas[0].blocks[i].data.title.split('<p>')[1].split('</p>')[0]
                        }
                    }
                }
            }

            this.$parent.$emit('update-config-locally', newConfigData);

            await updateConfigData(newConfigData,"la-plagne")

            const newHTMLPage = await getPage("la-plagne")

            var newHTMLPageDom = new DOMParser().parseFromString(newHTMLPage.data,"text/html")

            const newHTMLPageBlock = newHTMLPageDom.getElementById(currentBlockId)

            const newHTMLPageBlockChildren = newHTMLPageBlock.children

            for (const children of newHTMLPageBlockChildren) {
                children.addEventListener("click", this.editableBlockChildrenClicked);
            }

            currentBlock.replaceChildren(...newHTMLPageBlockChildren)

            this.state.isLoading = false
        },
    },
};
</script>

<style scoped>
    .header-wrapper{
        z-index: +1;
        display: flex;
        flex-direction: row;
        height: 5%;
        justify-content: flex-start;
        align-items: center;
    }

    .editor-displayer-container {
        flex: 1;
        overflow-y: scroll;
    }

    .block-refs-wrapper {
        margin: 1%;
    }

    .block-refs-wrapper:hover {
        margin: 1%;
        background-color: #f2f2f3;
    }
</style>