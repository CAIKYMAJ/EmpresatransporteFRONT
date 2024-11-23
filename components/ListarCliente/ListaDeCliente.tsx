"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pen, Trash2, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  tipo: "Pessoa Física" | "Pessoa Jurídica";
}

const ListarCliente = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [tipo, setTipo] = useState<"pf" | "pj">("pf");

  // Função para buscar dados da API
  const buscarClientes = () => {
    const endpoint =
      tipo === "pf"
        ? "http://localhost:8080/clientes/listar/pessoa-fisica"
        : "http://localhost:8080/clientes/listar/pessoa-juridica";

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClientes(
            data.map((cliente) => ({
              id: cliente.id,
              nome: cliente.nome || cliente.razaoSocial,
              cpfCnpj: cliente.cpf || cliente.cnpj,
              endereco: cliente.endereco,
              telefone: cliente.telefone,
              tipo: tipo === "pf" ? "Pessoa Física" : "Pessoa Jurídica",
            }))
          );
        } else {
          console.error("Formato de dados inesperado: ", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar clientes:", error));
  };

  useEffect(() => {
    buscarClientes();
  }, [tipo]);

  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisa(e.target.value);
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="p-5 w-full h-screen flex flex-col">
      {/* Cabeçalho */}
      <div className="w-full bg-gray-200 text-lg p-2 rounded-lg text-black">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/" className="text-lg text-black">
              Início
            </BreadcrumbLink>
            <h1>|</h1>
            <BreadcrumbLink href="/listarCliente" className="text-lg text-black">
              Lista de Clientes
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">Lista de Clientes</h1>
      <Separator className="w-full" />

      {/* Pesquisa e Seleção */}
      <div className="mb-4 mt-4 flex gap-4">
        <Input
          name="nome"
          placeholder="Pesquisa"
          className="w-96"
          value={pesquisa}
          onChange={handlePesquisaChange}
        />
        <Select onValueChange={(value) => setTipo(value as "pf" | "pj")} value={tipo}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Tipo de Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pf">Pessoa Física</SelectItem>
            <SelectItem value="pj">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome / Razão Social</TableHead>
                <TableHead>CPF / CNPJ</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Deletar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-gray-200">
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpfCnpj}</TableCell>
                  <TableCell>{cliente.endereco}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.tipo}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-300"
                      onClick={() => (window.location.href = `/cadastrarCliente?id=${cliente.id}`)}
                    >
                      <Pen />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-300">
                          <Trash2 />
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <div className="flex flex-col items-center p-4">
                          <TriangleAlert className="text-red-500 w-16 h-16 mb-4" />
                          <h2 className="text-center text-lg mb-1">
                            Realmente deseja excluir este cliente?
                          </h2>
                          <p className="text-center text-sm mb-8">
                            Essa ação não pode ser desfeita.
                          </p>
                          <div className="flex justify-center items-center w-full gap-6">
                            <Button className="bg-gray-300 hover:bg-gray-200">Cancelar</Button>
                            <Button
                              className="bg-red-500 hover:bg-red-300"
                              onClick={() => {
                                fetch(
                                  tipo === "pf"
                                    ? `/clientes/deletar/${cliente.id}`
                                    : `/clientes/deletar/${cliente.id}`,
                                  { method: "DELETE" }
                                )
                                  .then((res) => {
                                    if (res.ok) {
                                      buscarClientes();
                                      alert("Cliente excluído com sucesso!") 
                                    }
                                  })
                                  .catch((err) => console.error("Cliente está sendo utilizado!", err));
                              }}
                            >
                              Confirmar
                            </Button>
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
  );
};

export default ListarCliente;
