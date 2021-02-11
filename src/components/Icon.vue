<template>
    <span class="w-3 h-3 p-2 cursor-pointer">
        <i
            class="fas"
            :class="icon"
        />
    </span>
</template>

<script>
export default {
    name: 'Icon',
    components: {
    },
    props: {
        icon: String,
    },
    // methods: {
    //     emitUp(){
    //         this.$emit('clicked')
    //     }
    // }
    
}
</script>

<style scoped>

</style>