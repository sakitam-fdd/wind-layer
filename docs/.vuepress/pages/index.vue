<template>
  <div class="theme-container">
    <div class="content">
      测试路由
    </div>
  </div>
</template>

<script>
  const msgs = [
    `There's nothing here.`,
    `How did we get here?`,
    `That's a Four-Oh-Four.`,
    `Looks like we've got some broken links.`
  ]
  export default {
    methods: {
      getMsg () {
        return msgs[Math.floor(Math.random() * msgs.length)]
      }
    }
  }
</script>
