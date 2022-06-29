<template>
  <div v-show="isShow" class="card sidebar-component">
    <editors-displayer
      v-if="this.isAnyBlockSelected"
      :editableBlockClicked="editableBlockClicked"
      :editableBlockChildrenClicked="editableBlockChildrenClicked"
      :configFile="configFile"
    ></editors-displayer>
    <block-selector
      v-else
      :editableBlockClicked="editableBlockClicked"
      :editableBlockChildrenClicked="editableBlockChildrenClicked"
      :newConfigFile="configFile"
    ></block-selector>
  </div>

  <button
    type="button"
    @click="toggleSidebar"
    class="toggle-sidebar btn btn-primary mr-1"
    :class="{ 'move-toggle-sidebar': isShow }"
  >
    <svg
      v-if="isShow"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-arrow-right"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
      />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-arrow-left"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
      />
    </svg>
  </button>
</template>

<script>
import EditorsDisplayer from "./EditorsDisplayer.vue";
import BlockSelector from "./BlockSelector.vue";

export default {
  components: { EditorsDisplayer, BlockSelector },
  name: "SidebarComp",

  emits: ["toggleSidebar"],

  props: {
    isShow: {
      type: Boolean,
      required: true,
    },

    isAnyBlockSelected: {
      type: Boolean,
      required: true,
    },

    editableBlockClicked: {
      type: Function,
      required: false,
    },

    editableBlockChildrenClicked: {
      type: Function,
      required: false,
    },

    configFile: {
      type: Object,
      required: false,
    },
  },

  computed: {
    toggleIcon() {
      return this.isShow ? "bi-arrow-left" : "bi-arrow-right";
    },
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
  },
};
</script>

<style scoped>
.sidebar-component {
  display: flex;
  flex-direction: column;
  width: 37%;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 100;

  background-color: #fff;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.toggle-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
}
.move-toggle-sidebar {
  right: 37%;
}
</style>
