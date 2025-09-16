
import React, { useState, useEffect, useMemo } from 'react';
import { getCustomers } from '../services/customerService';
import type { Customer } from '../types';
import Input from '../components/Input';

const CustomerCard: React.FC<{ customer: Customer }> = ({ customer }) => (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all hover:shadow-xl hover:-translate-y-1">
        <h3 className="text-xl font-bold text-blue-700">{customer.preferredName || customer.fullName}</h3>
        {customer.preferredName && <p className="text-sm text-gray-500 mb-2">{customer.fullName}</p>}
        <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p><strong>CPF:</strong> {customer.cpf}</p>
            <p><strong>Telefone:</strong> {customer.phone}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            {customer.instagram && <p><strong>Instagram:</strong> @{customer.instagram}</p>}
            {customer.children.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                    <h4 className="font-semibold">Filhos ({customer.children.length}):</h4>
                    <ul className="list-disc list-inside">
                        {customer.children.map((child, index) => (
                            <li key={index}>{child.name} ({child.dob})</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

const CustomerListPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            const data = await getCustomers();
            setCustomers(data);
            setIsLoading(false);
        };
        fetchCustomers();
    }, []);
    
    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        const lowercasedFilter = searchTerm.toLowerCase();
        return customers.filter(customer =>
            customer.fullName.toLowerCase().includes(lowercasedFilter) ||
            customer.preferredName.toLowerCase().includes(lowercasedFilter) ||
            customer.email.toLowerCase().includes(lowercasedFilter) ||
            customer.cpf.includes(lowercasedFilter)
        );
    }, [customers, searchTerm]);

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Lista de Clientes</h2>
            <div className="mb-6">
                <Input 
                    label="Pesquisar por nome, CPF ou email"
                    id="search"
                    placeholder="Digite para pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-gray-600">Carregando clientes...</p>
                </div>
            ) : filteredCustomers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map(customer => (
                        <CustomerCard key={customer.id} customer={customer} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-md">
                    <p className="text-gray-600">{customers.length === 0 ? "Nenhum cliente cadastrado." : "Nenhum cliente encontrado com os critérios de busca."}</p>
                </div>
            )}
        </div>
    );
};

export default CustomerListPage;
