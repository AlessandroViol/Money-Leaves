const SignIn = {
	template: `
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
          <input type='text' class='form-control' id='floatingInput' placeholder='' v-model='username' :class="{'is-invalid': isInvalid}" required/>
          <label for='floatingInput'>Username</label>
        </div>
        <div class='form-floating mb-4'>
          <input type='password' class='form-control' id='floatingPassword' placeholder='' v-model='password' :class="{'is-invalid': isInvalid}" required/>
          <label for='floatingPassword'>Password</label>
        <div v-if="isInvalid" class="invalid-feedback">Wrong username or password.</div>
        </div>
        <button class='btn btn-primary w-100 py-2' type='submit' @click.prevent='submit' :disabled="isDisabled">
          Sign in
        </button>
      </form>
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

			console.log('Logging in\nUsername:', username);
			console.log('Password:', password);

			const response = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.status === 403) {
				// Handle 403 Forbidden response
				console.error('403 Forbidden: Invalid credentials');
				this.isInvalid = true;
				return;
			}

			if (!response.ok) {
				// Handle other non-successful responses
				const errorMessage = `Error: ${response.statusText}`;
				console.error(errorMessage);
				alert(errorMessage);
				return;
			}

			isInvalid = false;
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

	style: `
    html,
    body {
      height: 100%;
    }
      
    .form-signin {
      max-width: 330px;
      padding: 1rem;
    }

    .form-signin .form-floating:focus-within {
      z-index: 2;
    }

    .form-signin input[type="text"] {
      margin-bottom: -1px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    .form-signin input[type="password"] {
      margin-bottom: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .bd-placeholder-img {
      font-size: 1.125rem;
      text-anchor: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    @media (min-width: 768px) {
      .bd-placeholder-img-lg {
        font-size: 3.5rem;
      }
    }
  `,
};

export default SignIn;
