<template>
    <div
        class="w-full h-screen overflow-y-auto relative text-center bg-stone-800"
        @click="screenClick"
        ref="scrollEl"
    >
        <!-- UI -->
        <div class="fixed left-2 top-2">
            <span class="font-semibold text-stone-400">{{ wordsAdded }} / {{ WORD_GOAL }}</span>
        </div>
        <!-- Word List -->
        <div
            class="flex flex-col justify-end min-h-half box-content"
            style="padding-bottom: 50vh;"
        >
            <Word v-for="(word, i) in words"
                  @click.stop="() => onWordClick(word)"
                  @change="(text) => onWordChange(word, text)"
                  v-bind="word"
                  :key="word.id"
                  :isEditing="editingWord === word"
            />
        </div>
        <!-- Start Button -->
        <div
            v-if="!isStarted && shouldStop && !isComplete"
            class="fixed inset-0 h-fit w-fit m-auto px-6 py-4 bg-stone-700"
        >
            <button @click="toggle" class="py-2 px-6 font-bold text-xl">
                Start
            </button>
        </div>
        <div
            v-if="isComplete"
            class="fixed inset-0 h-screen w-screen backdrop-blur-sm flex items-center justify-center backdrop-filter"
        >
            <div class="px-6 pt-4 pb-6 bg-stone-700">
                <h4 class="font-bold text-3xl mb-2 mt-0">CONGRATULATIONS!</h4>
                <p class="font-bold text-lg m-0">You've freely associated {{ WORD_GOAL }} words</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { generate } from 'random-words'

import Word from './Word.vue'

const scrollEl = ref<HTMLElement | null>(null)

export interface WordData {
    id: string
    text: string
    isPrimary?: boolean
}

const WORD_GOAL = 75

const words = reactive<WordData[]>([])
const editingWord = ref<WordData | null>(null)

const isStarted = ref(false)
const shouldStop = ref(true)
const isComplete = ref(false)

const recognition = new webkitSpeechRecognition()

recognition.lang = 'en-US'
recognition.continuous = true
recognition.interimResults = false

// Every third word should set isPrimary to true

let wordsAdded = ref(0)

const addWord = (text: string, isPrimaryOverride = false) => {
    words.push({
        id: uuidv4(),
        text: text,
        isPrimary: isPrimaryOverride || wordsAdded.value % 3 === 0,
    })
    wordsAdded.value += 1
}

const onWordChange = (word: WordData, text: string) => {
    word.text = text
    editingWord.value = null
}

const randomWord = (): string => {
    const word = generate({ minLength: 4 })
    // @ts-ignore
    return word
}

addWord(randomWord(), true)

// Debugging
for (let i = 0; i < 0; i++) {
    addWord(`Word ${i}`)
}

recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript.trim()
    editingWord.value = null

    if (result.toLowerCase() === 'delete') {
        wordsAdded.value -= 1
        words.pop()
        return
    }

    addWord(result)

    nextTick(() => {
        scrollEl.value?.scrollTo(0, scrollEl.value.scrollHeight)
    })

    if (wordsAdded.value >= WORD_GOAL) {
        isComplete.value = true
        return
    }

    recognition.stop()
}

recognition.onend = () => {
    console.log('onend')
    isStarted.value = false

    if (shouldStop.value || isComplete.value) return

    recognition.start()
}

recognition.onstart = () => {
    isStarted.value = true
}

recognition.onerror = (err) => {
    console.error(err)
}

const screenClick = () => {
    if (editingWord.value) {
        editingWord.value = null
        return
    }

    if (isStarted.value) {
        toggle()
    }
}

const onWordClick = (word: WordData) => {
    if (editingWord.value) {
        editingWord.value = null
        return
    }

    editingWord.value = word
}

const toggle = () => {
    if (isStarted.value) {
        shouldStop.value = true
        recognition.stop()
        return
    }

    shouldStop.value = false
    recognition.start()
}
</script>

<style scoped>
.min-h-half {
    min-height: 50vh;
}
</style>
