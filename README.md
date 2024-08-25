# InventoryCalculator

===========================================================
----------------GENERATION----------------
ng new inventory-calculator
npm install --save bootstrap

ng generate component home

NEXT TODOS:     
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
⏹️ 🪶 Wings      
⏹️ 🪶 Hats      

Extra features:    
⏹️ 🪶 Make tables sortable, filterable     
⏹️ 🪶 Manage suppliers     
⏹️ 🪶 Cache countries and currencies     
⏹️ 🪶 Hamburger menu animation     
⏹️ 🐞 CSS loading too late     
⏹️ 🪶 CSS not loading immediately. Maybe add loading page animation     
❌ 🪶 Load babies with the raw material, no need for another request <- not possible     

📚 Pending stories:
- Authentication
- Notifications
- Dashboard

✅ NEXT TODOS:
+ https://jsfiddle.net/alrotem/oqpkce0f/
+ Save material - toaster message on saved successfully, then allow to add babies
+ Add validation to material form
+ Add delete button
+ Add load either weight or units, also for empty item
+ Save procedure to save either weight or units, not both
+ Spread materials editor buttons + add icons
+ Babies

===========================================================













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
