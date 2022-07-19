<template>
  <div>
    <SidebarComp
      :isLoading="state.isLoading"
      :isShowSideBar="state.isShowSideBar"
      :handleFormDataSetUpProp="handleFormDataSetUp"
      :isAnyBlockSelected="state.isAnyBlockSelected"
      :configFile="data.editedConfigFile"
      :editorsPayload="data.editorsPayload"
      :definitionFile="data.definitionFile"
      :isEdited="isEdited"
      :selectedPage="data.selectedPage"
      :initialTemplate="data.initialTemplate"
      :initialTemplateVerison="data.initialTemplateVerison"
      @select-block="selectingBlock"
      @update-UI="updateUI"
      @unselect-block="unselectingBlock"
      @toggleSidebar="toggleSidebarHandler"
      @update-config="updateConfig"
      @handle-form-data-set-up="handleFormDataSetUp"
      @delete-block="deleteBlock"
      @save-changes-handler="saveChangesHandler"
    />
  </div>
</template>

<script scoped>
import SidebarComp from "./SidebarComp.vue";
import getConfigData from "../lib/getConfigData";
import getDefinitionData from "../lib/getDefinitionData";
import scrollToSelectedBlock from "@/logic/scrollToSelectedBlock.js";
import addClickEventsToBlock from "@/logic/addClickEventsToBlock";
import saveNewPage from "../lib/saveNewPage"
import getPage from '@/lib/getPage';
import transferDOMelements from '@/utils/transferDOMelements.js'
import generatePage from '@/lib/generatePage';
import domParser from '@/utils/domParser.js';
import fixScriptsSoTheyAreExecuted from '@/utils/fixScriptsSoTheyAreExecuted.js'

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
        initialTemplate: "",
        initialTemplateVerison: "",
        selectedPage: ""
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
      this.updateConfig(configFileCopy)
    },

    async deleteBlock(blockId){
      this.state.isLoading = true
      this.removeBlockFromConfig(blockId)
      this.updateUI()
    },

    async saveChangesHandler() {
      this.state.isLoading = true
      await saveNewPage(this.data.selectedPage, this.data.editedConfigFile, this.data.initialTemplate,this.data.initialTemplateVerison)
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
          name: this.currentBlockDefinition.name,
          blockID: this.data.selectedBlockId,
        });
      }
    },

    async updateUI(newBlock){
      this.state.isLoading = true
      const reOrderedBlocksHTML = await generatePage(this.data.selectedPage, this.data.editedConfigFile, this.data.initialTemplate,this.data.initialTemplateVerison);
      const reOrderedBlocksHTMLDOM = domParser(reOrderedBlocksHTML.data)
      const generatedAreaOne = reOrderedBlocksHTMLDOM.querySelector("#area1")
      const currentAreaOne = document.querySelector("#area1");
      currentAreaOne.replaceWith(generatedAreaOne);
      const areas = document.getElementById("areas").children;

      for (const area of areas) {
        addClickEventsToBlock(area, this.handleFormDataSetUp);
      }

      this.unselectingBlock()

      if(newBlock) {
          this.selectingBlock(newBlock)
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

    getPageFromQueryParameters() {
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString);
      const curentPage = urlParams.get('key')
      this.data.selectedPage = curentPage
    },

    async fetchInitialData() {
      const [config, definition, deployedHTML] = await Promise.all([
        await getConfigData(this.data.selectedPage),
        await getDefinitionData(),
        await getPage(this.data.selectedPage)
      ]);
      this.data.initialTemplate = config.curentTemplate;
      this.data.initialTemplateVerison = config.curentTemplateVerison;
      this.data.initialConfigFile = config.data === "{}" ? {data: {areas: [{blocks: []}]}} : config.data;
      this.data.definitionFile = definition;
      this.data.deployedHTMLString = deployedHTML;

      this.data.editedConfigFile = JSON.parse(
        JSON.stringify(this.data.initialConfigFile)
      );
    },

    useDeployedHTMLFile() {
      const deployedHTMLDOM = domParser(this.data.deployedHTMLString.data)
      const generatedHead = deployedHTMLDOM.querySelector("head")
      const generatedBody = deployedHTMLDOM.querySelector("body")

      const elements = [...generatedHead.children, ...generatedBody.children]
      transferDOMelements(document.head ,generatedHead)
      transferDOMelements(document.body ,generatedBody)

      elements.forEach(el=>{
        fixScriptsSoTheyAreExecuted(el)
      })
    },

    updateTheConfigInCaseOfNewPageWithDefaultData() {
      this.data.editedConfigFile.data.areas[0].blocks.length === 0 ? 
      this.data.editedConfigFile.data = window.CurrentConfig :
      null
    }
  },

  async mounted() {
    this.getPageFromQueryParameters()
    await this.fetchInitialData();
    this.useDeployedHTMLFile()
    this.updateTheConfigInCaseOfNewPageWithDefaultData();

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