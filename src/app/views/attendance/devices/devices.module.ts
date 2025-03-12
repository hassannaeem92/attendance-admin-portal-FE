import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    QRCodeModule
  ]
})
export class DevicesModule { }
