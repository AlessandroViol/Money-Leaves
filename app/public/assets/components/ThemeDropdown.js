
const ThemeDropdown = {
	template: `
    <div>
			<div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
				<button
					class="btn btn-primary py-2 dropdown-toggle d-flex align-items-center"
					id="bd-theme"
					type="button"
					aria-expanded="false"
					data-bs-toggle="dropdown"
					aria-label="Toggle theme (auto)"
				>
					<svg class="bi my-1 theme-icon-active" width="1em" height="1em">
						<use :href="currentThemeIcon"></use>
					</svg>
					<span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
				</button>
				<ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
					<li>
						<button
							type="button"
							class="dropdown-item d-flex align-items-center"
							data-bs-theme-value="light"
							aria-pressed="false"
							@click="setTheme('light')"
						>
							<svg class="bi me-2 opacity-50" width="1em" height="1em">
								<use href="#sun-fill"></use>
							</svg>
							Light
							<svg v-if="theme === 'light'" class="bi ms-auto" width="1em" height="1em">
								<use href="#check2"></use>
							</svg>
						</button>
					</li>
					<li>
						<button
							type="button"
							class="dropdown-item d-flex align-items-center"
							data-bs-theme-value="dark"
							aria-pressed="false"
							@click="setTheme('dark')"
						>
							<svg class="bi me-2 opacity-50" width="1em" height="1em">
								<use href="#moon-stars-fill"></use>
							</svg>
							Dark
							<svg v-if="theme === 'dark'" class="bi ms-auto" width="1em" height="1em">
								<use href="#check2"></use>
							</svg>
						</button>
					</li>
					<li>
						<button
							type="button"
							class="dropdown-item d-flex align-items-center active"
							data-bs-theme-value="auto"
							aria-pressed="true"
							@click="setTheme('auto')"
						>
							<svg class="bi me-2 opacity-50" width="1em" height="1em">
								<use href="#circle-half"></use>
							</svg>
							Auto
							<svg v-if="theme === 'auto'" class="bi ms-auto" width="1em" height="1em">
								<use href="#check2"></use>
							</svg>
						</button>
					</li>
				</ul>
			</div>
		</div>
  `,

	data() {
		return {
			theme: this.getPreferredTheme(),
		};
	},

	computed: {
		currentThemeIcon() {
			switch (this.theme) {
				case 'light':
					return '#sun-fill';
				case 'dark':
					return '#moon-stars-fill';
				default:
					return '#circle-half';
			}
		},
	},

	methods: {
		getStoredTheme() {
			return localStorage.getItem('theme');
		},

		setStoredTheme(theme) {
			localStorage.setItem('theme', theme);
		},

		getPreferredTheme() {
			const storedTheme = this.getStoredTheme();
			if (storedTheme) {
				return storedTheme;
			}
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		},

		setTheme(theme) {
			this.theme = theme;
			this.setStoredTheme(theme);
			if (theme === 'auto') {
				document.documentElement.setAttribute(
					'data-bs-theme',
					window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
				);
			} else {
				document.documentElement.setAttribute('data-bs-theme', theme);
			}
			this.showActiveTheme(theme);
		},

		showActiveTheme(theme) {
			const activeThemeIcon = document.querySelector('.theme-icon-active use');
			const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
			const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

			document.querySelectorAll('[data-bs-theme-value]').forEach((element) => {
				element.classList.remove('active');
				element.setAttribute('aria-pressed', 'false');
			});

			btnToActive.classList.add('active');
			btnToActive.setAttribute('aria-pressed', 'true');
			activeThemeIcon.setAttribute('href', svgOfActiveBtn);
		},
	},

	mounted() {
		this.setTheme(this.getPreferredTheme());

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			const storedTheme = this.getStoredTheme();
			if (storedTheme !== 'light' && storedTheme !== 'dark') {
				this.setTheme(this.getPreferredTheme());
			}
		});

		window.addEventListener('DOMContentLoaded', () => {
			this.showActiveTheme(this.getPreferredTheme());

			document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
				toggle.addEventListener('click', () => {
					const theme = toggle.getAttribute('data-bs-theme-value');
					this.setTheme(theme);
				});
			});
		});
	},
};

export default ThemeDropdown;
