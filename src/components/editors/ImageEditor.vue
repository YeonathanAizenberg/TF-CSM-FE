<template>
    <div class="image-editor card">
        <h5 class="my-2">Image Selector</h5>
        <div class="my-2">
            <label class="mr-2" for="ImageURL">Image URL: </label>
            <input
                id="ImageURL"
                name="ImageURL"
                type="text"
                v-model="imageURL"
            />
        </div>
        <button
            type="button"
            @click="updateImgToDOM"
            class="btn btn-primary my-2"
        >
            Update Image URL
        </button>
    </div>
</template>

<script>
export default {
    name: "ImageEditor",
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

    data() {
        return {
            // https://picsum.photos/200
            imageURL: "",
            currentEditableImageElement: null,
        };
    },
    watch: {
        blockID: function () {
            this.onBlockIDChange();
        },
    },
    mounted() {
        this.imageURL = this.field.data
        this.onBlockIDChange();
    },
    methods: {
        onBlockIDChange() {
            const editableBlock = document.getElementById(this.blockID);
            const editableBlockChildren = editableBlock.children;

            this.currentEditableImageElement = editableBlockChildren[1];
        },

        updateImgToDOM() {
            const picDOMElement = this.currentEditableImageElement.children[0];

            picDOMElement.src = this.imageURL;

            this.$emit('update-image-locally', this.imageURL);
        },
    },
};
</script>

<style scoped>
.image-editor {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5%;
}

.image-editor button {
    margin: 2%;
}

.image-editor label {
    margin-right: 5px;
    color: black;
}

.image-editor input {
    margin-right: 5px;
    color: gray;
}

.image-editor h5 {
    text-transform: uppercase;
    text-decoration: underline;
    font-weight: 700;
    color: black;
}
</style>