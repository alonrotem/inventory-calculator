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
import { SignupComponent } from './components/users/signup/signup.component';
import { VerifyComponent } from './components/users/verify/verify.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/users/profile/profile.component';
import { UsersService } from './services/users.service';
import { SettingsUsersComponent } from './components/settings/settings-users/settings-users.component';
import { VerifyEmailComponent } from './components/users/verify-email/verify-email.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { AccountRequestsListComponent } from './components/users/account-requests-list/account-requests-list.component';
import { AccountRequestDetailsComponent } from './components/users/account-request-details/account-request-details.component';
import { FinalizeAccountComponent } from './components/users/finalize-account/finalize-account.component';
import { ForbiddenComponent } from './components/common/forbidden/forbidden.component';
import { SettingsUserDetailsComponent } from './components/settings/settings-user-details/settings-user-details.component';
import { SettingsUserInvitesComponent } from './components/settings/settings-user-invites/settings-user-invites.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [ authGuard ]
    },
    {
        path: 'inventory/raw',
        component: RawMaterialsTableComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'raw_materials', permission: 'R' }] }
    },
    {
        path: 'inventory/raw/editor',
        component: RawMaterialEditorComponent,
        canDeactivate: [UnsavedChangesGuard],
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'raw_materials', permission: 'R' }] }
    },
    {
        path: 'templates/wings',
        component: WingsTableComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'wings', permission: 'R' }] }
    },
    {
        path: 'templates/wings/editor',
        component: WingsEditorComponent,
        canDeactivate: [UnsavedChangesGuard],
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'wings', permission: 'R' }] }
    },
    {
        path: 'inventory/customers',
        component: CustomersTableComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'customers', permission: 'R' }, { area: 'customer_resources_by_customer_id', permission: 'R' }] }
    },
    {
        path: 'inventory/customer/editor',
        component: CustomerEditorComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'customers', permission: 'R' }, { area: 'customer_resources_by_customer_id', permission: 'R' }] },
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'inventory/customer/hat-calculator',
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'customers', permission: 'R' }, { area: 'customer_resources_by_customer_id', permission: 'R' }] },
        component: SingleHatCalculatorComponent
    },
    {
        path: 'inventory/customer/orders',
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'orders', permission: 'R' }, { area: 'orders_resources_by_customer_id', permission: 'R' }] },
        component: OrdersTableComponent
    },
    {
        path: 'inventory/customer/order/editor',
        component: OrderEditorComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'orders', permission: 'U' }, { area: 'orders_resources_by_customer_id', permission: 'U' }] },
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings/alerts',
        component: SettingsAlertsComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'system_settings', permission: 'R' }] }
        //canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings/backup',
        component: BackupDownloadComponent,
        canActivate: [ authGuard ],
        data: { permissions:  [{ area: 'backup', permission: 'R' }] }
        //canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings/system',
        component: SettingsMainComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{ area: 'system_settings', permission: 'R' }] },
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'users/signin',
        component: SignInComponent,
    },
    {
        path: 'users/signup',
        component: SignupComponent,
    },
    {
        path: 'users/verify',
        component: VerifyComponent,
    },
    {
        path: 'users/verify_email',
        component: VerifyEmailComponent,
    },
        {
        path: 'users/reset_password',
        component: ResetPasswordComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ authGuard ],
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'settings/users',
        component: SettingsUsersComponent,
        canActivate: [ authGuard ],
        data: [{ area: 'user_management', permission: 'R' }]
    },
    {
        path: 'settings/user-details',
        component: SettingsUserDetailsComponent,
        canActivate: [ authGuard ],
        data: [{ area: 'user_management', permission: 'R' }, { area: 'user_management', permission: 'U' }],
        canDeactivate: [UnsavedChangesGuard]
    },    
    {
        path: 'users/account_requests',
        component: AccountRequestsListComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{area: 'user_management', permission: 'R'}] }
    },
    {
        path: 'users/account_request_details',
        component: AccountRequestDetailsComponent,
        canActivate: [ authGuard ],
        data: { permissions: [{area: 'user_management', permission: 'R'}] }
    },
    {
        path: 'users/finalize_account',
        component: FinalizeAccountComponent
    },
    {
        path: 'settings/user_invites',
        component: SettingsUserInvitesComponent,
        canActivate: [ authGuard ],
        data: [{ area: 'user_management', permission: 'C' }]
    },    
    {
        path: 'forbidden',
        component: ForbiddenComponent
    },
    { 
        path: '**', pathMatch: 'full',  
        component: PagenotfoundComponent 
    }
];
