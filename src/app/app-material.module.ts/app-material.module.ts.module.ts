import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule
    ],
    exports: [
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule
    ]
})
export class MaterialModule {}