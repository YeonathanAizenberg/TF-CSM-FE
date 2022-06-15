<template>
  <div>
    <sidebar-comp
      :show="state.isShow"
      @toggleSidebar="toggleSidebarHandler"
      @update-config-locally="updateConfigLocally"
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
        lastClickedBlock: "",
        configFile: {},
      },
      state: {
        isShow: false
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
      if (Object.keys(this.data.configFile).length === 0) {
        this.data.configFile = await getConfigData("la-plagne");
      }
      //1- Loop over configFile and catch the Type and Version for the block with the desiredID
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

      //2- Call the definition json to get the filds input types
      definitionFile.data.definitions.forEach((definition) => {
        if (
          definition.type === blockType &&
          definition.version === blockVersion
        ) {
            this.data.formInputs = definition.inputs;
          }
      });
    },

    async editableBlockClicked(event) {
      let editableBlock = event.target;

      if (event.target.id) {
        await this.getFormInformation(event.target.id);
      } else {
        await this.getFormInformation(event.target.parentElement.id);
      }
      this.state.isShow = true;

      while (this.data.editorsPayload.length > 0) {
        this.data.editorsPayload.pop();
      }

      // if (this.data.lastClickedBlock) {
      //   if (event.target.id.split("ID")[0] === "block") {
      //     this.data.lastClickedBlock.classList.remove("currently-clicked-block");
      //   } else {
      //     this.data.lastClickedBlock.parentElement.classList.remove(
      //       "currently-clicked-block"
      //     );
      //   }
      // }

      this.data.lastClickedBlock = editableBlock;

      if (editableBlock.id.split("ID")[0] === "block") {
        // editableBlock.classList.add("currently-clicked-block");
      } else {
        editableBlock = event.target.parentElement;
        // editableBlock.parentElement.classList.add("currently-clicked-block");
      }

      //3- Put the input types on the form

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
    // const this = this; //saves the this context of EditorManager component
    const areas = document.getElementById("areas").children;

    for (const area of areas) {
      const blocks = area.children;
      for (const block of blocks) {
        block.addEventListener("click", this.editableBlockClicked);
      }
    }
  },
};
</script>

<style>
[editable~="true"] {
  cursor: pointer;
}

.currently-clicked-block {
  border: 3px solid blue;
}
</style>
