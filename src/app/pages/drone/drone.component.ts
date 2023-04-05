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
  vehicleForm: FormGroup;
  customer: any;
  vehicleStation: any;
  vehicleStationNumber: number = 1;;
  customerNumber: number = 1;;
  deposit: number = 1;
  showCoordinates: boolean = false;
  request: any[] = [];
  isLoading: boolean = false;
  rangos:any[]=[]
  colors:any[]=[
    {rango:0, color:'#f33e0d'},
    {rango:3, color:'#06cb03'},
    {rango:6, color:'#036acb'},
  ];
  //ENTREGAS DE CLIENTES
  customerDelivery: any[] = [];
  //RECOGIDAS DE CLIENTES
  customerColletion: any[] = [];
  alternatePath: any[] = Array(1).fill([]);
  isLoadingCard:boolean=false
  constructor(private formBuilder: FormBuilder,
    public bsLogicService: BusinessService,
    private conService: ConnectionService) {
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

  get coordinatesArray() {
    return this.vehicleForm.get('coordinates') as FormArray;
  }

  addCoordinates() {
    const coords = (this.vehicleForm.controls['coordinates'] as FormArray);
    coords.push(this.formBuilder.group({
      x: '',
      y: '',
    }));
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) formArray.removeAt(0)
  }

  validateCoordinates() {
    this.isLoadingCard = false
    this.vehicleForm.patchValue({ coordinates: [] })
    this.clearFormArray(this.coordinatesArray)
    let rows = this.vehicleStationNumber + this.customerNumber;
    for (let i = 0; i <= rows; i++) this.addCoordinates()
    this.customerDelivery = []
    this.customerColletion = []
    this.request = []
    this.alternatePath = []
    this.showCoordinates = true;
  }

  onSubmit() {
    this.request = []
    // 1. Delete Processes
    this.conService.deleteProcesses();
    this.isLoading = true;
    let deposit = '0';
    let vehicle_station = this.vehicleStation
    let customer = this.customer
    this.vehicleForm.patchValue({
      deposit: deposit,
      /* vehicle_station: vehicle_station,
      customer: customer, */
    })
    // 2. Create Station
    let arrayStation = []
    arrayStation.push({ nameTypeStation: 'Deposito', numStation: '0' })
    this.vehicleStation.map((el: any) => {
      let data = { nameTypeStation: 'Vehicles', numStation: el }
      arrayStation.push(data)
    })
    this.customer.map((el: any) => {
      let data = { nameTypeStation: 'Client', numStation: el }
      arrayStation.push(data)
    })
    arrayStation.map(el => {
      this.conService.createStations(el).subscribe({
        next: (res: any) => {
          console.log(res);
        }
      })
    })
    console.log(arrayStation)
    // 3. CreateRestrictions
    this.conService.createRestrictions({
      nameTypeRestriction: 'Capacidad de carga (Q)',
      valueRestriction: this.vehicleForm.controls['loading_capacity_vehicle'].value
    }).subscribe({ next: (res: any) => { } })
    this.conService.createRestrictions({
      nameTypeRestriction: 'Capacidad de carga (Q)',
      valueRestriction: this.vehicleForm.controls['loading_capacity_drone'].value
    }).subscribe({ next: (res: any) => { } })
    this.conService.createRestrictions({
      nameTypeRestriction: 'Rango de Vuelo',
      valueRestriction: this.vehicleForm.controls['flight_range'].value
    }).subscribe({ next: (res: any) => { } })
    // 4. Insert coordinates
    this.vehicleForm.controls['coordinates'].value.map((el: any, idx: number) => {
      let data = {
        coordinateX: el.x,
        coordinateY: el.y,
        station: (idx).toString()
      }
      this.conService.insertCoordinates(data).subscribe({
        next: (el: any) => {
          console.log(el);
        }
      })
    })
    setTimeout(() => {
      // 5.Calculate Distances
      //this.conService.calculateDistances({stringStation: this.vehicleForm.controls['deposit'].value}).subscribe({next:(res:any)=>{console.log(res);}});
      this.conService.calculateDistances({ stringStation: this.vehicleForm.controls['vehicle_station'].value })
      .subscribe({
        next: (res: any) => { console.log(res); },
        complete:()=>{
          // 6. Save Closer Station
          this.conService.saveCloserStation().subscribe({
            next: (res: any) => {console.log(res);},
            complete:()=>{
              // 7. Save Closer Saving
              this.conService.saveCloserSavings().subscribe({
                next: (res: any) => {console.log(res);},
                complete:()=>{
                  // 8. Create Customer Delivery
                  this.conService.createCustomerDelivery().subscribe({
                    next: (res: any) => { if (res) this.customerDelivery = res },
                    complete:()=>{
                      // 9. Customer Collection
                      this.conService.customerColletion().subscribe({
                        next: (res: any) => { if (res) this.customerColletion = res },
                        complete: ()=>{
                          // 10. Create Resumen
                          this.conService.createResume().subscribe({
                            next: (res: any) => {console.log(res);},
                            complete:()=>{
                              // 11. Create Partial Way
                              this.conService.createPartialWay().subscribe({
                                next: (res: any) => {console.log(res);},
                                complete:()=>{
                                  // 12. Create Final Way
                                  this.conService.createFinalWay().subscribe(
                                    {
                                      next: (res: any) => {
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
                                            if (result.value) {
                                              res.map((el: any) => this.request.push(el.idStation.trim()))
                                              this.isLoadingCard = true
                                            }
                                          })
                                        }
                                      },
                                      complete:()=>{
                                        this.conService.generadoRand().subscribe({
                                          next:(response)=>{
                                            let data:any[] = [];
                                            response.map((el: any) => data.push(el.numWay.trim()))
                                            let listNumWayList = new Set(data);
                                            let result = [...listNumWayList];
                                            let listItems:any[] = []
                                            result.map((element:any, idx:number)=>{
                                              listItems = []
                                              response.map((el:any)=>{
                                                if (element.toString() === el.numWay.toString()) {
                                                  listItems.push(el.idStation.trim())
                                                  console.log(listItems);
                                                }
                                              })
                                              this.alternatePath.push(listItems.filter(Boolean))
                                              console.log(this.alternatePath);
                                              //this.alternatePath[idx] = this.alternatePath[idx]
                                            })
                                          },
                                        })
                                      },
                                      error: (err) => {
                                        this.isLoading = false;
                                        Swal.fire({
                                          title: 'Error',
                                          text: "No fue posible generar una ruta ",
                                          icon: 'error',
                                        })
                                      }
                                    }
                                  );
                                }
                              });
                            }
                          });
                        }
                    });
                    }
                });
                }
            });
            }
          });
        }
      });
    }, 1000);
  }

  getColor(variable:any, rangos:any, colores:any) {
    for (let i = 0; i < rangos.length; i++) {
      if (variable < rangos[i]) {
        const rangoAnterior = rangos[i-1];
        const rangoActual = rangos[i];
        const colorAnterior = colores[i-1].color;
        const colorActual = colores[i].color;
        const fraccion = (variable - rangoAnterior) / (rangoActual - rangoAnterior);
        return this.blendColors(colorAnterior, colorActual, fraccion);
      }
    }
    // Si la variable es mayor o igual al último rango, devolvemos el último color
    return colores[colores.length-1].color;
  }

  blendColors(color1:any, color2:any, ratio:any) {
    const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const [, r1, g1, b1] = hexRegex.exec(color1);
    const [, r2, g2, b2] = hexRegex.exec(color2);
    const r = Math.round(parseInt(r1, 16) * (1 - ratio) + parseInt(r2, 16) * ratio);
    const g = Math.round(parseInt(g1, 16) * (1 - ratio) + parseInt(g2, 16) * ratio);
    const b = Math.round(parseInt(b1, 16) * (1 - ratio) + parseInt(b2, 16) * ratio);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Ejemplo de uso
  /* const rangos = [0, 5, 10, 15];
  const colores = [  {rango:0, color:'#009A00'},  {rango:5, color:'#FFBA30'},  {rango:10, color:'#744D00'},  {rango:15, color:'#999999'}];
  
  const valores = [1, 2, 3, 4, 11, 12, 13, 14];
  
  for (const valor of valores) {
    console.log(getColor(valor, rangos, colores));
  } */

}
