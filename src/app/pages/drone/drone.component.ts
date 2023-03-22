import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '@service/business.service';
import { ConnectionService } from '@service/connection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drone',
  templateUrl: './drone.component.html',
  styleUrls: ['./drone.component.scss']
})
export class DroneComponent {
  vehicleForm:FormGroup;
  customer:any;
  vehicleStation:any;
  vehicleStationNumber:number=1;;
  customerNumber:number=1;;
  deposit:number=1;
  showCoordinates:boolean=false;
  request:any[]=[];
  isLoading:boolean=false;
  //ENTREGAS DE CLIENTES
  customerDelivery:any[]=[];
  //RECOGIDAS DE CLIENTES
  customerColletion:any[]=[];
  constructor(private formBuilder: FormBuilder,
    public bsLogicService:BusinessService,
    private conService:ConnectionService){
    this.vehicleForm = this.formBuilder.group({
      deposit: [0, [Validators.required]],
      vehicle_station: [null, [Validators.required]],
      cost_per_vehicle: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      cost_per_drone: [null, [Validators.required]],
      loading_capacity_vehicle: [null, [Validators.required]],
      flight_range: [null, [Validators.required]],
      loading_capacity_drone: [null, [Validators.required]],
      coordinates: this.formBuilder.array([])
    })
    // 1. Delete Processes
    this.conService.deleteProcesses();
    this.vehicleForm.valueChanges.subscribe(data => {
      this.customer = data.customer.toString().split(',')
      this.vehicleStation = data.vehicle_station.toString().split(',')
      this.vehicleStationNumber = data.vehicle_station ? this.vehicleStation.length : 1;
      this.customerNumber = data.customer ? this.customer.length : 1;
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
    while (formArray.length !== 0) formArray.removeAt(0)
  }

  validateCoordinates(){
    this.vehicleForm.patchValue({coordinates:[]})
    this.clearFormArray(this.coordinatesArray)
    let rows= this.vehicleStationNumber + this.customerNumber;
    for (let i = 0; i <= rows; i++) this.addCoordinates()
    this.customerDelivery = []
    this.customerColletion = []
    this.request = []
    this.showCoordinates = true;
  }

  onSubmit(){
    // 1. Delete Processes
    this.conService.deleteProcesses();
    this.isLoading = true;
    let deposit= '0';
    let vehicle_station= this.vehicleStation
    let customer= this.customer
    this.vehicleForm.patchValue({
      deposit: deposit,
      vehicle_station: vehicle_station,
      customer: customer,
    })
    let arrayStation = []
    // 2. Create Station
    arrayStation.push({nameTypeStation: 'Deposito',numStation:'0'})
    vehicle_station.map((el:any) =>{
      let data = { nameTypeStation: 'Vehicles', numStation: el }
      arrayStation.push(data)
    })
    customer.map((el:any) =>{
      let data = { nameTypeStation: 'Client', numStation: el }
      arrayStation.push(data)
    })
    arrayStation.map(el =>{
      this.conService.createStations(el).subscribe({
        next:(res:any)=>{
          console.log(res);
        }
      })
    })
    console.log(arrayStation)
    // 3. CreateRestrictions
    this.conService.createRestrictions({
      nameTypeRestriction: 'Capacidad de carga (Q)',
      valueRestriction: this.vehicleForm.controls['loading_capacity_vehicle'].value
    }).subscribe({next:(res:any)=>{}})
    this.conService.createRestrictions({
      nameTypeRestriction: 'Capacidad de carga (Q)',
      valueRestriction: this.vehicleForm.controls['loading_capacity_drone'].value
    }).subscribe({next:(res:any)=>{}})
    this.conService.createRestrictions({
      nameTypeRestriction: 'Rango de Vuelo',
      valueRestriction: this.vehicleForm.controls['flight_range'].value
    }).subscribe({next:(res:any)=>{}})
    // 4. Insert coordinates
    this.vehicleForm.controls['coordinates'].value.map((el:any, idx:number) =>{
      let data = {
        coordinateX: el.x,
        coordinateY: el.y,
        station: (idx).toString()
      }
      this.conService.insertCoordinates(data).subscribe({
        next:(el:any)=>{
          console.log(el);
        }
      })
    })
    // 5.Calculate Distances
    this.conService.calculateDistances().subscribe({next:(res:any)=>{console.log(res);
    }});
    // 6. Save Closer Station
    this.conService.saveCloserStation().subscribe({next:(res:any)=>{console.log(res);
    }});
    // 7. Save Closer Saving
    this.conService.saveCloserSavings().subscribe({next:(res:any)=>{console.log(res);
    }});
    // 8. Create Customer Delivery
    this.conService.createCustomerDelivery().subscribe({
      next:(res:any)=>{ if (res) this.customerDelivery = res }
    });
    // 9. Customer Collection
    this.conService.customerColletion().subscribe({
      next:(res:any)=> {if (res) this.customerColletion = res}
    });
    // 10. Create Resumen
    this.conService.createResume().subscribe({next:(res:any)=>{console.log(res);
    }});
    // 11. Create Partial Way
    this.conService.createPartialWay().subscribe({next:(res:any)=>{console.log(res);
    }});
    // 12. Create Final Way
    this.conService.createFinalWay().subscribe(
      {
        next:(res:any)=>{
          if (res) {
            this.isLoading = false;
            Swal.fire({
              title: '¡Perfecto!',
              text: "Ruta calculada ",
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#28a745',
              confirmButtonText: 'Ver ruta'
            }).then((result) => {
              if (result.value){
                res.map((el:any)=> this.request.push(el.idStation))
              }
            })
          }
        },
        error:(err)=>{
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: "No fue posible generar una ruta " ,
            icon: 'error',
          })
        }
      }
    );
    this.vehicleForm.reset();
  }
}
