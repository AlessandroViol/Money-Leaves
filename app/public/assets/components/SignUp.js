const SignUp = {
	template: `
    <div class="form-auth m-auto">
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
          <router-link to="/" class="link-primary link-opacity-75-hover link-underline-opacity-0" style="font-weight: bold;">Sign In!</router-link>
        </p>

        <button class='btn btn-primary w-100 py-2' type='submit' @click.prevent='submit' :disabled="isDisabled">
          Sign Up
        </button>
      </form>
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
			isDifferentPassword: false,
		};
	},

	methods: {
		async submit() {
			const username = this.username;
			const name = this.name;
			const surname = this.surname;
			const password = this.password;
			const passwordRepeat = this.passwordRepeat;

			console.log(JSON.stringify({ _id: username, name, surname, password }));

			if (password !== passwordRepeat) {
				console.error('Password must match!');
				this.isDifferentPassword = true;
				return;
			} else {
				this.isDifferentPassword = false;
			}

			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ _id: username, name, surname, password }),
			});

			`if (response.status === 400) {
				this.isUsernameAlreadyTanken = response.error.isUsernameAlreadyTanken;
				this.isUsernameInvalid = response.error.isUsernameInvalid;
				this.isNameInvalid = response.error.isNameInvalid;
				this.isSurnameInvalid = response.error.isSurnameInvalid;
				this.isPasswordInvalid = response.error.isPasswordInvalid;
			}`;

			switch (response.status) {
				case 460:
					console.error('460 Forbidden: invalid password');
					this.isPasswordInvalid = true;
					return;
				case 461:
					console.error('461 Forbidden: invalid username');
					this.isUsernameInvalid = true;
					return;
				case 462:
					console.error('462 Forbidden: invalid name');
					this.isNameInvalid = true;
					return;
				case 463:
					console.error('463 Forbidden: invalid surname');
					this.isSurnameInvalid = true;
					return;
				case 464:
					console.error('464 Forbidden: username already exists');
					this.isUsernameAlreadyTanken = true;
					return;
			}

			if (!response.ok) {
				const errorMessage = `Error: ${response.statusText}`;
				console.error(errorMessage);
				return;
			}

			this.isUsernameAlreadyTanken = false;
			this.isUsernameInvalid = false;
			this.isNameInvalid = false;
			this.isSurnameInvalid = false;
			this.isPasswordInvalid = false;
			this.isDifferentPassword = false;

			const res = await response.json();
			console.log(res);
		},
	},

	computed: {
		isDisabled: function () {
			const isDisabled =
				this.username === '' ||
				this.name === '' ||
				this.surname === '' ||
				this.password === '' ||
				this.passwordRepeat === '';

			return isDisabled;
		},
	},
};

export default SignUp;
