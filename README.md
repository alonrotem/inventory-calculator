# InventoryCalculator

===========================================================
----------------GENERATION----------------
ng new inventory-calculator
npm install --save bootstrap

ng generate component home


## User flows

### First admin creation
 * If there is admin in the system, the first opening navigates to the sign-up form.
 * User receives an email to verify their address
 * User is sent to the login screen

## User has no account
 * User clicks "Request account" on the login screen and fills their details
 * Administrators receive a notification for a new request
 * Administrator clicks review request, sets a role and potential customers, approves/denies
 * User receives a notification that their account was approved + code
 * They go to fill their missing profile details: username and password, photo
 * User can login

## Administrator invites a new user
 * Filling in details
 * Invitation email is sent to the user
 * They go to fill their missing profile details: username and password, photo
 * User can login

## Account disabled/deleted

NEXT TODOS:
=== USER MANAGEMENT ===
❎ Profile page
  ❎ picture + crop
  ❎ Names
  ❎ Email change
  ❎ Change password
  ❎ Logins info
  ❎ Connected customers, if available
  ⏹️ Email notification on logins
  ⏹️ MFA -> Email assisted
  ❎ Role
  ⏹️ Delete my account
❎ Add login geolocation and browser info, first signed in and last seen

    https://medium.com/@sehban.alam/how-to-integrate-google-maps-in-angular-latest-2025-guide-88c1e665bdb0 -> AIzaSyAzw9gP8zrxK4eqE-Mkm77gXFBllL9K4D0

❎ Add option to cancel login, or all logins per user
❎ Add user is_disabled
⏹️ Invite new users
    ⏹️ Set role
    ⏹️ Names, email
⏹️ List users
❎ See user info
    ❎ Profile info
    ❎ Connected customer(s)
    ❎ Active logins
    ❎ Enable/disable
    ❎ Set role
❎ Reset password
    ❎ Limited time code
❎ Request account
❎ See pending account requests
⏹️ Manually create a user and send for email verification
===/USER MANAGEMENT ===

❎ Customer entity
	- name
	- business name
	- email
	- phone
	- tax identifier
	Bank
	- Raw material name + pieces / kgs
❎ Raw material not managing babies. Customer instead.
❎ Add raw material bank from customer screen: for existing raw material, or new.
❎ Save customer syncs banks and babies
⏹️ Wing width reflects in diagram
⏹️ UX: Discard changes popup: 3rd option to save and then navigate
Babies
⏹️ Babies UX: Save and add new button in new dialog
⏹️ Babies UX: prev/next button in edit dialog
❎ Babies UX: [Enter] closes the dialog

⏹️ Error handling client/server
⏹️ Server exceptions on improper data
⏹️ LOW MATERIAL ALERTS
⏹️ Quantity graphs

❎ Action buttons moved to top on all screens
❎ 🪶 Show either units or kg in main raw table     
❎ 🪶 Show total # of babies in main raw table - lighter query     
❎ 🪶 Opening baby dialog: focus and select-all first field. Clear validation message.     
❎ 🪶 Lock/animation buttons while saving/deleting/loading     
❎ 🪶 New/edit material: focus on first field     
❎ 🐞 Bug: remove the x from the curency selector (and don't allow saving sum without currency)     
❎ 🐞 Bug: length of baby is stored as int     
❎ 🐞 Bug: baby length not selected when dropdown     
❎ 🪶 Sort babies by length desc    
❎ 🪶 Babies table      
❎ 🐞 Bug: New babies don't get aggregated if their length matches (make sure client & server)     
            check this.babyEditorDialog.confirm.subscribe((baby:Baby) => { on babies table component
❎ 🐞 Bug: Opening a baby record doesn't select the baby    
❎ 🪶 Wings      
❎ 🪶 Hats      

Extra features:
⏹️ 🪶 Open item screens in view mode first
⏹️ 🪶 Apply button, to save but not navigate?
⏹️ 🪶 Make tables sortable, filterable     
⏹️ 🪶 Manage suppliers     
⏹️ 🪶 Cache countries and currencies     
❎ 🪶 Hamburger menu animation     
⏹️ 🐞 CSS loading too late     
⏹️ 🪶 CSS not loading immediately. Maybe add loading page animation     
❌ 🪶 Load babies with the raw material, no need for another request <- not possible     

📚 Pending stories:
- Authentication
- Notifications
- Dashboard


===========================================================
SETTINGS

-- Alerts --

Raw material totals:
    Alert when raw material total kg quantity below ___ kg
    Alert when raw material total unit quantity below ___ unit

Raw material item:
    Alert when raw material item quantity below ___ %
    or
    Alert when raw material item kg quantity below ___ kg
    Alert when raw material item unit quantity below ___ unit

    Mark raw material item yellow if quantity below __ %
    Mark raw material item red if quantity below __ %

Raw material in customer banks:
    Alert when raw material in customer bank quantity below ___ %
    or
    Alert when raw material kg in customer bank below ___ kg
    Alert when raw material units in customer bank below ___ unit

    Mark raw material in customer bank yellow if quantity below __ %
    Mark raw material in customer bank red if quantity below __ %

-- Notifications --
    Notify in app
        Sound
    Notify by email

-- Backup --
    Download backup
        [with clean up]
    Upload backup
        [cleanup]


===========================================================

BACKUP:
mysqldump  -P 3306 -h 127.0.0.1 -u root -p12345678 inventory --opt --skip-dump-date | sed 's$VALUES ($VALUES\n($g' | sed 's$),($),\n($g' > /home/alon/Projects/inventory-calculator/server/SQL/data_exports/data_backup.sql; chmod 666 /home/alon/Projects/inventory-calculator/server/SQL/data_exports/data_backup.sql; git pull; git add .; git commit -m"DB data backup"; git push


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
