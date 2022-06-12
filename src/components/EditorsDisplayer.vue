<template>
    <div class="editor-displayer-container">
        <div id="editorDisplayerCarsWrapper" v-if="isEditorsPayloadNotEmpty">
            <div v-for="editor in editorsPayload" :key="editor.type">
                <div class="my-2">
                    <div v-if="editor.type === 'image'">
                        <image-editor :inputSectionName="editor.inputSectionName" :inputData="editor.data" :blockID="editor.blockID"></image-editor>
                    </div>
                    <div v-if="editor.type === 'text'">
                        <text-editor :inputSectionName="editor.inputSectionName" :inputData="editor.data" :blockID="editor.blockID"></text-editor>
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

export default {
    name: "EditorsDisplayer",
    components: {
        TextEditor,
        ImageEditor,
    },
    inject: ["editorsPayload"],
    computed: {
        isEditorsPayloadNotEmpty() {
            return this.editorsPayload?.length > 0;
        },
    },
    methods: {
        saveChangesHandler() {
            // 1 - Take the selected blockID
            const currentBlockId = Object.values(this.editorsPayload[0])[3]
            const currentBlock = document.getElementById(currentBlockId);

            // 2 - Take the children from the blockID
            const currentBlockChildren = currentBlock.children

            // 3 - Take the inputsBlocks
            // const currentinputBlocks = document.getElementById("editorDisplayerCarsWrapper");
            // const currentinputBlocksChildren = currentinputBlocks.children
            const currentBlockInputsIframes = document.getElementsByClassName('tox-edit-area__iframe');

            // 4 - Match the children and the inputBlock by index and change the displayed InnerText
            for (let i = 0; i < currentBlockInputsIframes.length; i++) {
                const inputIframeInnerText = Array(currentBlockInputsIframes[i])[0].contentDocument.firstElementChild.innerText
                currentBlockChildren[i].innerText = inputIframeInnerText
            }

            // 5 - Update the Config in the DB

    
            // eslint-disable-next-line vue/no-mutating-props
            // console.log("BeforecurrentEditableTextElementBefore",this.currentEditableTextElement)
            // this.currentEditableTextElement.innerHTML = this.content;
            // console.log("AftercurrentEditableTextElementAfter",this.currentEditableTextElement)


            // const block = this.currentEditableTextElement.parentElement;
            // console.log("block",block)
            // const area = block.parentElement;
            // console.log("area",area)
            // const areaID = area.attributes.id?.value;

            // // How can I know wich element I'm edditing?
            // const updateServerContentchange = {
            //     areaID,
            //     blockID: this.blockID,
            //     type: "text",
            //     updatedContent: this.content,
            // };

            // localStorage.setItem(
            //     "updatedBlockContent",
            //     JSON.stringify(updateServerContentchange)
            // ); // need to be replaced by an API call

            // console.log(updateServerContentchange); //part of task requirement
        },
    }
};
</script>

<style scoped>
    .editor-displayer-container {
        flex: 1;
        overflow-y: scroll;
    }
</style>