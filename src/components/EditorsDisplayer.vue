<template>
    <div>
        <div v-if="isEditorsPayloadNotEmpty">
            <div v-for="editor in editorsPayload" :key="editor.type">
                <div class="my-2">
                    <div v-if="editor.type === 'image'">
                        <image-editor :inputData="editor.data" :blockID="editor.blockID"></image-editor>
                    </div>
                    <div v-if="editor.type === 'text'">
                        <text-editor :inputData="editor.data" :blockID="editor.blockID"></text-editor>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
            console.log("editorsPayload",this.editorsPayload)
            return this.editorsPayload?.length > 0;
        },
    },
};
</script>

<style>
</style>