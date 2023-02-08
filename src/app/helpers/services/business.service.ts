import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor() { }

  public checkNumber(event:any) {
    return event.charCode >= 48 && event.charCode < 58;
  }

  public onPasteCheckNumber(event:any) {
    let retVal = /^\d+$/.test(event.clipboardData.getData('text'));
    /* if (!retVal) this.message.showMessage({
      title: 'Solo números',
      text: 'Solo puede pegar números en este espacio',
    }); */
    return retVal;
  }

}
