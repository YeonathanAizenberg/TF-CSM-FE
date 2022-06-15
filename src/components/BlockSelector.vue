<template>
    <div v-if="this.state.isLoading">
        Loading...
    </div>
    <div class="blocks-refs-container" v-else>
        <block-ref v-for="block in data.configFileBlocks" :key="block.id" :blockID="block.id" :type="block.type"></block-ref>
    </div>
</template>

<script>
import { getConfigData } from '@/lib/api';
import BlockRef from "./BlockRef.vue";

export default {
    name: "BlockSelector",
    components: {
        BlockRef
    },

    data: function () {
        return {
            data: {
                configFile: {},
                configFileBlocks: {},
            },
            state: {
                isLoading: true
            },
        };
    },

    async mounted() {
        this.data.configFile = await getConfigData("la-plagne");
        this.data.configFileBlocks = this.data.configFile.data.areas[0].blocks
        this.state.isLoading = false
    },
};
</script>

<style >

</style>