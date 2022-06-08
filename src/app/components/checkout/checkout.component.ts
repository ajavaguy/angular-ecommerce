import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {Luv2ShopFormService} from "../../services/luv2-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup: FormGroup | undefined;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) {
  }

  ngOnInit(): void {
    // javascript's date object -> months start from 0.
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        lastName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        email: new FormControl('',
          [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
        ),
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        state: new FormControl('', [Validators.required]),
        zipcode: new FormControl('',
          [Validators.required,
            Validators.minLength(6),
            Luv2ShopValidators.notOnlyWhiteSpace]
        )
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        state: new FormControl('', [Validators.required]),
        zipcode: new FormControl('',
          [Validators.required,
            Validators.minLength(6),
            Luv2ShopValidators.notOnlyWhiteSpace]
        )
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        cardNumber: new FormControl('',
          [Validators.pattern("[0-9]{16}"),
            Validators.required]
        ),
        securityCode: new FormControl('',
          [Validators.required,
            Validators.pattern("[0-9]{3}")]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  // the method name here can be anything
  onSubmit() {
    console.log("Handling the submit button");
    if (this.checkOutFormGroup?.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
    }
    console.log(`CheckOutFormGroup is valid: ${this.checkOutFormGroup?.valid}`)

  }

  copyShippingAddressToBillingAddress(event: Event) {
    // @ts-ignore
    if (event.target.checked) {
      console.log("I am in checked!!!")
      this.checkOutFormGroup?.controls['billingAddress']
        .setValue(this.checkOutFormGroup?.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFormGroup?.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup?.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number = 1;
    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth)
      .subscribe(data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      })
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup?.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService.getStates(countryCode)
      .subscribe(
        data => {
          if (formGroupName == 'shippingAddress') {
            this.shippingAddressStates = data;
          } else {
            this.billingAddressStates = data;
          }

          // select first item by default
          formGroup?.get('state')?.setValue(data[0]);
        }
      );


  }

  get firstName() {
    return this.checkOutFormGroup?.get('customer.firstName');
  }

  get lastName() {
    return this.checkOutFormGroup?.get('customer.lastName');
  }

  get email() {
    return this.checkOutFormGroup?.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkOutFormGroup?.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkOutFormGroup?.get('shippingAddress.city');
  }

  get shippingAddressZipcode() {
    return this.checkOutFormGroup?.get('shippingAddress.zipcode');
  }

  get shippingAddressState() {
    return this.checkOutFormGroup?.get('shippingAddress.state');
  }

  get shippingAddressCountry() {
    return this.checkOutFormGroup?.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkOutFormGroup?.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkOutFormGroup?.get('billingAddress.city');
  }

  get billingAddressZipcode() {
    return this.checkOutFormGroup?.get('billingAddress.zipcode');
  }

  get billingAddressState() {
    return this.checkOutFormGroup?.get('billingAddress.state');
  }

  get billingAddressCountry() {
    return this.checkOutFormGroup?.get('billingAddress.country');
  }

  get creditCardType(){
    return this.checkOutFormGroup?.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkOutFormGroup?.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkOutFormGroup?.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkOutFormGroup?.get('creditCard.securityCode');
  }

}
