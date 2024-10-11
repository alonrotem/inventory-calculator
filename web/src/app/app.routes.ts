import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RawMaterialsTableComponent } from './components/raw-material/raw-materials-table/raw-materials-table.component';
import { RawMaterialEditorComponent } from './components/raw-material/raw-material-editor/raw-material-editor.component';
import { BabiesTableComponent } from './components/babies/babies-table/babies-table.component';
import { PagenotfoundComponent } from './components/common/pagenotfound/pagenotfound.component';
import { WingsTableComponent } from './components/wings/wings-table/wings-table.component';
import { WingsEditorComponent } from './components/wings/wings-editor/wings-editor.component';
import { HatsTableComponent } from './components/hats/hats-table/hats-table.component';
import { HatsEditorComponent } from './components/hats/hats-editor/hats-editor.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes-guard';
import { CustomersTableComponent } from './components/customers/customers-table/customers-table.component';
import { CustomerEditorComponent } from './components/customers/customer-editor/customer-editor.component';

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
        component: RawMaterialEditorComponent,
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'inventory/babies',
        component: BabiesTableComponent
    },
    {
        path: 'templates/wings',
        component: WingsTableComponent
    },
    {
        path: 'templates/wings/editor',
        component: WingsEditorComponent,
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'templates/hats',
        component: HatsTableComponent
    },
    {
        path: 'templates/hats/editor',
        component: HatsEditorComponent,
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'inventory/customers',
        component: CustomersTableComponent
    },
    {
        path: 'inventory/customer/editor',
        component: CustomerEditorComponent,
        canDeactivate: [UnsavedChangesGuard]
    },
    { 
        path: '**', pathMatch: 'full',  
        component: PagenotfoundComponent 
    }
];
