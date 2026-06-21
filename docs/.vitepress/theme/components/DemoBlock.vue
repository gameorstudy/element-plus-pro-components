<script setup lang="ts">
import { ref, watch } from 'vue'
import { createHighlighter, type ShikiTransformer } from 'shiki'

const props = defineProps<{
  code: string
}>()

const visible = ref(false)
const copied = ref(false)
const highlightedHtml = ref('')

let copiedTimer: ReturnType<typeof setTimeout> | undefined

const vpCodeTransformer: ShikiTransformer = {
  name: 'vitepress:vp-code',
  pre(node) {
    node.properties.class = `${node.properties.class ?? ''} vp-code`.trim()
    delete node.properties.style
  },
}

const highlighterPromise = createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['vue', 'typescript', 'tsx'],
})

watch(
  () => props.code,
  async (code) => {
    const highlighter = await highlighterPromise
    highlightedHtml.value = highlighter.codeToHtml(code, {
      lang: 'vue',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      transformers: [vpCodeTransformer],
    })
  },
  { immediate: true },
)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
  }
  catch {
    const textarea = document.createElement('textarea')
    textarea.value = props.code
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="vp-demo-block">
    <div class="vp-demo-block__preview">
      <slot />
    </div>
    <button
      type="button"
      class="vp-demo-block__footer"
      @click="visible = !visible"
    >
      <span class="vp-demo-block__toggle">
        {{ visible ? '隐藏代码' : '显示代码' }}
      </span>
    </button>
    <div v-show="visible" class="vp-demo-block__code">
      <div class="language-vue vp-adaptive-theme">
        <button
          type="button"
          class="copy"
          :class="{ copied }"
          title="复制代码"
          aria-label="复制代码"
          @click="copyCode"
        />
        <span class="lang">vue</span>
        <div v-html="highlightedHtml" />
      </div>
    </div>
  </div>
</template>
