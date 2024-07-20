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
              <router-link to="/" class="nav-link d-flex align-items-center gap-2" :class="{'active': this.active_page === 'dashboard'}" aria-current="page">
                <svg class="bi"><use xlink:href="#house-fill" /></svg>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link d-flex align-items-center gap-2" :class="{'active': this.active_page === 'users'}" aria-current="page">
                <svg class="bi"><use xlink:href="#people" /></svg>
                Users
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/create" class="nav-link d-flex align-items-center gap-2" :class="{'active': this.active_page === 'new-expense'}" aria-current="page">
                <svg class="bi"><use xlink:href="#cart" /></svg>
                New Expense
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#file-earmark" /></svg>
                Orders
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#graph-up" /></svg>
                Reports
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#puzzle" /></svg>
                Integrations
              </a>
            </li>
          </ul>

          <h6
            class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase"
          >
            <span>Saved reports</span>
            <a class="link-secondary" href="#" aria-label="Add a new report">
              <svg class="bi"><use xlink:href="#plus-circle" /></svg>
            </a>
          </h6>
          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
                Current month
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
                Last quarter
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
                Social engagement
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
                Year-end sale
              </a>
            </li>
          </ul>

          <hr class="my-3" />

          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="#gear-wide-connected" /></svg>
                Settings
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" @click="goToSignin" href="#">
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
		goToSignin() {
			this.$router.push({ path: '/signin' });
		},
	},
};

export default Sidebar;
