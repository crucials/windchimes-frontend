import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home-page.vue'
import SearchPage from '@/pages/search-page.vue'
import AuthCallbackPage from '@/pages/auth-callback.vue'
import NotFoundPage from '@/pages/not-found-page.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomePage,
        },

        {
            path: '/search',
            component: SearchPage,
        },

        {
            path: '/auth-callback',
            component: AuthCallbackPage,
        },

        {
            path: '/:pathMatch(.*)*',
            component: NotFoundPage,
        },
    ],
})

export default router