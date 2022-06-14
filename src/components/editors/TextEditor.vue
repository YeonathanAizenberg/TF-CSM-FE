<template>
    <div class="text-editor card">
        <h5 class="my-2">{{field.inputSectionName}}</h5>
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
                v-model="field.data"
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
            // content: this.field.data,
        };
    },
    props: {
        blockID: {
            type: String,
            required: true,
        },

        field: {
            type: Object,
            required: true,
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