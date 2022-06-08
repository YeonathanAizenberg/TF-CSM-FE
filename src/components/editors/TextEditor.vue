<template>
    <div class="text-editor card">
        <h5 class="my-2">Text Editor</h5>
        <div class="my-2">
            <editor
                api-key="siyw9azk38h6spg4qrb76x3fwe1do2x3h03va2yneriycrbe"
                :init="{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount',
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                         alignleft aligncenter alignright alignjustify | \
                         bullist numlist outdent indent | removeformat | help',
                }"
                v-model="content"
            />
        </div>

        <button class="btn btn-primary my-2" @click="saveChangesHandler">
            Save Changes
        </button>
    </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
    name: "TextEditor",
    components: {
        editor: Editor,
    },
    data: function () {
        return {
            content: null,
            currentEditableTextElement: null,
        };
    },
    props: {
        blockID: {
            type: String,
            required: true,
        },

        inputData: {
            type: Object,
            required: true,
        },
    },
    watch: {
        textContent: function () {
            this.content = this.textContent;
        },
        blockID: function () {
            this.onBlockIDChange();
        },
    },
    mounted() {
        this.onBlockIDChange();
    },
    methods: {
        onBlockIDChange() {
            const editableBlock = document.getElementById(this.blockID);
            const editableBlockChildren = editableBlock.children;

            for (const editableBlockChild of editableBlockChildren) {
                const type = editableBlockChild.attributes.type?.value;
                switch (type) {
                    case "text":
                        this.currentEditableTextElement = editableBlockChild;
                        break;
                    default:
                        break;
                }
            }
            this.content = this.inputData
        },

        saveChangesHandler() {
            // eslint-disable-next-line vue/no-mutating-props
            this.currentEditableTextElement.innerHTML = this.content;

            const block = this.currentEditableTextElement.parentElement;

            const area = block.parentElement;
            const areaID = area.attributes.id?.value;

            const updateServerContentchange = {
                areaID,
                blockID: this.blockID,
                type: "text",
                updatedContent: this.content,
            };

            localStorage.setItem(
                "updatedBlockContent",
                JSON.stringify(updateServerContentchange)
            ); // need to be replaced by an API call

            console.log(updateServerContentchange); //part of task requirement
        },
    },
};
</script>

<style scoped>
.text-editor {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>