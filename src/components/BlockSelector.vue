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
        :name="definition.name"
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
      @update="updateUI"
      item-key="element.id">
      <template #item="{element}">
        <div>
          <div class="block-refs-wrapper clickable" @click="this.handleFormDataSetUp({target:{id:element.id}})">
              <div></div>
              <div>{{element.name}}</div>
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
import NewBlockRef from "./NewBlockRef.vue";
import MainModal from "./MainModal.vue";
import Draggable  from "vuedraggable"

export default {
  name: "BlockSelector",

  components: {
    MainModal,
    NewBlockRef,
    Draggable 
  },

  props: {
    handleFormDataSetUpProp: Function,
    configFile: Object,
    definitionFile: Object,
    selectedPage: String,
    initialTemplate: String,
    initialTemplateVerison: String,
  },

  data: function () {
    return {
      // content: this.configFile,
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
    updateUI(){
      this.$emit("update-UI")
    },

    handleFormDataSetUp(e){
        this.$emit("handle-form-data-set-up", e)
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
        name: "",
        version: "1",
        htmlTemplatePath: "",
        cssPath: "",
        data: {},
      };
    },

    predareEmptyBlock(name, newBlock) {
      if (!this.definitionFile) return
      const definition = this.definitionFile.data.definitions.find(definition=>definition.name === name)
      if (!definition) throw new Error('some error')
      const definitionCopy = JSON.parse(JSON.stringify(definition))
      newBlock.data = definitionCopy.inputs;
      newBlock.type = definitionCopy.type;
      newBlock.name = definitionCopy.name;
      newBlock.htmlTemplatePath = `../../../../components/${definitionCopy.type}/${definitionCopy.type}.ejs`;
      newBlock.cssPath = `../../../../components/${definitionCopy.type}/${definitionCopy.type}.scss`;
      return newBlock
    },

    async pushNewBlock(newBlock) {
      const configFileCopy = JSON.parse(JSON.stringify(this.configFile))
      configFileCopy.data.areas[0].blocks.push(newBlock);

      this.$emit("update-config", configFileCopy);
    },

    async addNewBlock(name) {
      this.state.isModalLoading = true;

      const newBlock = this.getEmptyBlock()
      const preparedBlock = this.predareEmptyBlock(name, newBlock)

      this.pushNewBlock(preparedBlock)
      this.$emit("update-UI", newBlock)
      this.handleFormDataSetUp({target:{id:newBlock.id}})
      this.$emit("make-save-button-available");

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
      width: max-content;
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

  .add-first-new-block-ref {
    position: absolute;
    left: 45%;
    display: flex;
    border: 3px solid white;
    background-color: #dfe5f6;
    justify-content: center;
    align-items: self-end;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    font-size: xx-large;
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
