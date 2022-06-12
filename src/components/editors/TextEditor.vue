<template>
    <div class="text-editor card">
        <h5 class="my-2">{{inputSectionName}}</h5>
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
            // currentEditableTextElement: null,
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

        inputSectionName: {
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
            // const editableBlock = document.getElementById(this.blockID);
            // const editableBlockChildren = editableBlock.children;

            // for(const editableBlockChild of editableBlockChildren) {
            //     this.currentEditableTextElement = editableBlockChild;
            // }
            //4- Fill the default data ofthe inputs with the data from the config js file
            this.content = this.inputData
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

h5 {
    text-transform: uppercase;
    text-decoration: underline;
    font-weight: 700;
}
</style>