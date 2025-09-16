import React, { useState, useEffect } from 'react';
import { addCustomer } from '../services/customerService';
import type { Child, CustomerFormData } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

const initialFormData: CustomerFormData = {
  fullName: '',
  preferredName: '',
  cpf: '',
  dob: '',
  address: '',
  cep: '',
  phone: '',
  email: '',
  instagram: '',
  children: [],
  husbandName: '',
  husbandDob: '',
};

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [numChildren, setNumChildren] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setFormData(prev => {
      const newChildren: Child[] = Array(numChildren).fill(null).map((_, index) => 
        prev.children[index] || { name: '', dob: '' }
      );
      return { ...prev, children: newChildren };
    });
  }, [numChildren]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setFormData(prev => ({ ...prev, children: updatedChildren }));
  };
  
  const handleNumChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumChildren(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await addCustomer(formData);
      setSuccessMessage('Cliente cadastrado com sucesso!');
      setFormData(initialFormData);
      setNumChildren(0);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Failed to add customer", error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Ocorreu um erro ao cadastrar o cliente. Tente novamente.');
      } else {
        setErrorMessage('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Cadastro de Cliente</h2>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-6" role="alert">
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline ml-2">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
           <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage('')}>
            <svg className="fill-current h-6 w-6 text-red-500 hover:text-red-700 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Fechar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nome completo" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <Input label="Como prefere ser chamada" id="preferredName" name="preferredName" value={formData.preferredName} onChange={handleChange} />
          <Input label="CPF" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
          <Input label="Data de nascimento da cliente" id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
          <Input label="Endereço com CEP" id="address" name="address" value={formData.address} onChange={handleChange} required />
          <Input label="CEP" id="cep" name="cep" value={formData.cep} onChange={handleChange} required />
          <Input label="Telefone" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          <Input label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Instagram" id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} />
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Familiares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nome do marido" id="husbandName" name="husbandName" value={formData.husbandName} onChange={handleChange} />
            <Input label="Data nascimento marido" id="husbandDob" name="husbandDob" type="date" value={formData.husbandDob} onChange={handleChange} />
            <div>
              <label htmlFor="numChildren" className="block text-sm font-medium text-gray-700 mb-1">Quantos filhos tem?</label>
              <select
                id="numChildren"
                value={numChildren}
                onChange={handleNumChildrenChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        {numChildren > 0 && (
          <div className="space-y-4 border-t pt-6 mt-6">
            <h4 className="text-md font-semibold text-gray-800">Detalhes dos Filhos</h4>
            {formData.children.map((child, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50">
                <Input
                  label={`Nome do filho(a) ${index + 1}`}
                  id={`childName${index}`}
                  value={child.name}
                  onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  label={`Nascimento do filho(a) ${index + 1}`}
                  id={`childDob${index}`}
                  type="date"
                  value={child.dob}
                  onChange={(e) => handleChildChange(index, 'dob', e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <div className="pt-6">
          <Button type="submit" isLoading={isLoading}>
            Cadastrar Cliente
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
