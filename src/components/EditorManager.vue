<template>
  <div>
    <sidebar-comp
      :isShow="state.isShow"
      :editableBlockChildrenClicked="this.editableBlockChildrenClicked"
      :editableBlockClicked="this.editableBlockClicked"
      :isAnyBlockSelected="state.isAnyBlockSelected"
      :configFile="this.data.editedConfigFile"
      @select-block="selectingBlock"
      @unselect-block="unselectingBlock"
      @toggleSidebar="toggleSidebarHandler"
      @update-config-locally="updateConfigLocally"
      @selected-block="editableBlockClicked"
    />
  </div>
</template>

<script scoped>
import SidebarComp from "./SidebarComp.vue";
import { getConfigData } from "../lib/api.js";
import definitionFile from "../data/definition.js";
import { scrollToselectedtBlock } from '@/utils/utils';

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
        initialConfigFile: {}
      },
      state: {
        isShow: true,
        isAnyBlockSelected: false
      },
    };
  },
  provide() {
    return {
      editorsPayload: this.data.editorsPayload,
    };
  },
  methods: {
    toggleSidebarHandler() {
      this.state.isShow = !this.state.isShow;
    },

    updateConfigLocally(newData) {
      this.data.editedConfigFile = newData
    },

    selectingBlock(block) {
      const blockEvent =  {target: {id: block.id}}
      this.editableBlockClicked(blockEvent,block.type,block.id)
      this.state.isAnyBlockSelected = true
    },

    unselectingBlock() {
      this.state.isAnyBlockSelected = false
    },

    async getFormInformation(desiredID) {
      // Get information
      let currentConfiguration;
      let currentBlock;
      let currentBlockTypeInputs;

      if(this.data.editedConfigFile?.data?.areas[0]?.blocks) {
          currentConfiguration = this.data.editedConfigFile;
      } else {
        currentConfiguration = this.data.initialConfigFile;
      }

      const currentConfigurationBlocks = currentConfiguration.data.areas[0].blocks

      for (let i = 0; i < currentConfigurationBlocks.length; i++) {
        if(currentConfigurationBlocks[i].id === desiredID) {
          currentBlock = currentConfigurationBlocks[i]
        }
      }

      for (let i = 0; i < definitionFile.data.definitions.length; i++) {
        if(definitionFile.data.definitions[i].type === currentBlock.type) {
          currentBlockTypeInputs = definitionFile.data.definitions[i].inputs
        }
      }

      // insert information on the formInputs and formInputsData

      this.data.formInputsData = currentBlock.data
      this.data.formInputs = currentBlockTypeInputs
    },

    editableBlockChildrenClicked(event) {
      // Making sure the editableBlockClicked works porprelly even when you click on the Block Children
      event.stopPropagation()
      const parentBlockId =  {target: {id: event.target.parentElement.id}}
      this.editableBlockClicked(parentBlockId)
    },

    async editableBlockClicked(event) {
        let editableBlock;

        this.state.isAnyBlockSelected = true;

        // Making sure we are interacting on the Block, and not over one of his children
        if (event.target.id.split("ID")[0] === "block") {
          editableBlock = event.target;
        } else {
          editableBlock = event.target.parentElement;
        }

        // Getting Block information
        await this.getFormInformation(editableBlock.id);

        // Open the side bar
        this.state.isShow = true;

        // Making sure we are working with the information from only one block 
        while (this.data.editorsPayload.length > 0) {
          this.data.editorsPayload.pop();
        }

        // Puting the Block information on the editorsPayload
        for (let i = 0; i < Object.values(this.data.formInputs).length; i++) {
          const type = Object.values(this.data.formInputs)[i];
          const data = Object.values(this.data.formInputsData)[i];
          const inputSectionName = Object.keys(this.data.formInputsData)[i];
          const blockRefType = this.data.blockRefType;

          this.data.editorsPayload.push({
            blockRefType,
            type,
            data,
            inputSectionName,
            blockID: editableBlock.id,
          });
        }

        // Scroll the page to the Block we are working on
        scrollToselectedtBlock(event.target.id)
    },
  },

  async mounted() {
    // Bring the data from the DB on the first render
    this.data.initialConfigFile = await getConfigData("la-plagne")
    this.data.editedConfigFile = this.data.initialConfigFile

    // Giving to the Blocks and Block Children the event they need to triger when clicked 
    const areas = document.getElementById("areas").children;

    for (const area of areas) {
      const blocks = area.children;
      for (const block of blocks) {
        block.addEventListener("click", this.editableBlockClicked);
        const blocksChildren = block.children;
        for (const children of blocksChildren) {
          children.addEventListener("click", this.editableBlockChildrenClicked);
        }
      }
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
