<template>
    <div class="text-editor card">
        <h5 class="my-2">{{field.inputSectionName}}</h5>
        <div class="my-2">
            <textarea
                id="textInput"
                name="text-input"
                type="text"
                v-model="field.data"
            />
        </div>
    </div>
</template>

<script>

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
        color: black;
    }

    .text-editor textarea{
        z-index: +1;
        background-color: #f2f2f3;
        border-radius: 5px;
        margin: 5%;
        padding: 10px 10px;
        border: 1px solid #d3d2d2;
        resize: none;
        width: 25vw;
        height: 100px;
        color: gray;
    }
</style>