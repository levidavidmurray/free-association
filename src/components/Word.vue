<template>
    <div>
        <input v-if="isEditing"
               type="text"
               autofocus="true"
               class="bg-transparent outline-none text-center font-bold text-2xl uppercase text-gray-200 mb-2"
               :placeholder="text"
               ref="input"
               v-model="newText"
               @click.stop="$el.focus()"
               @keyup.enter="onEnter"
        />
        <p
            v-else
            class="text-center font-bold text-2xl uppercase text-gray-200 mb-2"
            :class="{ primary: isPrimary, editing: isEditing }"
        >
            {{ text }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, toRefs, watch } from 'vue';
import { WordData } from './HelloWorld.vue'

const emits = defineEmits(['change'])

const props = defineProps<
    WordData & {
        isEditing: boolean
    }
>()
const { text, isPrimary, isEditing } = toRefs(props)

const newText = ref('')

const input = ref<HTMLInputElement | null>(null)

const onEnter = () => {
    emits('change', newText.value ? newText.value : text.value)
}

watch(() => props.isEditing, (isEditing) => {
    if (isEditing) {
        newText.value = ''
        nextTick(() => {
            input.value?.focus()
        })
    } else if (newText.value) {
        emits('change', newText.value)
    }
})
</script>

<style scoped>
.primary {
    @apply text-green-500 !important;
}
</style>
