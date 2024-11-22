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

interface Funcionario {
  id: number;
  nome: string;
  numeroRegistro: string;
}

const ListarFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // Busca dados da API
  const buscarFuncionarios = () => {
    fetch("http://localhost:8080/funcionarios/listar")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFuncionarios(data);
        } else {
          console.error("Formato de dados inesperado: ", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar funcionários:", error));
  };

  useEffect(() => {
    buscarFuncionarios();
  }, []);

  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisa(e.target.value);
  };

  const funcionariosFiltrados = funcionarios.filter((funcionario) =>
    funcionario.nome.toLowerCase().includes(pesquisa.toLowerCase())
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
            <BreadcrumbLink href="/listarFuncionarios" className="text-lg text-black">
              Lista de Funcionários
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">Lista de Funcionários</h1>
      <Separator className="w-full" />

      {/* Pesquisa */}
      <div className="mb-4 mt-4">
        <Input
          name="pesquisa"
          placeholder="Pesquisar Funcionários"
          className="w-96"
          value={pesquisa}
          onChange={handlePesquisaChange}
        />
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Número de Registro</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Deletar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionariosFiltrados.map((funcionario) => (
                <TableRow key={funcionario.id} className="hover:bg-gray-200">
                  <TableCell>{funcionario.nome}</TableCell>
                  <TableCell>{funcionario.numeroRegistro}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-300"
                      onClick={() =>
                        (window.location.href = `/cadastroFuncionario?id=${funcionario.id}`)
                      }
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
                            Realmente deseja excluir este funcionário?
                          </h2>
                          <p className="text-center text-sm mb-8">
                            Essa ação não pode ser desfeita.
                          </p>
                          <div className="flex justify-center items-center w-full gap-6">
                            <Button className="bg-gray-300 hover:bg-gray-200">
                              Cancelar
                            </Button>
                            <Button
                              className="bg-red-500 hover:bg-red-300"
                              onClick={() => {
                                fetch(
                                  `http://localhost:8080/funcionarios/excluir/${funcionario.id}`,
                                  { method: "DELETE" }
                                )
                                  .then((res) => {
                                    if (res.ok) buscarFuncionarios();
                                  })
                                  .catch((err) =>
                                    console.error("Erro ao excluir funcionário:", err)
                                  );
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

export default ListarFuncionarios;
