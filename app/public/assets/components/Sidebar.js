import { apiSignOut } from '../js/serverInteractions.js';

const Sidebar = {
	template: `
    <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
      <div
        class="offcanvas-md offcanvas-end bg-body-tertiary"
        tabindex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div class="offcanvas-header bg-body">
          <div class="d-flex align-items-center">
            <span class="material-symbols-outlined text-primary me-2 ">
              temp_preferences_eco
            </span>
            <h5 class="offcanvas-title" id="sidebarMenuLabel">
              Money Leaves
            </h5>
          </div>
          
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-label="Close"
          ></button>
        </div>
        
        <div class="offcanvas-body d-md-flex flex-column p-0 overflow-y-auto">
          <div class="navbar-brand me-0 px-3 fs-6 text-white d-flex align-items-center d-none d-md-block">
            <span class="material-symbols-outlined text-primary me-2">
              temp_preferences_eco
            </span>
            Money Leaves
          </div>

          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link 
                to="/" 
                class="nav-link d-flex align-items-center gap-2" 
                :class="{'active': this.active_page === 'dashboard'}" 
                aria-current="page" 
                @click.native="closeOffcanvas">
                <svg class="bi"><use xlink:href="#house-fill" /></svg>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                to="/users" 
                class="nav-link d-flex align-items-center gap-2" 
                :class="{'active': this.active_page === 'users'}" 
                aria-current="page" 
                @click.native="closeOffcanvas">
                <svg class="bi"><use xlink:href="#people" /></svg>
                Users
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                to="/create" 
                class="nav-link d-flex align-items-center gap-2" 
                :class="{'active': this.active_page === 'new-expense'}" 
                aria-current="page" 
                @click.native="closeOffcanvas">
                <svg class="bi"><use xlink:href="#cart" /></svg>
                New Expense
              </router-link>
            </li>
          </ul>

          <hr class="my-3" />

          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" @click.prevent="signOut" href="#">
                <svg class="bi"><use xlink:href="#door-closed" /></svg>
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,

	props: {
		active_page: {
			type: String,
			required: true,
		},
	},

	methods: {
		async signOut() {
			const res = await apiSignOut(this.$router);

			if (res) {
				console.log('Logged out user.');
			}
		},

		// New method to close offcanvas
		closeOffcanvas() {
			const offcanvasElement = document.getElementById('sidebarMenu');
			const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
			if (offcanvasInstance) {
				offcanvasInstance.hide();
			}
		},
	},

	watch: {
		// Watch for route changes to close offcanvas
		$route() {
			this.closeOffcanvas();
		},
	},
};

export default Sidebar;
