<template>
  <div class="mainnav">
    <!-- Topbar -->
    <div class="navcolor navbar-top d-lg-block small">
      <div class="container">
        <div class="d-md-flex justify-content-between align-items-center ">
          <!-- Top bar left -->
          <div class="toplogo ">
            <router-link class="d-flex align-items-center" :to="{name: 'home'}">
              <img src="@/assets/img/logo.png" alt="KVWS">
              <p>Kathmandu Valley Water Supply Management Board</p>
            </router-link>
          </div>
          <!-- Top bar right -->
          <div class="d-flex align-items-center">
            <!--            <div class="input-group">-->
            <!--              <input-->
            <!--                  type="text"-->
            <!--                  class="form-control border-0"-->
            <!--                  placeholder="Search now"-->
            <!--                  aria-label="search"-->
            <!--                  aria-describedby="search"-->
            <!--              >-->
            <!--              <div class="input-group-prepend">-->
            <!--                <span class="input-group-text" id="search"><i class="fas fa-search"></i></span>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
        <!-- Divider -->
      </div>
    </div>

    <!-- Navigation-->
    <nav class="navbar navbar-expand-lg navbar-light shadow-sm" id="mainNav">
      <div class="container">
        <!-- <a class="navbar-brand fw-bold" href="#page-top">Start Bootstrap</a> -->
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          Menu
          <i class="bi-list"></i>
        </button>
        <div
            class="collapse navbar-collapse mynav"
            id="navbarResponsive"
        >
          <ul class="navbar-nav m-auto my-3 my-lg-0">
            <li class="nav-item">
              <router-link
                  class="nav-link me-lg-3"
                  :to="{name: 'home'}"
              >
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  class="nav-link me-lg-3"
                  :to="{name: 'dataset'}"
              >
                Dataset
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  class="nav-link me-lg-3"
                  :to="{name: 'time-series'}"
              >
                Time Series
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  class="nav-link me-lg-3"
                  :to="{name: 'location-data'}"
              >
                Location Data
              </router-link>
            </li>
            <!--            <li class="nav-item">-->
            <!--              <router-link-->
            <!--                  class="nav-link me-lg-3"-->
            <!--                  :to="{name: 'charts'}"-->
            <!--              >-->
            <!--                Charts-->
            <!--              </router-link>-->
            <!--            </li>-->
            <li class="nav-item">
              <router-link
                  class="nav-link me-lg-3"
                  :to="{name: 'study-reports'}"
              >
                Study & Reports
              </router-link>
            </li>
            <!-- <li class="nav-item"><a class="nav-link me-lg-3" href="upload.html">Uploads</a></li> -->
          </ul>

          <div class="udername">
            <router-link
                :to="{name: 'login'}"
                class="text-capitalize text-dark"
                v-if="!$store.state.auth.isLoggedIn"
            >
              Login
            </router-link>
            <template v-else>
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                 aria-expanded="false">
                <img
                    v-if="$store.state.auth.photo"
                    :src="$store.state.auth.photo"
                    class="img-fluid img-xs rounded-circle text-capitalize"
                    alt="Profile Photo"
                >
                <img
                    v-else
                    src="@/assets/img/profile.png"
                    class="img-fluid img-xs rounded-circle mb-0"
                    alt="Profile Photo"
                >
                {{ $store.state.auth.username }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <router-link
                      class="dropdown-item"
                      :to="{name: 'dataset'}"
                  >
                    Dataset
                  </router-link>
                </li>
                <li>
                  <router-link
                      class="dropdown-item"
                      :to="{name: 'study-reports'}"
                  >
                    Study & Reports
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li>
                  <a href="#" @click.prevent="logout" class="dropdown-item">
                    Logout
                  </a>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "TheNavigation",
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout');
    }
  }
}
</script>

<style scoped>
.router-link-exact-active {
  color: var(--secondary-color) !important;
}

.dropdown-menu[data-bs-popper] {
  top: 100%;
  left: unset;
  right: 0;
  margin-top: 0.125rem;
}
</style>