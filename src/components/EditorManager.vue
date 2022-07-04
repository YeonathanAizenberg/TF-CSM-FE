<template>
  <div>
    <SidebarComp
      :isLoading="state.isLoading"
      :isShowSideBar="state.isShowSideBar"
      :handleFormDataSetUp="handleFormDataSetUp"
      :isAnyBlockSelected="state.isAnyBlockSelected"
      :configFile="data.editedConfigFile"
      :editorsPayload="data.editorsPayload"
      :definitionFile="data.definitionFile"
      :isEdited="isEdited"
      @select-block="selectingBlock"
      @update-UI-for-new-blocks-order="updateUIForNewBlocksOrder"
      @unselect-block="unselectingBlock"
      @toggleSidebar="toggleSidebarHandler"
      @update-config="updateConfig"
      @selected-block="handleFormDataSetUp"
      @delete-block="deleteBlock"
      @save-changes-handler="saveChangesHandler"
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
import saveNewPage from "../lib/saveNewPage"
import getPage from '@/lib/getPage';
import transferDOMelements from '@/utils/transferDOMelements.js'
import generatePage from '@/lib/generatePage';

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
        deployedHTMLString: "",
      },
      state: {
        isShowSideBar: true,
        isAnyBlockSelected: false,
        isLoading: true
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
      this.state.isLoading = true
      const configFileCopy = this.removeBlockFromConfig(blockId)

      const modifiedHTML = await deleteConfigBlock(configFileCopy, "la-plagne")

      this.updateUIwithModifiedHTML(modifiedHTML, blockId, configFileCopy)
      this.state.isLoading = false
    },

    async saveChangesHandler() {
      this.state.isLoading = true
      await saveNewPage(this.data.editedConfigFile, "la-plagne")
      this.state.isLoading = false
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

    async updateUIForNewBlocksOrder(){
      this.state.isLoading = true

      const reOrderedBlocksHTML = await generatePage("la-plagne", this.data.editedConfigFile);
      const reOrderedBlocksHTMLDOM = new DOMParser().parseFromString(
        reOrderedBlocksHTML.data,
        "text/html"
      );
      const generatedAreaOne = reOrderedBlocksHTMLDOM.querySelector("#area1")
      const currentAreaOne = document.querySelector("#area1");

      currentAreaOne.replaceWith(generatedAreaOne);
      
      const areas = document.getElementById("areas").children;

      for (const area of areas) {
        addClickEventsToBlock(area, this.handleFormDataSetUp);
      }

      this.state.isLoading = false
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

    async fetchInitialData() {
      const [config, definition, deployedHTML] = await Promise.all([
        await getConfigData("la-plagne"),
        await getDefinitionData(),
        await getPage("la-plagne")
      ]);
      this.data.initialConfigFile = config;
      this.data.definitionFile = definition;
      this.data.deployedHTMLString = deployedHTML;

      this.data.editedConfigFile = JSON.parse(
        JSON.stringify(this.data.initialConfigFile)
      );
    },

    useDeployedHTMLFile() {
      const deployedHTMLDOM = new DOMParser().parseFromString(
        this.data.deployedHTMLString.data,
        "text/html"
      );

      const generatedHead = deployedHTMLDOM.querySelector("head")
      const generatedBody = deployedHTMLDOM.querySelector("body")

      transferDOMelements(document.head ,generatedHead)
      transferDOMelements(document.body ,generatedBody)
    },
  },

  async mounted() {
    await this.fetchInitialData();
  
    this.useDeployedHTMLFile()

    const areas = document.getElementById("areas").children;

    for (const area of areas) {
      addClickEventsToBlock(area, this.handleFormDataSetUp);
    }

    this.state.isLoading = false
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

  .loading {
      position: absolute;
      top: 45%;
      left: 45%;
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      border-top: 16px solid #005fa9;
      width: 120px;
      height: 120px !important;
      animation: spin 2s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
</style>