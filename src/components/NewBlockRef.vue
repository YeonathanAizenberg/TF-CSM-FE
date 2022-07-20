<template>
    <div class="new-block-refs-wrapper unable-block" v-if="!['Titre', 'Image','Smart Editor 1', 'Moteur de recherche 2', 'CTA 1', 'CTA 4'].includes(name)">
        <img :src="image" alt="default">
        <div>{{name}}</div>
    </div>
    <div class="new-block-refs-wrapper" @click="$emit('add-new-block', name)" v-else>
        <img :src="image" alt="default">
        <div>{{name}}</div>
    </div>
</template>

<script>
    export default {
        name: "NewBlockRef",

        props: {
            type: String,
            name: String,
            image: String,
        },
    };
</script>

<style scope>
    .new-block-refs-wrapper {
        width: 140px;
        position: relative;
        border: 1px solid var(--border);
        border-radius: 5px;
        margin: 8px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
    }

    .new-block-refs-wrapper:hover {
        color: #337ab7;
        box-shadow: 2px 2px 9px #dcdce0;
    }

    .new-block-refs-wrapper div {
        display: block;
        margin: 0 0 10px;
        text-align: center;
        font-weight: 600;
        font-size: 13px;
    }

    .unable-block {
        background-color: rgb(188, 184, 184);
    }
</style>