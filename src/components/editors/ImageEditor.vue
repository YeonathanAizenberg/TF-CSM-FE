<template>
    <div class="image-editor card">
        <h5 class="my-2">Image Editor</h5>
        <div class="my-2">
            <label class="mr-2" for="ImageURL">Image URL</label>
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
    },
    data() {
        return {
            imageURL: "",
            currentEditableImageElement: null,
        };
    },
    watch: {
        currentEditableImageElement: function () {
            this.imageURL = "";
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
                    case "image":
                        this.currentEditableImageElement = editableBlockChild;
                        break;
                    default:
                        break;
                }
            }
        },
        updateImgToDOM() {
            const picDOMElement = this.currentEditableImageElement.children[0];

            picDOMElement.src = this.imageURL;

            const block = this.currentEditableImageElement.parentElement;

            const area = block.parentElement;
            const areaID = area.attributes.id?.value;

            const updateServerContentchange = {
                areaID,
                blockID: this.blockID,
                type: "image",
                updatedContent: this.imageURL,
            };

            localStorage.setItem(
                "updatedBlockContent",
                JSON.stringify(updateServerContentchange)
            );

            this.imageURL = "";
        },
    },
};
</script>

<style scoped>
.image-editor {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>