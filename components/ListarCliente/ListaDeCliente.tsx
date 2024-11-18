"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import React, { useEffect, useState } from 'react'
import { Separator } from "../ui/separator"
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Pen, PlusSquare, Trash2, TriangleAlert } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

interface Cliente {
    id: number;
    nome: string;
    cpf: string;
    endereco: string;
    telefone: string;
}

const ListarCliente = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [pesquisa, setPesquisa] = useState("");

    // Função para buscar dados da API
    useEffect(() => {
        fetch("http://localhost:8080/clientes/listar")
            .then((response) => response.json())
            .then((data) => {
                if(Array.isArray(data)) {
                    setClientes(data);
                } else {
                    console.error("Formato de dados inesperado: ", data);
                }
            })
            .catch((error) => console.error("Erro ao buscar Clientes", error));
    }, []);
    const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPesquisa(e.target.value);
    };

    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

  return (
    <div className="p-1 w-full h-screen flex flex-col">
        {/* Caixa cinza de 'Catálogo' */}
        <div className='w-full bg-gray-200 text-lg p-2 rounded-lg text-black'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbLink href="/" className='text-lg text-black'>Início</BreadcrumbLink>
                    <h1>|</h1>
                    <BreadcrumbLink href="/listarCliente" className='text-lg text-black'>Lista de Clientes</BreadcrumbLink>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
        <h1 className='text-3xl mb-2 mt-3 flex items-center gap-5'>Lista de Clientes</h1>
        <Separator className="w-full"/>

        {/* Pesquisa */}
        <div className="mb-4 mt-4">
            <Input 
                name='nome' 
                placeholder='Pesquisa' 
                className='w-96'
                value={pesquisa}
                onChange={handlePesquisaChange}
            />
        </div>

        {/* Tabela */}
        <div className='flex-grow overflow-auto'>
            <div className='border rounded-lg p-2 w-full'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome / Razão Social</TableHead>
                            <TableHead>CPF / CNPJ</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Inscrição Estadual</TableHead>
                            <TableHead>Data Inscrição</TableHead>
                            <TableHead>Endereço</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Editar</TableHead>
                            <TableHead>Deletar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientesFiltrados.map((cliente) => (
                            <TableRow key={cliente.id} className='hover:bg-gray-200'>
                                <TableCell>{cliente.nome}</TableCell>
                                <TableCell>{cliente.cpf}</TableCell>
                                <TableCell>{cliente.endereco}</TableCell>
                                <TableCell>{cliente.telefone}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className='bg-blue-500 hover:bg-blue-300'>
                                                <a href="/editarcategoria">
                                                    <Pen />
                                                </a>
                                            </Button>
                                        </DialogTrigger>
                                    </Dialog>
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className='bg-red-500 hover:bg-red-300'>
                                                <Trash2 />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <div className='flex flex-col items-center p-4'> 
                                                <TriangleAlert className='text-red-500 w-16 h-16 mb-4'/>
                                                <h2 className='text-center text-lg mb-1'>Realmente deseja excluir essa categoria?</h2>
                                                <p className='text-center text-sm mb-8'>Todos os produtos dentro dessa categoria, irão ficar sem a Categoria!</p>
                                                <div className='flex justify-center items-center w-full gap-6'>
                                                    <Button className='bg-red-500 hover:bg-red-200'>Cancelar</Button>
                                                    <Button className='bg-blue-500 hover:bg-blue-200'>OK</Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>  
    </div>
  )
}

export default ListarCliente
