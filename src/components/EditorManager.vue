<template>
  <div>
    <sidebar-comp
      :isShow="state.isShow"
      :editableBlockChildrenClicked="this.editableBlockChildrenClicked"
      :isAnyBlockSelected="state.isAnyBlockSelected"
      @toggleSidebar="toggleSidebarHandler"
      @update-config-locally="updateConfigLocally"
      @select-block="editableBlockClicked"
    />
  </div>
</template>

<script>
import SidebarComp from "./SidebarComp.vue";
import { getConfigData } from "../lib/api.js";
import definitionFile from "./data/definition.js";

export default {
  name: "EditorManager",
  components: {
    SidebarComp,
  },
  data: function () {
    return {
      data: {
        editorsPayload: [],
        formInputs: {},
        formInputsData: {},
        configFile: {},
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
      this.data.configFile = newData
    },

    async getFormInformation(desiredID) {
      // Getting config information from the DB (getConfigData) and organizing it
      if (Object.keys(this.data.configFile).length === 0) {
        this.data.configFile = await getConfigData("la-plagne");
      }

      let blockType = "";
      let blockVersion = "";
      this.data.configFile.data.areas.forEach((area) => {
        area.blocks.forEach((block) => {
          if (block.id === desiredID) {
            blockType = block.type;
            blockVersion = block.version;
            this.data.formInputsData = block.data;
          }
        });
      });

      definitionFile.data.definitions.forEach((definition) => {
        if (
          definition.type === blockType &&
          definition.version === blockVersion
        ) {
            this.data.formInputs = definition.inputs;
          }
      });
    },

    editableBlockChildrenClicked(event) {
      // Making sure the editableBlockClicked works porprelly even when you click on the Block Children
      event.stopPropagation()
      const parentBlockId =  {target: {id: event.target.parentElement.id}}
      this.editableBlockClicked(parentBlockId)
    },

    async editableBlockClicked(event) {
      // Getting the element with the "currently-selected-block" class and the Block we are working on right now
      const currentlySelectedBlock = document.getElementsByClassName("currently-selected-block")
      const currentlyInteractabledBlock = document.getElementById(event.target.id)
      let editableBlock;

      // Making sure we selected a Block
      this.state.isAnyBlockSelected = true;

      // Scroll the page to the Block we are working on
      currentlyInteractabledBlock.scrollIntoView({behavior: "smooth", block: "center"})

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

      // Changing the selected Block CSS style
      if(currentlySelectedBlock.length > 0) {
          currentlySelectedBlock[0].classList.remove("currently-selected-block");
          currentlyInteractabledBlock.classList.add("currently-selected-block");
        } else {
          currentlyInteractabledBlock.classList.add("currently-selected-block");
        }

      // Puting the Block information on the editorsPayload
      for (let i = 0; i < Object.values(this.data.formInputs).length; i++) {
        const type = Object.values(this.data.formInputs)[i];
        const data = Object.values(this.data.formInputsData)[i];
        const inputSectionName = Object.keys(this.data.formInputsData)[i];

        this.data.editorsPayload.push({
          type,
          data,
          inputSectionName,
          blockID: editableBlock.id,
        });
      }
    },
  },

  mounted() {
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
