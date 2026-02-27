<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainFooter',
});
</script>

<template>
  <footer class="footer">
    <div class="container-lg">
      <div>&copy; {{ new Date().getFullYear() }} Awtrix3Hub</div>
    </div>
  </footer>
</template>
