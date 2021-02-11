<template>
    <div class="text-right mr-16 pr-2">
        Total: 
        <span class="font-bold">
            {{ total }}
        </span>
        EUR
    </div>
</template>

<script>
    export default {
        name: 'TotalPrice',
        components: {
        },
        props: {
            items: Object
        },
        computed: {
            total() {
                return this.items.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.value
                , 0).toFixed(2)
            }
        }
        
    }
</script>

<style scoped>

</style>