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
import React, { useState } from 'react'
import { Separator } from "../ui/separator"
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Pen, PlusSquare, Trash2, TriangleAlert } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const CadastroCliente = () => {
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        endereco: "",
        telefone: ""
    });

    const formatarCPF = (value: string) => {
        return value
            .replace(/\D/g, '') // Irá remover o que não é número
            .replace(/(\d{3})(\d)/, '$1.$2') // Irá adicionar o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Irá adicionar o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Irá adicionar o traço
            .substring(0,14); // Irá limitar o tamanho do CPF
    };

    const formatarTelefone = (value: string) => {
        return value
            .replace(/\D/g, '') // Irá remover o que não é número
            .replace(/(\d{2})(\d)/, '($1) $2') // Irá adicionar os parênteses no DDD
            .replace(/(\d{4,5})(\d{4})$/, '$1-$2') // Irá adicionar o traço
            .substring(0,15); // Irá limitar o tamanho do telefone
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        const formattedValue = name === 'cpf'
            ? formatarCPF(value) 
            : name === 'telefone'
            ? formatarTelefone(value)
            : value;

        setFormData(prev => ({ ...prev, [name]: formattedValue }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Dados enviados:", formData)

        try {
            const response = await fetch("http://localhost:8080/clientes/criar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            console.log("Status da resposta:", response.status)
            if (response.ok) {
                console.log("Cliente cadastrado com sucesso!")
                setFormData({ nome: "", cpf: "", endereco: "", telefone: ""})
            } else {
                console.error("Erro ao cadastrar cliente!")
            }
        } catch (error) {
            console.error("Erro ao enviar dados: ", error)
        }
    }
  return (
    <div className="p-5 ml-10 w-full">
        {/* Caixa cinza de 'Catálogo' */}
        <div className='w-full bg-gray-200 text-lg p-2 rounded-lg text-black'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbLink href="/" className='text-lg text-black'>Início</BreadcrumbLink>
                    <h1>|</h1>
                    <BreadcrumbLink href="/cadastrarCliente" className='text-lg text-black'>Cadastro de Clientes</BreadcrumbLink>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
        <h1 className='text-3xl mb-2 mt-3 flex items-center gap-5'>Cadastrar Cliente</h1>
        <Separator className="w-full"/>

        <form onSubmit={handleSubmit} className="text-center px-4 mt-10">
            <Select>
                <SelectTrigger className="w-[180px] mb-5">
                    <SelectValue placeholder="PF / PJ" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Pessoa Física</SelectItem>
                    <SelectItem value="dark">Pessoa Jurídica</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex gap-5 mb-10">
                <div>
                    <Label className="text-xs">Nome / Razão Social</Label>
                    <Input name="nome" value={formData.nome} onChange={handleChange}/>
                </div>

                <div>
                    <Label className="text-xs">CPF / CNPJ</Label>
                    <Input name="cpf" value={formData.nome} type="number" onChange={handleChange}/>
                </div>

                <div>
                    <Label className="text-xs">Data Inscrição</Label>
                    <Input name="data" value={formData.nome} type="date" className="text-xs" onChange={handleChange}/>
                </div>

                <div>
                    <Label className="text-xs">Endereço</Label>
                    <Input name="endereco" value={formData.nome} onChange={handleChange}/>
                </div>

                <div>
                    <Label className="text-xs">Telefone</Label>
                    <Input name="telefone" value={formData.nome} type="tel" onChange={handleChange}/>
                </div>

                <div>
                    <Label className="text-xs">Inscrição Estadual</Label>
                    <Input name="inscEstadual" value={formData.nome} type="number" onChange={handleChange}/>
                </div>
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-300">Cadastrar</Button>
        </form>
    </div>
  )
}

export default CadastroCliente
