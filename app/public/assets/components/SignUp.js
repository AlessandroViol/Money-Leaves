import { apiSignUp } from '../js/serverInteractions.js';

const SignUp = {
	template: `
    <div class="form-auth m-auto py-4">
      <form class='needs-validation' novalidate>
        <img
          class='mb-4 d-block mx-auto'
          src='./assets/imgs/logo.svg'
          alt='logo'
          width='150'
          height='150'
          style='border-radius: 100%'
        />

        <h1 class='h3 mb-3 fw-normal'>Please sign up</h1>

        <div class='form-floating'>
          <input type='text' class='form-control first' id='floatingUsername' placeholder='' v-model='username' :class="{'is-invalid': isUsernameAlreadyTanken || isUsernameInvalid}" required/>
          <label for='floatingInput'>Username</label>
          <div v-if="isUsernameAlreadyTanken" class="invalid-feedback">Username is already taken.</div>
          <div v-if="isUsernameInvalid" class="invalid-feedback">Invalid username. It must be alphabetical and not empty.</div>
        </div>

        <div class='form-floating'>
          <input type='text' class='form-control middle' id='floatingName' placeholder='' v-model='name' :class="{'is-invalid': isNameInvalid}" required/>
          <label for='floatingInput'>Name</label>
          <div v-if="isNameInvalid" class="invalid-feedback">Invalid name.</div>
        </div>

        <div class='form-floating'>
          <input type='text' class='form-control middle' id='floatingSurname' placeholder='' v-model='surname' :class="{'is-invalid': isSurnameInvalid}" required/>
          <label for='floatingInput'>Surname</label>
          <div v-if="isSurnameInvalid" class="invalid-feedback">Invalid surname.</div>
        </div>

        <div class='form-floating'>
          <input type='password' class='form-control middle' id='floatingPassword' placeholder='' v-model='password' :class="{'is-invalid': isPasswordInvalid}" required/>
          <label for='floatingPassword'>Password</label>
          <div v-if="isPasswordInvalid" class="invalid-feedback">The password must be at least 6 characters long and contain at least 2 numbers and a letter</div>
        </div>

        <div class='form-floating'>
          <input type='password' class='form-control last' id='floatingPasswordRepeat' placeholder='' v-model='passwordRepeat' :class="{'is-invalid': isDifferentPassword}" required/>
          <label for='floatingPassword'>Repeat password</label>
          <div v-if="isDifferentPassword" class="invalid-feedback">The password doesn't match</div>
        </div>

        <p class="text-start my-3">Do you already have an account? 
          <router-link to="/signin" class="link-primary link-opacity-75-hover link-underline-opacity-0 fw-medium">Sign In!</router-link>
        </p>

        <button class='mb-4 btn btn-primary w-100 py-2' type='submit' @click.prevent='submit' :disabled="isDisabled">
          Sign Up
        </button>
      </form>

      <div class="modal fade" id="signUpConfirm" tabindex="-1" aria-labelledby="signUpConfirmLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="signUpConfirmLabel">Sign up completed!</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Please, sign in to continue.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary mx-auto" @click="goToSignIn">Go to sign in</button>
            </div>
          </div>
        </div>
      </div>

    </div>
		
  `,

	data: function () {
		return {
			username: '',
			isUsernameAlreadyTanken: false,
			isUsernameInvalid: false,

			name: '',
			isNameInvalid: false,

			surname: '',
			isSurnameInvalid: false,

			password: '',
			isPasswordInvalid: false,

			passwordRepeat: '',
		};
	},

	methods: {
		async submit() {
			const res = await apiSignUp(this.username, this.name, this.surname, this.password, this.$router);

			if (res.status === 460) {
				this.isPasswordInvalid = true;
			} else {
				this.isPasswordInvalid = false;
			}

			if (res.status === 461) {
				this.isUsernameInvalid = true;
			} else {
				this.isUsernameInvalid = false;
			}

			if (res.status === 462) {
				this.isNameInvalid = true;
			} else {
				this.isNameInvalid = false;
			}

			if (res.status === 463) {
				this.isSurnameInvalid = true;
			} else {
				this.isSurnameInvalid = false;
			}

			if (res.status === 464) {
				this.isUsernameAlreadyTanken = true;
			} else {
				this.isUsernameAlreadyTanken = false;
			}

			if (res.ok) {
				const modal = new bootstrap.Modal(document.getElementById('signUpConfirm'));
				modal.show();
			}

			console.log('Sign up result', res);
		},

		goToSignIn() {
			const modal = bootstrap.Modal.getInstance(document.getElementById('signUpConfirm'));
			modal.hide();
			this.$router.push({ path: '/signin' });
		},
	},

	computed: {
		isDisabled() {
			const isDisabled =
				this.username === '' ||
				this.name === '' ||
				this.surname === '' ||
				this.password === '' ||
				this.passwordRepeat === '' ||
				this.password !== this.passwordRepeat;

			return isDisabled;
		},

		isDifferentPassword() {
			if (this.password !== this.passwordRepeat) {
				return true;
			} else {
				return false;
			}
		},
	},
};

export default SignUp;
