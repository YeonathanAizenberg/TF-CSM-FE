<template>
  <MainModal
    v-if="this.state.isShowModal"
    title="Add Block"
    :isModalLoading="this.state.isModalLoading"
    @close="closeModal"
  >
    <template #default>
      <NewBlockRef
        v-for="definition in data.definitionFile.data.definitions"
        :key="definition.type"
        :type="definition.type"
        :image="definition.image"
        @add-new-block="addNewBlock"
      ></NewBlockRef>
    </template>
  </MainModal>
  <div v-if="this.state.isLoading" class="loading">Loading...</div>
  <div class="blocks-refs-container" v-else>
    <BlockRef
      v-for="block in data.configFileBlocks"
      :key="block.id"
      :blockID="block.id"
      :type="block.type"
      @open-add-new-block-modal="openAddNewBlockModal"
      @selected-block-bridge-two="selectedBlockBridgeTwo"
    ></BlockRef>
  </div>
</template>

<script scoped>
import getConfigData from "@/lib/getConfigData";
import generatePage from "@/lib/generatePage";
import BlockRef from "./BlockRef.vue";
import NewBlockRef from "./NewBlockRef.vue";
import definitionFile from "../data/definition.js";
import MainModal from "./MainModal.vue";
import addClickEventsToBlock from "@/logic/addClickEventsToBlock";

export default {
  name: "BlockSelector",

  components: {
    BlockRef,
    MainModal,
    NewBlockRef,
  },

  props: {
    handleFormDataSetUp: Function,
    newConfigFile: Object,
    initialDefinitionFile: Object
  },

  data: function () {
    return {
      data: {
        configFile: {},
        configFileBlocks: {},
        definitionFile: {},
        newBlock: {}
      },
      state: {
        isLoading: true,
        isShowModal: false,
        isModalLoading: false,
      },
    };
  },

  methods: {
    selectedBlockBridgeTwo(e){
        this.$emit("selected-block-bridge-one", e)
    },

    openAddNewBlockModal() {
      this.state.isShowModal = true;
    },

    closeModal() {
      this.state.isShowModal = false;
    },

    setUpNewBlock() {
      this.data.newBlock = {
        id:
          "blockID" +
          Math.floor(
            Math.random() * (99 - this.data.configFileBlocks.length + 1) +
              this.data.configFileBlocks.length +
              1
          ),
        type: "",
        version: "1",
        htmlTemplatePath: "",
        cssPath: "",
        data: {},
      };
    },

    insertNewBlockData(type) {
      for (const definition of this.data.definitionFile.data.definitions) {
        if (definition.type === type) {
          this.data.newBlock.data = definition.inputs;
          this.data.newBlock.type = definition.type;
          this.data.newBlock.htmlTemplatePath = `../components/${definition.type}/${definition.type}.ejs`;
          this.data.newBlock.cssPath = `../components/${definition.type}/${definition.type}.scss`;
        }
      }
    },

    async updateUIwithNewBlock() {
      const newBlocks = this.data.configFileBlocks;
      const newPreviewConfig = this.data.configFile;

      newPreviewConfig.data.areas[0].blocks = newBlocks;

      const previewHTML = await generatePage("la-plagne", newPreviewConfig);
      var previewHTMLPageDom = new DOMParser().parseFromString(
        previewHTML.data,
        "text/html"
      );

      const previewArea = previewHTMLPageDom.getElementById(
        this.data.newBlock.id
      ).parentElement;

      let currentArea = document.getElementById(newBlocks[0].id).parentElement;

      addClickEventsToBlock(previewArea, this.handleFormDataSetUp);

      this.$emit("update-config-locally-bridge", newPreviewConfig);

      this.$emit("select-block-bridge", this.data.newBlock);

      currentArea.replaceWith(previewArea);
    },

    addNewBlock(type) {
      this.state.isModalLoading = true;

      this.setUpNewBlock()

      this.insertNewBlockData(type)

      this.data.configFileBlocks.push(this.data.newBlock);

      this.updateUIwithNewBlock()

      this.state.isModalLoading = false;
      this.state.isShowModal = false;
    },

    async bringInitialData() {
      // TODO the definitionFile should come from the props
      this.data.definitionFile = definitionFile

      if (this.newConfigFile?.data?.areas[0]?.blocks) {
        this.data.configFile = this.newConfigFile;
      } else {
        // TODO the configFile should come from the props
        this.data.configFile = await getConfigData("la-plagne");
      }

      this.data.configFileBlocks = this.data.configFile.data.areas[0].blocks;
    }
  },

    mounted() {
      this.bringInitialData()

      this.state.isLoading = false;
  },
};
</script>

<style>
.blocks-refs-container {
  flex: 1;
  overflow-y: scroll;
}
</style>
