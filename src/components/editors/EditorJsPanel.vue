<template>
    <div >
        <div class="editorx_body">
            <div class id="codex-editor"/>
        </div>

        <button class="btn btn-primary my-2" style="margin-left: 45%" type="button" name="button" @click="displayEditorJSChanges()">Show Chages</button>
    </div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool  from "@editorjs/image";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Paragraph from "@editorjs/paragraph";
import Delimiter  from "@editorjs/delimiter";

export default {
    props: {
        field: Object,
    },

    data() {
        return {
        value: null
        };
    },
    methods: {
        displayEditorJSChanges() {
            editor.save().then(savedData => {
                console.log("1111")
                this.$emit("display-editorJS-changes", savedData)
            });
        },
        myEditor() {
            window.editor = new EditorJS({
                // minHeight:8,
                holder: "codex-editor",
                autofocus: true,
                initialBlock: "paragraph",
                tools: {
                    header: {
                        class: Header,
                        shortcut: "CMD+SHIFT+H"
                    },
                    list: {
                        class: List
                    },
                    paragraph: {
                        class: Paragraph,
                        config: {
                        placeholder: "placeholderText"
                        }
                    },
                    checklist: {
                        class: Checklist,
                        inlineToolbar: true,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                            byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                            byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                            }
                        }
                    },
                    delimiter: Delimiter,
                },
                data: this.showSavedData(),
                onReady: () => {
                    console.log('Editor.js is ready to work!', this.field.data)
                },
                onChange() {
                console.log("change");
                },
            });
        },
        showSavedData() {
            return this.field.data
        },
        resizeSideBarBeforeOpenEditorJS(){
            const sidebar = document.querySelector('.sidebar-component').children[0]
            const toggleSideBarButton = document.querySelector('.move-toggle-sidebar')
            sidebar.classList.add('sidebar-componen-for-editor-js')
            toggleSideBarButton.classList.add('move-toggle-sidebar-button-for-editor-js')
        },
        resizeSideBarBeforeCloseEditorJS(){
            const sidebar = document.querySelector('.sidebar-componen-for-editor-js')
            const toggleSideBarButton = document.querySelector('.move-toggle-sidebar-button-for-editor-js')
            sidebar.classList.remove('sidebar-componen-for-editor-js')
            toggleSideBarButton.classList.remove('move-toggle-sidebar-button-for-editor-js')
        },
    },
    mounted() {
        this.myEditor();
        this.resizeSideBarBeforeOpenEditorJS()
    },
    beforeUnmount() {
        this.resizeSideBarBeforeCloseEditorJS()
    } 
};
</script>

<style lang="css" scoped >
    .ce-block--focused {
        background: linear-gradient(
            90deg,
            rgb(36, 0, 0) 0%,
            rgba(9, 9, 121, 0.5438550420168067) 35%,
            rgba(0, 212, 255, 1) 100%
        );
    }
</style>

<style lang="css" >
    .sidebar-componen-for-editor-js {
        width: 50% !important;
    }

    .move-toggle-sidebar-button-for-editor-js {
        right: 50% !important;
    }
</style>