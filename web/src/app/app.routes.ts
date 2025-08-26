import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RawMaterialsTableComponent } from './components/raw-material/raw-materials-table/raw-materials-table.component';
import { RawMaterialEditorComponent } from './components/raw-material/raw-material-editor/raw-material-editor.component';
import { PagenotfoundComponent } from './components/common/pagenotfound/pagenotfound.component';
import { WingsTableComponent } from './components/wings/wings-table/wings-table.component';
import { WingsEditorComponent } from './components/wings/wings-editor/wings-editor.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes-guard';
import { CustomersTableComponent } from './components/customers/customers-table/customers-table.component';
import { CustomerEditorComponent } from './components/customers/customer-editor/customer-editor.component';
import { SettingsAlertsComponent } from './components/settings/settings-alerts/settings-alerts.component';
import { BackupDownloadComponent } from './components/backup/backup-download/backup-download.component';
import { SettingsNotificationsComponent } from './components/settings/settings-notifications/settings-notifications.component';
import { SettingsMainComponent } from './components/settings/settings-main/settings-main.component';
import { SingleHatCalculatorComponent } from './components/customers/single-hat-calculator/single-hat-calculator.component';
import { OrdersTableComponent } from './components/customers/orders-table/orders-table.component';
import { OrderEditorComponent } from './components/customers/order-editor/order-editor.component';
import { SignInComponent } from './components/users/signin/signin.component';

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
        path: 'templates/wings',
        component: WingsTableComponent
    },
    {
        path: 'templates/wings/editor',
        component: WingsEditorComponent,
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
        path: 'inventory/customer/hat-calculator',
        component: SingleHatCalculatorComponent
    },
    {
        path: 'inventory/customer/orders',
        component: OrdersTableComponent
    },
    {
        path: 'inventory/customer/order/editor',
        component: OrderEditorComponent,
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings/alerts',
        component: SettingsAlertsComponent,
        //canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings/backup',
        component: BackupDownloadComponent,
        //canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings',
        component: SettingsMainComponent,
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'signin',
        component: SignInComponent,
    },    
    { 
        path: '**', pathMatch: 'full',  
        component: PagenotfoundComponent 
    }
];
