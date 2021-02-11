<template>
    <div class="flex items-start space-x-2 mt-2 h-12"
    :class="[ isGhost ? 'text-gray-300 focus:text-black' : 'border-yellow-400' ]"
    @mouseenter="enter"
    @mouseleave="leave"
    >
        <div class="w-1/12 -mr-2 ml-2"
        >
            <Icon :id="`${item.id}-edit-icon`" v-show="showIcons && !beingEdited" icon="fa-pencil-alt" @click="edit" />
        </div>

        <div class="flex-grow flex flex-col"
        >
            <span v-if="!beingEdited && !isGhost" class="" > {{ formattedLabel }}</span>
            <input v-else v-model="savedLabel"
                :id="`${item.id}-label-input`"
                class="focus:border-black focus:text-black"
                :class="[
                    isGhost ? 'border-gray-300' : ' border-yellow-200',
                ]"
                :readonly="!(isGhost || beingEdited) || isBase"
                @focus="edit"
            />
            <Warning v-if="labelTooShort">
                This label is too short!
            </Warning>
        </div>
        <div class="w-1/3 flex flex-col">
            <div v-if="!beingEdited && !isGhost" class="text-right" > {{ formattedValue }}</div>
            <input v-else v-model.number="savedValue"
                type="number"
                :id="`${item.id}-value-input`"
                class="text-right focus:border-black focus:text-black"
                :class="[ghostButEnabled ? 'border-yellow-200' : '']"
                @focus="edit"
            />
            <Warning v-if="!aNumber">
                Cannot be negative!
            </Warning>
        </div>
        <div class="w-16" >
            <Icon :id="`${item.id}-thrash-icon`" v-show="showIcons && !beingEdited && !isBase" icon="fa-trash-alt" @click="trash" />
            <Icon :id="`${item.id}-check-icon`" v-show="beingEdited" icon="fa-check" @click="submitChanges" />
        </div>
    </div>
</template>

<script>
import Icon from './Icon.vue'
import Warning from './Warning.vue'

export default {
    name: 'Field',
    components: {
        Warning,
        Icon,
    },
    props: {
        item: Object,
        isBase: {
            type: Boolean,
            default: false
        },
        isGhost: {
            type: Boolean,
            default: false
        },
        index: Number,
        beingEdited: Boolean
    },
    data() {
        return {
            isFormattedMode: false,
            showIcons: false,
            savedLabel: 'Label',
            savedValue: 0
        }
    },
    computed: {
        ghostButEnabled() {
            return this.isGhost
        },
        labelTooShort() {
            return this.savedLabel.length < 2
        },
        aNumber() {
            return this.testFloat(this.savedValue)
        },
        formattedValue() {
            const value = this.item.value.toString()
            const isComma = value.includes('.')
            if (isComma) {
                const numbers = value.split('.')
                if ((numbers.length > 1 && numbers[1]).length > 1) {
                    return this.item.value.toFixed(2)
                }
            }
                return this.item.value.toFixed(1)
        },
        formattedLabel() {
            return this.item.label
        }
    },
    methods: {
        filterFloat(value) {
            if(this.testFloat(value))
                return Number(value);
            return NaN;
        },
        testFloat(value) {
            return (/^(\+)?([0-9]+(\.[0-9]+)?)$/.test(value))
        },
        enter(event) {
            if (this.isGhost) return
            this.showIcons = true
        },
        leave(event) {
            this.showIcons = false
        },
        trash() {
            this.$emit('trash', this.item)
        },
        edit() {
            if (this.beingEdited) return
            this.savedLabel = this.item.label
            this.savedValue = this.item.value
            this.$emit('start-editing', this.item)
        },
        submitChanges() {
            const returnItem = { value: this.filterFloat(this.savedValue), label: this.item.label}
            if (!this.labelTooShort) {
                returnItem.label = this.savedLabel.trim()
            }
            const value = returnItem.value
            if (this.isGhost) {
                if (returnItem.label.length > 1 && !Number.isNaN(value) && value !== 0) {
                    this.$emit('new-field-accepted', returnItem)
                }
                this.savedLabel = 'Label'
                this.savedValue = 0
                return
            } else {
                if (Number.isNaN(value)) {
                    returnItem.value = this.item.value
                }
                this.savedLabel = returnItem.label
                this.savedValue = returnItem.value
            }
            this.$emit('stop-editing', {...this.item, value: returnItem.value, label: returnItem.label})
        }
    },
}
</script>
