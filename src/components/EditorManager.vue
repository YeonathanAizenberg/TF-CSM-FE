<template>
  <div>
    <SidebarComp
      :isShowSideBar="state.isShowSideBar"
      :handleFormDataSetUp="handleFormDataSetUp"
      :isAnyBlockSelected="state.isAnyBlockSelected"
      :configFile="data.editedConfigFile"
      :editorsPayload="data.editorsPayload"
      :definitionFile="data.definitionFile"
      :isEdited="isEdited"
      @select-block="selectingBlock"
      @unselect-block="unselectingBlock"
      @toggleSidebar="toggleSidebarHandler"
      @update-config="updateConfig"
      @selected-block="handleFormDataSetUp"
      @delete-block="deleteBlock"
    />
  </div>
</template>

<script scoped>
import SidebarComp from "./SidebarComp.vue";
import getConfigData from "../lib/getConfigData";
import deleteConfigBlock from "../lib/deleteConfigBlock";
import getDefinitionData from "../lib/getDefinitionData";
import scrollToSelectedBlock from "@/logic/scrollToSelectedBlock.js";
import addClickEventsToBlock from "@/logic/addClickEventsToBlock";

export default {
  name: "EditorManager",

  components: {
    SidebarComp,
  },

  data: function () {
    return {
      data: {
        editorsPayload: [],
        blockRefType: "",
        formInputs: {},
        formInputsData: {},
        editedConfigFile: {},
        initialConfigFile: {},
        definitionFile: {},
        selectedBlockId: "",
      },
      state: {
        isShowSideBar: true,
        isAnyBlockSelected: false,
      },
    };
  },

  computed: {
    currentBlock() {
      if (!this.data.editedConfigFile) return null
      return this.data.editedConfigFile.data.areas[0].blocks.find(
        (block) => block.id === this.data.selectedBlockId
      );
    },
    currentBlockDefinition() {
      if (!this.data.definitionFile) return null
      return this.data.definitionFile.data.definitions.find((def) => {
        return def.type === this.currentBlock.type;
      });
    },
    isEdited() {
      return (
        JSON.stringify(this.data.initialConfigFile) !==
        JSON.stringify(this.data.editedConfigFile)
      );
    },
  },

  methods: {
    toggleSidebarHandler() {
      this.state.isShowSideBar = !this.state.isShowSideBar;
    },

    updateConfig(newData) {
      this.data.editedConfigFile = newData;
    },

    selectingBlock(block) {
      const blockEvent = { target: { id: block.id } };
      this.handleFormDataSetUp(blockEvent);
      this.state.isAnyBlockSelected = true;
    },

    unselectingBlock() {
      this.state.isAnyBlockSelected = false;
    },

    removeBlockFromConfig(blockId) {
      const configFileCopy = JSON.parse(JSON.stringify(this.data.editedConfigFile))
      configFileCopy.data.areas[0].blocks.splice(configFileCopy.data.areas[0].blocks.findIndex(block => block.id === blockId) , 1)
      return configFileCopy
    },

    updateUIwithModifiedHTML(modifiedHTML, blockId, configFileCopy){
      const modifiedHTMLPageDom = new DOMParser().parseFromString(
        modifiedHTML.data,
        "text/html"
      );

      const currentArea = document.getElementById(blockId).parentElement;

      const modifiedCurrentArea = modifiedHTMLPageDom.getElementById(
        currentArea.id
      );

      addClickEventsToBlock(modifiedCurrentArea, this.handleFormDataSetUp);
      currentArea.replaceWith(modifiedCurrentArea);

      this.updateConfig(configFileCopy)

      this.unselectingBlock()
    },

    async deleteBlock(blockId){
      const configFileCopy = this.removeBlockFromConfig(blockId)

      const modifiedHTML = await deleteConfigBlock(configFileCopy, "la-plagne")

      this.updateUIwithModifiedHTML(modifiedHTML, blockId, configFileCopy)
    },

    getBlockElement(e) {
      if (e.target.id.split("ID")[0] === "block") {
        return e.target;
      } else {
        return e.target.parentElement;
      }
    },

    setupEditorPayloadData() {
      for (const [i, value] of Object.values(this.data.formInputs).entries()) {
        const type = value;
        const data = Object.values(this.data.formInputsData)[i];
        const inputSectionName = Object.keys(this.data.formInputsData)[i];

        this.data.editorsPayload.push({
          blockRefType: this.data.blockRefType,
          type,
          data,
          inputSectionName,
          blockID: this.data.selectedBlockId,
        });
      }
    },

    setFormInputsAndDataAndBlockRefType() {
      if (!this.currentBlock || !this.currentBlockDefinition) return null
      this.data.formInputsData = this.currentBlock.data;
      this.data.formInputs = this.currentBlockDefinition.inputs;
      this.data.blockRefType = this.currentBlockDefinition.type;
    },

    handleFormDataSetUp(e) {
      const blockElement = this.getBlockElement(e);
      this.data.selectedBlockId = blockElement.id;
      this.state.isAnyBlockSelected = true;

      this.setFormInputsAndDataAndBlockRefType();
      this.data.editorsPayload = [];
      this.setupEditorPayloadData();

      scrollToSelectedBlock(blockElement.id);
    },

    async bringInitialData() {
      const [config, definition] = await Promise.all([
        await getConfigData("la-plagne"),
        await getDefinitionData(),
      ]);
      this.data.initialConfigFile = config;
      this.data.definitionFile = definition;
      this.data.editedConfigFile = JSON.parse(
        JSON.stringify(this.data.initialConfigFile)
      );
    },
  },

  async mounted() {
    await this.bringInitialData();

    const areas = document.getElementById("areas").children;

    for (const area of areas) {
      addClickEventsToBlock(area, this.handleFormDataSetUp);
    }
  },
};
</script>

<style>
[editable~="true"] {
  cursor: pointer;
}

.currently-selected-block {
  border: 3px solid #1c5d9f;
  border-radius: 5px;
}
</style>
