export class Employee {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    nationalityList: string[];
    email: string;
    password: string;
    addressList: Address[];
    phoneList: Phone[];
    webPageList: string[];
    instantMessengerList: InstantMessenger[];
}

export class Address {
    addressType: string;
    street1: string;
    street2?: string;
    zip: string;
    city: string;
    country: string;
}

export class Phone {
    type: string;
    ddd: number;
    number: number;
}

export class InstantMessenger {
    instantMessenger: string;
    username: string;
}
