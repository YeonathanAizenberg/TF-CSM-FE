<template>
  <div>
    <SidebarComp
      :isShowSideBar="state.isShowSideBar"
      :handleFormDataSetUp="handleFormDataSetUp"
      :isAnyBlockSelected="state.isAnyBlockSelected"
      :configFile="data.editedConfigFile"
      :editorsPayload="data.editorsPayload"
      :initialDefinitionFile="data.initialDefinitionFile"
      @select-block="selectingBlock"
      @unselect-block="unselectingBlock"
      @toggleSidebar="toggleSidebarHandler"
      @update-config-locally="updateConfigLocally"
      @selected-block="handleFormDataSetUp"
    />
  </div>
</template>

<script scoped>
  import SidebarComp from "./SidebarComp.vue";
  import getConfigData from "../lib/getConfigData";
  import definitionFile from "../data/definition.js";
  import scrollToSelectedBlock from '@/logic/scrollToSelectedBlock.js';
  import addClickEventsToBlock from '@/logic/addClickEventsToBlock';

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
          initialDefinitionFile: {},
          selectedBlockId: ""
        },
        state: {
          isShowSideBar: true,
          isAnyBlockSelected: false
        },
      };
    },

    computed: {
      currentConfiguration(){
          if(this.data.editedConfigFile?.data?.areas[0]?.blocks) {
              return this.data.editedConfigFile;
          } else {
            return this.data.initialConfigFile;
          }
        },
      currentBlock(){
        return this.currentConfiguration.data.areas[0].blocks.find(block=>block.id === this.data.selectedBlockId)
      },
      currentBlockDefinition(){
        const definition = definitionFile.data.definitions.find(def=>def.type === this.currentBlock.type)
        if (!definition) return null
        return definition
      },
    },

    methods: {
      toggleSidebarHandler() {
        this.state.isShowSideBar = !this.state.isShowSideBar;
      },

      updateConfigLocally(newData) {
        this.data.editedConfigFile = newData
      },

      selectingBlock(block) {
        const blockEvent =  {target: {id: block.id}}
        this.handleFormDataSetUp(blockEvent)
        this.state.isAnyBlockSelected = true
      },

      unselectingBlock() {
        this.state.isAnyBlockSelected = false
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
          const type = value
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
        this.data.formInputsData = this.currentBlock.data
        this.data.formInputs = this.currentBlockDefinition.inputs
        this.data.blockRefType = this.currentBlockDefinition.type
      },

      handleFormDataSetUp(e) {
        const blockElement = this.getBlockElement(e)
          this.data.selectedBlockId = blockElement.id
          this.state.isAnyBlockSelected = true;

          this.setFormInputsAndDataAndBlockRefType()
          this.data.editorsPayload = []
          this.setupEditorPayloadData()

          scrollToSelectedBlock(blockElement.id)
      },

      async bringInitialData() {
        this.data.initialConfigFile = await getConfigData("la-plagne")
        this.data.editedConfigFile = this.data.initialConfigFile
        this.data.initialDefinitionFile = definitionFile
      }
    },

    async mounted() {
      this.bringInitialData()

      const areas = document.getElementById("areas").children;

      for(const area of areas) {
        addClickEventsToBlock(area, this.handleFormDataSetUp)
      }
    },
  };
</script>

<style>
    [editable~="true"] {
      cursor: pointer;
    }

    .currently-selected-block {
      border: 3px solid #1C5D9F;
      border-radius: 5px;
    }
</style>
