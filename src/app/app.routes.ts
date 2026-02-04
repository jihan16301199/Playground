import { Routes } from '@angular/router';
import { Layout } from './features/layout/layout';
import { Login } from './authentication/login/login';

export const routes: Routes = [

    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Layout
    }
];
