<template>
  <MainModal
    v-if="this.state.isShowModal"
    title="Add Block"
    :isModalLoading="this.state.isModalLoading"
    @close="closeModal"
  >
    <template #default>
      <template v-if="definitionFile.data.definitions">
      <NewBlockRef
        v-for="definition in definitionFile.data.definitions"
        :key="definition.type"
        :type="definition.type"
        :image="definition.image"
        @add-new-block="addNewBlock"
      ></NewBlockRef>
      </template>
    </template>
  </MainModal>
  <div class="blocks-refs-container" v-else>
    <template v-if="this.configFile?.data?.areas[0].blocks">
    <BlockRef
      v-for="block in this.configFile?.data?.areas[0].blocks"
      :key="block.id"
      :blockID="block.id"
      :type="block.type"
      @open-add-new-block-modal="openAddNewBlockModal"
      @block-click="handleBlockClick"
    ></BlockRef>
    </template>
  </div>
</template>

<script>
import generatePage from "@/lib/generatePage";
import BlockRef from "./BlockRef.vue";
import NewBlockRef from "./NewBlockRef.vue";
import MainModal from "./MainModal.vue";
import addClickEventsToBlock from "@/logic/addClickEventsToBlock";
// import draggable from "vuedraggable"

export default {
  name: "BlockSelector",

  components: {
    BlockRef,
    MainModal,
    NewBlockRef,
    // draggable
  },

  props: {
    handleFormDataSetUp: Function,
    configFile: Object,
    definitionFile: Object
  },

  data: function () {
    return {
      state: {
        isShowModal: false,
        isModalLoading: false,
      },
    };
  },

  methods: {
    handleBlockClick(e){
        this.$emit("block-click", e)
    },

    openAddNewBlockModal() {
      this.state.isShowModal = true;
    },

    closeModal() {
      this.state.isShowModal = false;
    },

    getEmptyBlock() {
      return {
        id:
          "blockID" +
          Math.floor(
            Math.random() * (99 - this.configFile.data.areas[0].blocks.length + 1) +
              this.configFile.data.areas[0].blocks.length +
              1
          ),
        type: "",
        version: "1",
        htmlTemplatePath: "",
        cssPath: "",
        data: {},
      };
    },

    predareEmptyBlock(type, newBlock) {
      if (!this.definitionFile) return
      const definition = this.definitionFile.data.definitions.find(definition=>definition.type === type)
      if (!definition) throw new Error('some error')
      const definitionCopy = JSON.parse(JSON.stringify(definition))
      newBlock.data = definitionCopy.inputs;
      newBlock.type = definitionCopy.type;
      newBlock.htmlTemplatePath = `../components/${definitionCopy.type}/${definitionCopy.type}.ejs`;
      newBlock.cssPath = `../components/${definitionCopy.type}/${definitionCopy.type}.scss`;
      return newBlock
    },

    async updateUIwithNewBlock(newBlock) {
      const configFileCopy = JSON.parse(JSON.stringify(this.configFile))
      configFileCopy.data.areas[0].blocks.push(newBlock);

      const previewHTML = await generatePage("la-plagne", configFileCopy);
      const previewHTMLPageDom = new DOMParser().parseFromString(
        previewHTML.data,
        "text/html"
      );

      const previewArea = previewHTMLPageDom.getElementById(
        newBlock.id
      ).parentElement;

      const currentArea = document.getElementById(configFileCopy.data.areas[0].blocks[0].id).parentElement;

      addClickEventsToBlock(previewArea, this.handleFormDataSetUp);
      this.$emit("update-config", configFileCopy);
      this.$emit("select-block-bridge", newBlock);
      this.$emit("make-save-button-available");

      currentArea.replaceWith(previewArea);
    },

    async addNewBlock(type) {
      this.state.isModalLoading = true;

      const newBlock = this.getEmptyBlock()
      const preparedBlock = this.predareEmptyBlock(type, newBlock)
      await this.updateUIwithNewBlock(preparedBlock)
      this.handleBlockClick({target:{id:newBlock.id}})

      this.state.isShowModal = false;
      this.state.isModalLoading = false;
    },
  },
};
</script>

<style>
.blocks-refs-container {
  flex: 1;
  overflow-y: scroll;
}
</style>
