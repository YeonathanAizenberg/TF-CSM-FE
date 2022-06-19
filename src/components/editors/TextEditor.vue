<template>
    <div class="text-editor card">
        <div class="my-2">
        <h5 class="my-2">{{field.inputSectionName}}</h5>
            <textarea
                id="textInput"
                name="text-input"
                type="text"
                @input="resize()"
                ref="textarea"
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

    methods: {
        resize() {
            let element = this.$refs["textarea"];

            element.style.height = element.scrollHeight + "px";
        },
    },

    mounted() { 
        let element = this.$refs["textarea"];

        element.style.height = "40px";
        element.style.height = element.scrollHeight + "px";
    }
};
</script>

<style scoped>
    .text-editor {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h5 {
        text-transform: capitalize;
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
        padding: 10px;
        border: 1px solid #d3d2d2;
        max-width: 25vw;
        min-width: 25vw;
        color: gray;
        overflow:hidden;
        resize: none;
    }

    .text-editor textarea:focus{
        color: #193fa2;
        outline: 1px solid #63a1ff;
        border-color: #63a1ff;
        background-color: #dfe5f6;
    }
</style>