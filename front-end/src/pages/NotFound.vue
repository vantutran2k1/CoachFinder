<template>
  <section>
    <base-card>
      <h2>Page not found</h2>
      <p>
        This page could not be found - maybe check out all our
        <router-link to="/coaches">coaches</router-link>
      </p>
    </base-card>
  </section>
</template>

<script>
import BaseCard from '@/components/ui/BaseCard.vue';

export default {
  components: {BaseCard}
};
</script>