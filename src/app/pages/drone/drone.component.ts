import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '@service/business.service';

@Component({
  selector: 'app-drone',
  templateUrl: './drone.component.html',
  styleUrls: ['./drone.component.scss']
})
export class DroneComponent {
  vehicleForm:FormGroup;
  customer:number=1;
  vehicleStation:number=1;
  deposit:number=1;
  showCoordinates:boolean=false;
  request:any;
  constructor(private formBuilder: FormBuilder,
    public bsLogicService:BusinessService){
    this.vehicleForm = this.formBuilder.group({
      deposit: [0, [Validators.required]],
      vehicle_station: [0, [Validators.required]],
      customer: [0, [Validators.required]],
      loading_capacity_vehicle: [null, [Validators.required]],
      flight_range: [null, [Validators.required]],
      loading_capacity_drone: [null, [Validators.required]],
      coordinates: this.formBuilder.array([])
    })
    this.vehicleForm.valueChanges.subscribe(data => {
      this.vehicleStation = data.vehicle_station ? data.vehicle_station.split(',').length : 1;
      this.customer = data.customer ? data.customer.split(',').length : 1;
    });
  }

  get coordinatesArray(){
    return this.vehicleForm.get('coordinates') as FormArray;
  }

  addCoordinates(){
    const coords = (this.vehicleForm.controls['coordinates'] as FormArray);
    coords.push(this.formBuilder.group({
      x: '',
      y: '',
    }));
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }


  validateCoordinates(){
    this.clearFormArray(this.coordinatesArray)
    let rows= this.vehicleStation + this.customer;
    for (let i = 0; i < rows; i++) {
        this.addCoordinates()
    }
    this.showCoordinates = true;
  }

  onSubmit(){
    let deposit= this.vehicleForm.controls['deposit'].value.toString().split(',');
    let vehicle_station= this.vehicleForm.controls['vehicle_station'].value.toString().split(',');
    let customer= this.vehicleForm.controls['customer'].value.toString().split(',');
    this.vehicleForm.patchValue({
      deposit: deposit,
      vehicle_station: vehicle_station,
      customer: customer,
    })
    console.log(JSON.stringify(this.vehicleForm.value));
    this.request = [0,1,5,7,1,4,6,2,3,2,0]
  }
}
