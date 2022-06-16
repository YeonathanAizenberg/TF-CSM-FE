<template>
    <div class="block-refs-wrapper clickable" @click="displayBlcok">
        <div></div>
        <div>{{type}}</div>
        <div>#{{blockID}}</div>
    </div>
</template>

<script>

export default {
    name: "BlockRef",

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

            },
        };
    },

    props: {
        blockID: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            required: true,
        },
    },

    methods: {
        displayBlcok() {
            this.$parent.$parent.$emit('select-block', this.data.event);
        }
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
        margin: 5%;
        padding: 10px 10px;
        min-height: 40px;
    }

    .block-refs-wrapper div:nth-child(1) {
        height: 8px;
        width: 8px;
        background-color: #337ab7;
        margin-right: 8px;
        margin-left: 6px;
        border-radius: 2px;
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
    }

    .block-refs-wrapper div:nth-child(2) {
        font-size: 14px;
        font-weight: bold;
        padding: 0 12px;
        color: black;
    }

    .block-refs-wrapper div:nth-child(3) {
        font-size: 12px;
        font-weight: 500;
        color: gray;
    }

    .clickable:hover {
        background-color: #dfe5f6;
        color: #193fa2;
        cursor: pointer;
    }

    @media only screen and (max-width: 700px){
        .block-refs-wrapper {
            flex-direction: column;
        }
    }
</style>