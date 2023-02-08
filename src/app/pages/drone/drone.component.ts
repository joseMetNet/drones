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
    const coords = this.vehicleForm.controls['coordinates'] as FormArray;
    coords.push(this.formBuilder.group({
      x: '',
      y: '',
    }));
    //this.coordinatesArray.push(this.formBuilder.control([0,0],[Validators.required]));
  }

  validateCoordinates(){
    let rows= this.vehicleStation + this.customer;
    let cols=2;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.addCoordinates()
      }
    }
  }

  onSubmit(){
    /* this.vehicleForm.patchValue({
      vehicle_station: this.vehicleForm.controls['vehicle_station'].value.split(','),
      customer: this.vehicleForm.controls['customer'].value.split(','),
    }); */
    console.log(this.vehicleForm.value);
    
  }
}
