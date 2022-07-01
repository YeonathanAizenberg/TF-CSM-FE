<template>
    <div class="block-refs-wrapper clickable" @click="handleBlockClick">
        <div></div>
        <div>{{type}}</div>
        <div>#{{blockID}}</div>
    </div>
    <div class="add-new-block-ref-wrapper">
        <div class="add-new-block-ref clickable" @click="$emit('open-add-new-block-modal')">
            +
        </div>
    </div>
</template>

<script>
    export default {
        name: "BlockRef",

        props: {
            blockID: String,
            type: String,
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
                },
            };
        },


        methods: {
            handleBlockClick() {
                this.$emit('block-click', this.data.event);
            },
        },

        mounted() {
            this.data.event.target.id = this.blockID
        },
    };
</script>

<style >
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