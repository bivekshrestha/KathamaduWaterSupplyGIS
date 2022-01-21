import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'
import NotFound from "../views/NotFound";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            requiresAuth: false,
            title: 'Home | KVWS'
        }
    },
    // {
    //     path: '/test',
    //     name: 'test',
    //     component: () => import(/* webpackChunkName: "dataset" */ '../views/Test'),
    //     meta: {
    //         requiresAuth: false,
    //         title: 'Test | KVWS'
    //     }
    // },
    // {
    //     path: '/tiff',
    //     name: 'tiff',
    //     component: () => import(/* webpackChunkName: "dataset" */ '../views/TiffTest'),
    //     meta: {
    //         requiresAuth: false,
    //         title: 'Tiff | KVWS'
    //     }
    // },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "dataset" */ '../views/Login'),
        meta: {
            requiresAuth: false,
            title: 'Login | KVWS'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "dataset" */ '../views/Register'),
        meta: {
            requiresAuth: false,
            title: 'Register | KVWS'
        }
    },
    {
        path: '/password-reset/request',
        name: 'password-reset-request',
        component: () => import(/* webpackChunkName: "dataset" */ '../views/password_reset/PasswordResetRequest'),
        meta: {
            requiresAuth: false,
            title: 'Password Reset | KVWS'
        }
    },
    {
        path: '/password-reset',
        name: 'password-reset',
        component: () => import(/* webpackChunkName: "dataset" */ '../views/password_reset/PasswordReset'),
        meta: {
            requiresAuth: false,
            title: 'Password Reset | KVWS'
        }
    },
    {
        path: '/dataset',
        name: 'dataset',
        component: () => import(/* webpackChunkName: "dataset" */ '../views/datasets/Dataset'),
        meta: {
            requiresAuth: false,
            title: 'Dataset | KVWS'
        }
    },
    {
        path: '/dataset/:id',
        name: 'dataset-view',
        component: () => import(/* webpackChunkName: "dataset" */ '../views/datasets/ViewDataset'),
        meta: {
            requiresAuth: false,
            title: 'Layer | KVWS'
        }
    },
    {
        path: '/time-series',
        name: 'time-series',
        component: () => import(/* webpackChunkName: "time-series" */ '../views/timeseries/TimeSeries'),
        meta: {
            requiresAuth: false,
            title: 'Time Series | KVWS'
        }
    },
    {
        path: '/variable/add',
        name: 'variable-add',
        component: () => import(/* webpackChunkName: "time-series" */ '../views/variables/AddVariables'),
        meta: {
            requiresAuth: false,
            title: 'Variable | KVWS'
        }
    },
    {
        path: '/file-types/add',
        name: 'file-types-add',
        component: () => import(/* webpackChunkName: "time-series" */ '../views/file_types/AddFileType'),
        meta: {
            requiresAuth: false,
            title: 'File Types | KVWS'
        }
    },
    {
        path: '/location-data',
        name: 'location-data',
        component: () => import(/* webpackChunkName: "location-data" */ '../views/location/LocationData'),
        meta: {
            requiresAuth: false,
            title: 'Location | KVWS'
        }
    },
    {
        path: '/study-reports',
        name: 'study-reports',
        component: () => import(/* webpackChunkName: "study-reports" */ '../views/study_reports/StudyReports'),
        meta: {
            requiresAuth: false,
            title: 'Study Reports | KVWS'
        }
    },
    {
        path: '/study-reports/:id',
        name: 'view-study-report',
        component: () => import(/* webpackChunkName: "study-reports" */ '../views/study_reports/ViewStudyReport'),
        meta: {
            requiresAuth: false,
            title: 'Study Reports | KVWS'
        }
    },
    {
        path: '*',
        name: 'Not Found',
        component: NotFound
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if((to.name === 'register' || to.name === 'login') && store.state.auth.isLoggedIn){
        next({name: 'home'})
    }else if(to.meta.requiresAuth){
        if(!store.state.auth.isLoggedIn){
            next({
                name: 'login'
            });
        } else {
            next();
        }
    }else {
        next();
    }
})

export default router
