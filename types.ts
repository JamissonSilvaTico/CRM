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

export type CustomerFormData = Omit<Customer, "id">;

export enum SessionType {
  ACOMPANHAMENTO_INFANTIL = "Acompanhamento Infantil",
  ACOMPANHAMENTO_GESTANTE = "Acompanhamento Gestante",
  ENSAIO_INFANTIL = "Ensaio Infantil",
  ENSAIO_GESTANTE = "Ensaio de Gestante",
  ENSAIO_FAMILIA = "Ensaio de Família",
  PERFIL_PROFISSIONAL = "Perfil Profissional",
  PARTO = "Parto",
  EVENTOS = "Eventos",
  NEWBORN = "Newborn",
  SMASH_THE_CAKE = "Smash the Cake",
  SESSAO_ESPECIAL = "Sessão Especial",
}

export interface Scheduling {
  id: string;
  customerId?: string;
  customerName: string;
  sessionType: SessionType;
  date: string; // ISO String format
}

export type SchedulingFormData = Omit<Scheduling, "id">;
