<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      {{ error }}
    </base-dialog>
    <section>
      <base-card>
        <h2>Register as a coach now!</h2>
        <coach-form @save-data="saveData"></coach-form>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachForm from '@/components/coaches/CoachForm.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';

export default {
  components: {BaseDialog, BaseCard, CoachForm},
  data() {
    return {
      error: null
    };
  },
  methods: {
    saveData(data) {
      try {
        this.$store.dispatch('coaches/registerCoach', data);
      } catch (err) {
        this.error = err.message || 'Failed to register as coach!';
      }

      this.$router.replace('/coaches');
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>