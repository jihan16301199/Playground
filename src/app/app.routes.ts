import { Routes } from '@angular/router';
import { Login } from './authentication/login/login';
import { Test } from './test/test/test';
import { Layout } from './features/layout/layout';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'test',
        component: Test
    },
    {
        path: '',
        component: Layout
    }
];
