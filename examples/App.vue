<template>
  <el-config-provider :locale="elementLocale">
    <div class="examples-app">
      <header class="examples-app__header">
        <nav class="examples-app__nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="examples-app__nav-link"
          >
            {{ item.label }}
          </router-link>
        </nav>
        <el-radio-group
          v-model="currentLocale"
          size="small"
        >
          <el-radio-button value="zh-cn">中文</el-radio-button>
          <el-radio-button value="en">English</el-radio-button>
        </el-radio-group>
      </header>
      <main class="examples-app__main">
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useExampleLocale } from './locale'

const { currentLocale, elementLocale } = useExampleLocale()

const navItems = [
  { path: '/pro-form/basic', label: 'ProForm' },
  { path: '/dialog-form/basic', label: 'DialogForm' },
  { path: '/pro-table/basic', label: 'ProTable' },
  { path: '/editable-pro-table/basic', label: 'EditableProTable' },
]
</script>

<style scoped>

.examples-app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.examples-app__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.examples-app__nav-link {
  padding: 6px 12px;
  border-radius: 4px;
  color: #606266;
  text-decoration: none;
}

.examples-app__nav-link.router-link-active {
  color: #409eff;
  background: #ecf5ff;
}

.examples-app__main {
  padding: 24px;
}
</style>
