<template>
  <MainModal
    v-if="this.state.isShowModal"
    title="Add Block"
    :isModalLoading="this.state.isModalLoading"
    @close="closeModal"
  >
    <template #default>
      <template v-if="definitionFile.data.definitions">
      <NewBlockRef
        v-for="definition in definitionFile.data.definitions"
        :key="definition.type"
        :type="definition.type"
        :image="definition.image"
        @add-new-block="addNewBlock"
      ></NewBlockRef>
      </template>
    </template>
  </MainModal>
  <div class="blocks-refs-container" v-else>
    <Draggable 
      animation="400"
      v-model="this.configFile.data.areas[0].blocks" 
      group="people" 
      @start="drag=true" 
      @end="drag=false" 
      @update="updateUIForNewBlocksOrder"
      item-key="element.id">
      <template #item="{element}">
        <div>
          <div class="block-refs-wrapper clickable" @click="this.handleBlockClick({target:{id:element.id}})">
              <div></div>
              <div>{{element.type}}</div>
              <div>#{{element.id}}</div>
          </div>
          <div class="add-new-block-ref-wrapper">
            <div class="add-new-block-ref clickable" @click="this.openAddNewBlockModal">
              +
            </div>
          </div>
        </div>
      </template>
    </Draggable >
  </div>
</template>

<script>
import generatePage from "@/lib/generatePage";
import NewBlockRef from "./NewBlockRef.vue";
import MainModal from "./MainModal.vue";
import addClickEventsToBlock from "@/logic/addClickEventsToBlock";
import Draggable  from "vuedraggable"

export default {
  name: "BlockSelector",

  components: {
    MainModal,
    NewBlockRef,
    Draggable 
  },

  props: {
    handleFormDataSetUp: Function,
    configFile: Object,
    definitionFile: Object
  },

  data: function () {
    return {
      data: {
            event: {
                target: {
                    id: "",
                }
            }
        },
      state: {
        isShowModal: false,
        isModalLoading: false,
      },
    };
  },

  methods: {
    updateUIForNewBlocksOrder(){
      this.$emit("update-UI-for-new-blocks-order")
    },

    handleBlockClick(e){
        this.$emit("block-click", e)
    },

    openAddNewBlockModal() {
      this.state.isShowModal = true;
    },

    closeModal() {
      this.state.isShowModal = false;
    },

    getEmptyBlock() {
      return {
        id:
          "blockID" +
          Math.floor(
            Math.random() * (99 - this.configFile.data.areas[0].blocks.length + 1) +
              this.configFile.data.areas[0].blocks.length +
              1
          ),
        type: "",
        version: "1",
        htmlTemplatePath: "",
        cssPath: "",
        data: {},
      };
    },

    predareEmptyBlock(type, newBlock) {
      if (!this.definitionFile) return
      const definition = this.definitionFile.data.definitions.find(definition=>definition.type === type)
      if (!definition) throw new Error('some error')
      const definitionCopy = JSON.parse(JSON.stringify(definition))
      newBlock.data = definitionCopy.inputs;
      newBlock.type = definitionCopy.type;
      newBlock.htmlTemplatePath = `../components/${definitionCopy.type}/${definitionCopy.type}.ejs`;
      newBlock.cssPath = `../components/${definitionCopy.type}/${definitionCopy.type}.scss`;
      return newBlock
    },

    async updateUIwithNewBlock(newBlock) {
      const configFileCopy = JSON.parse(JSON.stringify(this.configFile))
      configFileCopy.data.areas[0].blocks.push(newBlock);

      const previewHTML = await generatePage("la-plagne", configFileCopy);
      const previewHTMLPageDom = new DOMParser().parseFromString(
        previewHTML.data,
        "text/html"
      );

      const previewArea = previewHTMLPageDom.getElementById(
        newBlock.id
      ).parentElement;

      const currentArea = document.getElementById(configFileCopy.data.areas[0].blocks[0].id).parentElement;

      addClickEventsToBlock(previewArea, this.handleFormDataSetUp);
      this.$emit("update-config", configFileCopy);
      this.$emit("select-block-bridge", newBlock);
      this.$emit("make-save-button-available");

      currentArea.replaceWith(previewArea);
    },

    async addNewBlock(type) {
      this.state.isModalLoading = true;

      const newBlock = this.getEmptyBlock()
      const preparedBlock = this.predareEmptyBlock(type, newBlock)
      await this.updateUIwithNewBlock(preparedBlock)
      this.handleBlockClick({target:{id:newBlock.id}})

      this.state.isShowModal = false;
      this.state.isModalLoading = false;
    },
  },
};
</script>

<style>
  .blocks-refs-container {
    flex: 1;
    overflow-y: scroll;
  }

  .block-refs-wrapper {
      z-index: +1;
      background-color: #f2f2f3;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 5px;
      margin: 0 5%;
      padding: 10px 10px;
      min-height: 40px;
  }

  .block-refs-wrapper div:nth-child(1) {
      height: 8px;
      width: 8px;
      background-color: #337ab7;
      border-radius: 2px;
      -webkit-flex-shrink: 0;
      flex-shrink: 0;
      margin: 0 8px 0 6px;
  }

  .block-refs-wrapper div:nth-child(2) {
      font-size: 14px;
      font-weight: bold;
      color: black;
  }

  .block-refs-wrapper div:nth-child(3) {
      font-size: 12px;
      font-weight: 500;
      color: gray;
      margin-left: 5px;
  }

  .clickable:hover {
      background-color: #dfe5f6;
      color: #193fa2;
      cursor: pointer;
  }

  .add-new-block-ref-wrapper {
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .add-new-block-ref-wrapper:hover .add-new-block-ref{
      display: flex;
  }

  .add-new-block-ref {
      display: none;
      border: 3px solid white;
      background-color: #dfe5f6;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      height: 30px;
      width: 30px;
      font-size: xx-large;
  }

  @media only screen and (max-width: 700px){
      .block-refs-wrapper {
          flex-direction: column;
      }
  }
</style>
