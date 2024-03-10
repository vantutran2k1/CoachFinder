<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="message">Message</label>
        <textarea rows="5" id="message" v-model.trim="message"></textarea>
      </div>
      <p class="errors" v-if="!formIsValid">Please enter a valid email and non-empty message</p>
      <div class="actions">
        <base-button>Send Message</base-button>
      </div>
    </form>
  </div>
</template>

<script>
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';

export default {
  components: {BaseDialog, BaseButton},
  data() {
    return {
      message: '',
      formIsValid: true,
      error: null
    };
  },
  methods: {
    submitForm() {
      this.formIsValid = true;

      if (this.message === '') {
        this.formIsValid = false;
        return;
      }
      try {
        this.$store.dispatch('requests/contactCoach', {
          coachId: this.$route.params.id,
          message: this.message,
        });
      } catch (err) {
        this.error = err.message || 'Failed to contact coach!';
      }

      this.$router.replace('/coaches');
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>