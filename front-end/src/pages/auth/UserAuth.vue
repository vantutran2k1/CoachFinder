<template>
  <base-card>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="email">Email</label>
        <input type="email" id="email" v-model.trim="email">
      </div>
      <div class="form-control">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password">
      </div>
      <p v-if="!formIsValid">Please enter a valid email and password (must be at least 6 characters long)</p>
      <base-button>{{ submitButtonCaption }}</base-button>
      <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button>
    </form>
  </base-card>
</template>

<script>
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';

const LOGIN = 'login';
const SIGN_UP = 'signup';

export default {
  components: {BaseButton, BaseCard},
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: LOGIN
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === LOGIN) {
        return 'Login';
      } else {
        return 'Signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === LOGIN) {
        return 'Signup instead';
      } else {
        return 'Login instead';
      }
    }
  },
  methods: {
    submitForm() {
      this.formIsValid = true;

      if (this.email === '' || !this.email.includes('@') || this.password.length < 6) {
        this.formIsValid = false;
        return;
      }

      if (this.mode === LOGIN) {
        //   
      } else {
        this.$store.dispatch('signup', {
          email: this.email,
          password: this.password
        });
      }
    },
    switchAuthMode() {
      if (this.mode === LOGIN) {
        this.mode = SIGN_UP;
      } else {
        this.mode = LOGIN;
      }
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;
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
</style>