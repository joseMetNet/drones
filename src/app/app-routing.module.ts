import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { LayoutComponent } from '@pages/layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children:[
      //{ path: "", pathMatch: "full", redirectTo: "index" },
      { path: "", component: HomeComponent},
      { path: "**", redirectTo: "" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
