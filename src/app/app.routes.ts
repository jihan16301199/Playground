import { Routes } from '@angular/router';
import { Login } from './authentication/login/login';
import { Landing } from './features/landing/landing';
import { Test } from './test/test/test';
import { Button } from './test/button/button';
import { TimeDurationPage } from './test/time-duration/time-duration';
import { Color } from './color/color';
import { Layout } from './features/layout/layout';
import { routes as layoutRoutes } from './features/layout/layout.routes';

export const routes: Routes = [
    {
        path: 'landing',
        component: Landing
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'test',
        component: Test
    },
    {
        path: 'button',
        component: Button
    },
    {
        path: 'time-duration',
        component: TimeDurationPage
    },
    {
        path: 'color',
        component: Color
    },
    {
        path: '',
        component: Layout,
        children: layoutRoutes
    }
];
