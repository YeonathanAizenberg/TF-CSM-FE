<template>
  <div v-if="this.state.isLoading" class="loading"></div>
  <div class="header-wrapper" v-if="!this.state.isLoading">
    <div class="header-slot-one">
      <button class="btn btn-primary my-2" @click="backToBlockSelector">
        Back
      </button>
      <div class="block-refs-wrapper">
        <div></div>
        <div>{{ this.editorsPayload[0].blockRefType }}</div>
        <div>#{{ this.editorsPayload[0].blockID }}</div>
      </div>
    </div>
    <div class="header-slot-two">
      <button class="btn btn-primary my-2" @click="deleteBlock">
          DELETE
      </button>
    </div>
  </div>
  <div class="editor-displayer-container" v-if="!this.state.isLoading">
    <div id="editor-displayer-Wrapper" v-if="data.blockData?.fields">
      <div
        v-for="(field, index) in data.blockData.fields"
        :key="data.blockData.blockID + index"
      >
        <div class="my-2">
          <div v-if="field.type === 'image'">
            <ImageEditor
              :blockID="data.blockData.blockID"
              :field="field"
              @update-image-on-config="updateImageOnConfig"
            ></ImageEditor>
          </div>
          <div v-if="field.type === 'text'">
            <TextEditor
              :blockID="data.blockData.blockID"
              :field="field"
              @update-area-with-preview="updateAreaWithPreview"
            ></TextEditor>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TextEditor from "./editors/TextEditor.vue";
  import ImageEditor from "./editors/ImageEditor.vue";
  import generatePage from '@/lib/generatePage';
  import addClickEventsToBlock  from "@/logic/addClickEventsToBlock";
  import domParser from '@/utils/domParser.js'

  export default {
    name: "EditorsDisplayer",
  
    components: {
      TextEditor,
      ImageEditor,
    },

    props: {
      handleFormDataSetUpProp: Function,
      configFile: Object,
      editorsPayload : Array,
    },
  
    data: function () {
      return {
        data: {
          blockData: null,
          modifiedImageUrl: "",
          editorsPayloadNewBlock: null,
          currentBlock: {},
          previewBlocksConfig: {}
        },
        state: {
          isLoading: true,
        },
      };
    },

    watch: {
      editorsPayload: {
        handler(newValue) {
          this.addBlockData(newValue);
        },
        deep: true,
      },
    },

    methods: {
      addBlockData(currentEditorsPayloadData) {
        const block = {
          blockID: currentEditorsPayloadData[0].blockID,
          fields: [],
        };

        currentEditorsPayloadData.forEach((item) => {
          const { type, data, inputSectionName } = item;
          block.fields.push({ type, data, inputSectionName });
        });

        this.data.blockData = block;
      },

      backToBlockSelector() {
        this.$parent.$emit("unselect-block");
      },

      deleteBlock() {
        this.$emit("delete-block", this.editorsPayload[0].blockID);
      },

      async swapCurrentAndPreviewAreas() {
        const previewHTML = await generatePage("la-plagne", this.configFile);
        const previewHTMLPageDom = domParser(previewHTML.data)
        const previewArea = previewHTMLPageDom.getElementById(
          this.data.currentBlock.id
        ).parentElement;

        let currentArea = document.getElementById(this.data.currentBlock.id).parentElement;

        addClickEventsToBlock(
          previewArea,
          this.handleFormDataSetUpProp
        );

        await new Promise((resolve) => {
          setTimeout(function () {
            currentArea.replaceWith(previewArea);
            resolve();
          }, 1000);
        });
      },

      setUpCurrentBlockDataAndUpdateConfig() {
        this.data.currentBlock = this.configFile.data.areas[0].blocks.find(block=>block.id === this.data.blockData.blockID)

        for (const [i,field] of this.data.blockData.fields.entries()) {
          let currentKey = Object.keys(this.data.currentBlock.data)[i];
          if(field.inputSectionName === currentKey) {
            this.data.currentBlock.data[currentKey] = field.data
          }
        }
      },

      async updateAreaWithPreview() {
        this.setUpCurrentBlockDataAndUpdateConfig()

        this.swapCurrentAndPreviewAreas()
        
        this.$emit("make-save-button-available");
      },

      updateImageOnConfig() {
        this.setUpCurrentBlockDataAndUpdateConfig()

        this.$emit("make-save-button-available")
      },

      bringInitialData(){
        this.data.editorsPayloadNewBlock = this.editorsPayload;
        if (this.editorsPayload.length > 0) {
          this.addBlockData(this.data.editorsPayloadNewBlock);
        }
      }
    },

    mounted() {
      this.bringInitialData()
      this.state.isLoading = false
    },
  };
</script>

<style scoped>
  .header-wrapper {
    z-index: +1;
    display: flex;
    flex-direction: row;
    height: 5%;
    justify-content: space-between;
    align-items: center;
  }

  .header-slot-one {
    display: flex;
  }

  .editor-displayer-container {
    flex: 1;
    overflow-y: scroll;
  }

  .block-refs-wrapper {
    margin: 1%;
  }

  .block-refs-wrapper:hover {
    margin: 1%;
    background-color: #f2f2f3;
  }
</style>
