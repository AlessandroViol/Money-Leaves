const Topbar = {
	template: `
    <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow d-md-none" data-bs-theme="dark">
      <div class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white d-flex align-items-center">
        <span class="material-symbols-outlined text-primary me-2">
          temp_preferences_eco
        </span>
        Money Leaves
      </div>

      <ul class="navbar-nav flex-row d-md-none">
        <li class="nav-item text-nowrap">
          <button
            class="nav-link px-3 text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <svg class="bi"><use xlink:href="#list" /></svg>
          </button>
        </li>
      </ul>
    </header>
  `,
};

export default Topbar;
