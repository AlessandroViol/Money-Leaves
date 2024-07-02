const ErrorLandingScreen = {
	template: `
    <div class=" m-auto py-4 ">
        <div class="d-flex flex-column px-5">
          <h1 class='h1 mb-3 fw-bolder'><span class="text-danger">Error</span>, something went wrong</h1>
          <h2>{{ $route.params.description }}</h2>
        </div>
    </div>
		
  `,
  data() {
		return {};
	},
};

export default ErrorLandingScreen;
