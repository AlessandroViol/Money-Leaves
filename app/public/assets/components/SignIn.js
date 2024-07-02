const SignIn = {
	template: `
    <div class="form-auth m-auto py-4 ">
      <form class='needs-validation' novalidate>
        <img
          class='mb-4 d-block mx-auto'
          src='./assets/imgs/logo.svg'
          alt='logo'
          width='150'
          height='150'
          style='border-radius: 100%'
        />
				
        <h1 class='h3 mb-3 fw-normal'>Please sign in</h1>

        <div class='form-floating'>
          <input type='text' class='form-control first' id='floatingInput' placeholder='' v-model='username' :class="{'is-invalid': isInvalid}" required/>
          <label for='floatingInput'>Username</label>
        </div>

        <div class='form-floating'>
          <input type='password' class='form-control last' id='floatingPassword' placeholder='' v-model='password' :class="{'is-invalid': isInvalid}" required/>
          <label for='floatingPassword'>Password</label>
          <div v-if="isInvalid" class="invalid-feedback">Wrong username or password.</div>
        </div>

        <p class="text-start my-3">
					You don't have an account? 
          <router-link to="/signup" class="link-primary link-opacity-75-hover link-underline-opacity-0" style="font-weight: bold;">Sign Up!</router-link>
        </p>

        <button class='mb-4 btn btn-primary w-100 py-2' type='submit' @click.prevent='submit' :disabled="isDisabled">
          Sign In
        </button>
      </form>
    </div>
		
  `,

	data: function () {
		return {
			username: '',
			password: '',
			isInvalid: false,
		};
	},

	methods: {
		async submit() {
			const username = this.username;
			const password = this.password;

			const response = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ _id: username, password }),
			});

			if (response.status === 403) {
				console.error('403 Forbidden: Invalid credentials');
				this.isInvalid = true;
				return;
			}

			if (!response.ok) {
				const errorMessage = `Error: ${response.statusText}`;
				console.error(errorMessage);
				alert(errorMessage);
				return;
			}

			if (response.ok) {
				this.$router.push({ path: '/' });
			}

			this.isInvalid = false;
			const res = await response.json();
			console.log(res);
		},
	},

	computed: {
		isDisabled: function () {
			const isDisabled = this.username === '' || this.password === '';
			return isDisabled;
		},
	},
};

export default SignIn;
