<template>
  <div>
    <sidebar-comp :show="show" @toggleSidebar="toggleSidebarHandler" />
  </div>
</template>

<script>
import SidebarComp from "./SidebarComp.vue";
import configFile from "./data/configuration";
import definitionFile from "./data/definition.js";

export default {
  name: "EditorManager",
  components: {
    SidebarComp,
  },
  data: function () {
    return {
      show: false,
      editorsPayload: [],
      formInputs: [],
      formInoutsData: {},
      lastClickedBlock: "",
    };
  },
  provide() {
    return {
      editorsPayload: this.editorsPayload,
    };
  },
  methods: {
    toggleSidebarHandler() {
      this.show = !this.show;
    },
  },
  mounted() {
    const that = this; //saves the this context of EditorManager component

    const editableBlocks = [];

    const areas = document.getElementById("areas").children;

    for (const area of areas) {
      const blocks = area.children;

      for (const block of blocks) {
        const id = block.attributes.id?.value;
        const isIDValid = id && id.length > 0;

        const isEditable = block.attributes.editable?.value;
        const isEditableValid = isEditable === "true";

        if (isIDValid && isEditableValid) {
          editableBlocks.push(block);
        }
      }
    }

    editableBlocks.forEach((editableBlock) => {
      editableBlock.addEventListener("click", editableBlockClicked);
    });

    function getFormInformation(desiredID) {
      //1- Loop over configFile and catch the Type and Version for the block with the desiredID
      let blockType = "";
      let blockVersion = "";

      configFile.data.areas.forEach((area) => {
        area.blocks.forEach((block) => {
          if (block.id === desiredID) {
            blockType = block.type;
            blockVersion = block.version;
            that.formInoutsData = block.data;
          }
        });
      });

      //2- Call the definition json to get the filds input types
      definitionFile.data.definitions.forEach((definition) => {
        if (
          definition.type === blockType &&
          definition.version === blockVersion
        ) {
          if (that.formInputs.length === 0) {
            that.formInputs.push(definition.inputs);
          } else {
            that.formInputs.pop();
            that.formInputs.push(definition.inputs);
          }
        }
      });
    }

    function editableBlockClicked(event) {
      if (event.target.id) {
        getFormInformation(event.target.id);
      } else {
        getFormInformation(event.target.parentElement.id);
      }

      that.show = true;

      while (that.editorsPayload.length > 0) {
        that.editorsPayload.pop();
      }

      if (that.lastClickedBlock) {
        if (event.target.id.split("ID")[0] === "block") {
          that.lastClickedBlock.classList.remove("currently-clicked-block");
        } else {
          that.lastClickedBlock.parentElement.classList.remove(
            "currently-clicked-block"
          );
        }
      }

      let editableBlock = event.target;
      that.lastClickedBlock = editableBlock;

      if (editableBlock.id.split("ID")[0] === "block") {
        editableBlock.classList.add("currently-clicked-block");
      } else {
        editableBlock = event.target.parentElement;
        editableBlock.parentElement.classList.add("currently-clicked-block");
      }

      //3- Put the input types on the form
      for (let i = 0; i < Object.values(that.formInputs[0]).length; i++) {
        const type = Object.values(that.formInputs[0])[i];
        const data = Object.values(that.formInoutsData)[i];
        const inputSectionName = Object.keys(that.formInoutsData)[i];

        that.editorsPayload.push({
          type,
          data,
          inputSectionName,
          blockID: editableBlock.id,
        });
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
