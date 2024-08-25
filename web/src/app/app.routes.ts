import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RawMaterialsTableComponent } from './components/raw-material/raw-materials-table/raw-materials-table.component';
import { RawMaterialEditorComponent } from './components/raw-material/raw-material-editor/raw-material-editor.component';
import { BabiesTableComponent } from './components/babies/babies-table/babies-table.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'inventory/raw',
        component: RawMaterialsTableComponent
    },
    {
        path: 'inventory/raw/editor',
        component: RawMaterialEditorComponent
    },
    {
        path: 'inventory/babies',
        component: BabiesTableComponent
    }
];
