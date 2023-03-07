import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '@service/business.service';
import { ConnectionService } from '@service/connection.service';

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
    public bsLogicService:BusinessService,
    private conService:ConnectionService){
    this.vehicleForm = this.formBuilder.group({
      deposit: [0, [Validators.required]],
      vehicle_station: [0, [Validators.required]],
      cost_per_vehicle: [0, [Validators.required]],
      customer: [0, [Validators.required]],
      cost_per_drone: [0, [Validators.required]],
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
    this.vehicleForm.controls['coordinates'].value.map((el:any, idx:number) =>{
      let data = {
        coordinateX: el.x,
        coordinateY: el.y,
        station: (idx+1).toString()
      }
      this.conService.insertCoordinates(data).subscribe({
        next:(el:any)=>{
          console.log(el);
        }
      })
    })
    vehicle_station.map((el:any) =>{
      let data = {
        nameTypeStation: 'Vehicles',
        numStation: el
      }
      console.log('vehicleForm', data);
      this.conService.createStations(data).subscribe({
        next:(el:any)=>{
          console.log(el);
        }
      })
    })
    customer.map((el:any) =>{
      let data = {
        nameTypeStation: 'Client',
        numStation: el
      }
      console.log('customer',data);
      this.conService.createStations(data).subscribe({
        next:(el:any)=>{
          console.log(el);
        }
      })
    })
    this.conService.createStations({nameTypeStation: 'Deposito',numStation:0}).subscribe({
      next:(res:any)=>{}
    })
    this.vehicleForm.controls['coordinates'].value.map((el:any, idx:number) =>{
      let data = {
        coordinateX: el.x,
        coordinateY: el.y,
        station: (idx+1).toString()
      }
      this.conService.insertCoordinates(data).subscribe({
        next:(el:any)=>{
          console.log(el);
        }
      })
    })
    this.conService.createRestrictions({
      nameTypeRestriction: 'Capacidad de carga (Q)',
      valueRestriction: this.vehicleForm.controls['loading_capacity_vehicle'].value
    }).subscribe({next:(res:any)=>{}})
    this.conService.createRestrictions({
      nameTypeRestriction: 'Capacidad de carga (Q)',
      valueRestriction: this.vehicleForm.controls['flight_range'].value
    }).subscribe({next:(res:any)=>{}})
    this.conService.createRestrictions({
      nameTypeRestriction: 'Rango de Vuelo',
      valueRestriction: this.vehicleForm.controls['loading_capacity_drone'].value
    }).subscribe({next:(res:any)=>{}})
    this.request = [0,1,5,7,1,4,6,2,3,2,0]
  }
}
