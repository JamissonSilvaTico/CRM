// Conteúdo anterior (Child, Customer, CustomerFormData, SessionType, Scheduling, SchedulingFormData)...

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
  observacao?: string;
}

export type SchedulingFormData = Omit<Scheduling, "id">;

// NOVOS TIPOS PARA PÓS-PRODUÇÃO
export enum TaskServiceType {
  ACOMPANHAMENTO_BEBES = "Acompanhamento de bebes",
  ACOMPANHAMENTO_GESTANTE = "Acompanhamento de Gestante",
  EVENTOS = "Eventos",
  PARTO = "Parto",
  NEWBORN = "Newborn",
  ENSAIO_FAMILIA = "Ensaio Familia",
  PERFIL_PROFISSIONAL = "Perfil Profissional",
  SMASH_THE_CAKE = "Smash the cake",
  SELEBRATION = "Selebration",
}

export type TaskStatus = "Não iniciado" | "Em andamento" | "Finalizado";

export interface Task {
  id: string;
  cliente: string;
  filho: string;
  servico: TaskServiceType;
  dataEnsaio: string; // ISO String format
  dataEntrega: string; // ISO String format
  status: TaskStatus;
  armazenadoHD?: string;
  minFotos?: number;
}

export type TaskFormData = Omit<Task, "id">;
