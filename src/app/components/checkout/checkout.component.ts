import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup: FormGroup | undefined;
  totalPrice: number = 0;
  totalQunatity: number = 0;


  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  // the method name here can be anything
  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkOutFormGroup?.get('customer')?.value)
    console.log(this.checkOutFormGroup?.get('shippingAddress')?.value)
  }

  copyShippingAddressToBillingAddress(event: Event) {
    // @ts-ignore
    if (event.target.checked) {
      console.log("I am in checked!!!")
      this.checkOutFormGroup?.controls['billingAddress']
        .setValue(this.checkOutFormGroup?.controls['shippingAddress'].value);
    } else {
      this.checkOutFormGroup?.controls['billingAddress'].reset();
    }
  }
}
