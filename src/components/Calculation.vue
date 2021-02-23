<template>
    <div class="flex flex-col bg-yellow-200 rounded-lg p-3">
        <TotalPrice :items="allItems" />
        <List>
            <Field id="BasePrice" :item="basePrice" :isBase="true"
                :being-edited="editingFieldId === 'base'"
                @start-editing="startEditingField"
                @stop-editing="stopEditingField" />
            <Field
                :data-cy="'fieldRow'+i"
                v-for="(item, i) in items"
                :key="item.id" :item="item"
                :index="i"
                :being-edited="editingFieldId === item.id"
                @trash="trashHandler"
                @start-editing="startEditingField"
                @stop-editing="stopEditingField"
            />
            <Field id="Ghost" :item="ghost" :isGhost="true"
                :being-edited="editingFieldId === 'ghost'"
                @newFieldAccepted="newFieldHandler"
                @start-editing="startEditingField"
                @stop-editing="stopEditingField"
            />
        </List>
    </div>
</template>

<script>
import TotalPrice from './TotalPrice.vue'
import List from './List.vue'
import Field from './Field.vue'
import * as uuid from 'uuid'

export default {
    name: 'Calculation',
    components: {
        TotalPrice,
        List,
        Field,
    },
    data() {
        return {
            basePrice: {
                value: 1,
                label: 'Baseprice',
                id: 'base',
            },
            ghost: {
                value: 0,
                label: 'Label',
                id: 'ghost',
            },
            items: [
                // {
                //     value: 1.1,
                //     label: 'hallo1',
                //     id: uuid.v4(),

                // },
                // {
                //     value: 1.12,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 1.123,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 1.126,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 0,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 0.1,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 0.12,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 0.123,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
                // {
                //     value: 0.126,
                //     label: 'hallo2',
                //     id: uuid.v4(),
                // },
            ],
            editingFieldId: null
        }
    },
    computed: {
        allItems() {
            return [ this.basePrice, this.ghost, ...this.items]
        }
    },
    methods: {
        newFieldHandler(item) {
            item = { ...item, id: uuid.v4() }
            this.items.push(item)
            this.ghost = { label: 'Label', value: 0, id: 'ghost' }
            this.editingFieldId = null
        },
        trashHandler(payload) {
            this.items = this.items.filter((item) => item.id !== payload.id)
        },
        startEditingField(item) {
            this.editingFieldId = item.id
        },
        stopEditingField(item) {
            if (this.editingFieldId === item.id) {
                this.editingFieldId = null
            }
            if (item.id ==='ghost') {
                this.ghost = item
                return
            }
            if (item.id ==='base') {
                this.basePrice = item
                return
            }
            this.items = this.items.map((i) => {
                if (item.id === i.id) return {...item}
                return i
            })

        }
    }
    
}
</script>

<style scoped>

</style>