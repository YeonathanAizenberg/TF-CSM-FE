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
                        <text-editor :blockID="data.blockData.blockID" :field="field" @update-area-with-preview="updateAreaWithPreview"></text-editor>
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
    generatePage,
    getConfigData, 
    getPage,
    updateConfigData
} from "../lib/api.js";
import { addEventListeners, scrollToselectedtBlock } from '@/utils/utils';

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
                modifiedImageUrl: "",
                editorsPayloadNewBlock: null
            },
            state: {
                isLoading: false
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

        configFile: {
            type: Object,
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
                console.log("newValue",newValue)
                this.addBlockData(newValue)
            },
        deep: true,
        },
    },

    mounted() {
        // We need it for new block. For the exixting blocks, we have a initial Proxy, so the watch works as it should
        this.data.editorsPayloadNewBlock = this.editorsPayload
        if(this.editorsPayload.length > 0) {
            this.addBlockData(this.data.editorsPayloadNewBlock)
        }
    },

    methods: {
        addBlockData(newValue) {
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

        backToBlockSelector() {
            this.$parent.$emit('unselect-block');
        },

        async updateAreaWithPreview() {
            const previewBlockModified = this.data.blockData
            let previewBlocksConfig = this.configFile
            let currentBlock;

            // Get the current block
            for (let i = 0; i < previewBlocksConfig.data.areas[0].blocks.length; i++) {
                previewBlocksConfig.data.areas[0].blocks[i].id === previewBlockModified.blockID ? 
                currentBlock = previewBlocksConfig.data.areas[0].blocks[i] : null
            }

            for (let i = 0; i < previewBlockModified.fields.length; i++) {
                let currentKey = Object.keys(currentBlock.data)[i]
                previewBlockModified.fields[i].inputSectionName === currentKey ? 
                currentBlock.data[currentKey] = previewBlockModified.fields[i].data : null
            }

            for (let i = 0; i < previewBlocksConfig.data.areas[0].blocks.length; i++) {
                previewBlocksConfig.data.areas[0].blocks[i].id === previewBlockModified.blockID ?
                previewBlocksConfig.data.areas[0].blocks[i] = currentBlock : null
            }

            const previewHTML = await generatePage("la-plagne",previewBlocksConfig)
            var previewHTMLPageDom = new DOMParser().parseFromString(previewHTML.data,"text/html")

            const previewArea = previewHTMLPageDom.getElementById(currentBlock.id).parentElement;

            let currentArea = document.getElementById(currentBlock.id).parentElement;

            addEventListeners(previewArea, this.editableBlockClicked, this.editableBlockChildrenClicked)

            setTimeout(function(){
                currentArea.replaceWith(previewArea)
            }, 1000);

            this.$parent.$emit('update-config-locally', previewBlocksConfig);
        },

        updateImageLocally(newImageUrl) {
            // this.data.modifiedImageUrl = newImageUrl
        },

        async saveChangesHandler() {
            const currentBlockId = this.data.blockData.blockID
            const configData = await getConfigData("la-plagne")
            this.state.isLoading = true
            let newBlockMetaData;
            let newBlockData = {};
            let currentBlock = document.getElementById(currentBlockId);

            let newConfigData = []
            let isFound = false

            //Checking if it is a New Block
            for (let area of configData.data.areas) {
                if (isFound) break
                for (let block of area.blocks) {
                    if (isFound) break
                    if (block.id === currentBlockId) {
                        isFound = true
                    } 
                }
            }

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
                } else {
                    newBlockMetaData = {
                        "id": this.data.editorsPayloadNewBlock[0].blockID,
                        "type":this.data.editorsPayloadNewBlock[0].blockRefType,
                        "version":'1',
                        "htmlTemplatePath": `../components/${this.data.editorsPayloadNewBlock[0].blockRefType}/${this.data.editorsPayloadNewBlock[0].blockRefType}.ejs`,
                        "cssPath": `../components/${this.data.editorsPayloadNewBlock[0].blockRefType}/${this.data.editorsPayloadNewBlock[0].blockRefType}.scss`,
                        "data": {}
                    }

                    for(let i = 0; i < this.data.editorsPayloadNewBlock.length; i++) {
                        newBlockData[this.data.blockData.fields[i].inputSectionName] = this.data.blockData.fields[i].data
                    }

                    newBlockMetaData.data = newBlockData
                    }
                if (!isFound) {
                    configData.data.areas[0].blocks.push(newBlockMetaData)
                    newConfigData = configData
                    break
                }else {
                    newConfigData = configData
                }
            }
            // this.$parent.$emit('update-config-locally', newConfigData);

            await updateConfigData(newConfigData,"la-plagne")

            const newHTMLPage = await getPage("la-plagne")

            var newHTMLPageDom = new DOMParser().parseFromString(newHTMLPage.data,"text/html")

            const newHTMLPageBlock = newHTMLPageDom.getElementById(currentBlockId)

            if (!isFound) {
                const newHTMLPageBlockParent = newHTMLPageBlock.parentElement
                let currentArea = document.getElementById(newHTMLPageBlockParent.id);

                const newBlocks = newHTMLPageBlockParent.children

                // addEventListener to the BlockId
                for (const blocks of newBlocks) {
                    blocks.addEventListener("click", this.editableBlockClicked);
                }

                // addEventListener to the BlockId children
                for (let i = 0; i < newBlocks.length; i++) {
                    for (let j = 0; j < newBlocks[i].children.length; j++) {
                        newBlocks[i].children[j].addEventListener("click", this.editableBlockChildrenClicked);
                    }
                }

                currentArea.replaceWith(newHTMLPageBlockParent)
            } else {
                const newHTMLPageBlockChildren = newHTMLPageBlock.children

                for (const children of newHTMLPageBlockChildren) {
                    children.addEventListener("click", this.editableBlockChildrenClicked);
                }

                currentBlock.replaceChildren(...newHTMLPageBlockChildren)
            }

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