
export interface Child {
  name: string;
  dob: string;
}

export interface Customer {
  id: string;
  fullName: string;
  preferredName: string;
  cpf: string;
  dob: string;
  address: string;
  cep: string;
  phone: string;
  email: string;
  instagram: string;
  children: Child[];
  husbandName: string;
  husbandDob: string;
}

export type CustomerFormData = Omit<Customer, 'id'>;
