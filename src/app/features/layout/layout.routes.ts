import { Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Template } from '../pages/template/template';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'template',
        component: Template
    }
];
