<template>
    <div class="text-editor card">
        <div class="my-2">
        <h5 class="my-2">{{field.inputSectionName}}</h5>
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
        font-weight: 600;
        color: black;
        background-color: #f2f2f3;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4vw;
        position: relative;
        top: 20px;
        left: 1%;
        margin-top: 0px;
        border-radius: 10px;
    }

    .text-editor textarea{
        z-index: +1;
        background-color: #f2f2f3;
        border-radius: 5px;
        padding: 10px 10px;
        border: 1px solid #d3d2d2;
        max-width: 25vw;
        min-width: 25vw;
        min-height: 100px;
        color: gray;
    }
</style>