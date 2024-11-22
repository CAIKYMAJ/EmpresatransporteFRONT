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

interface Estado {
  id: number;
  nome: string;
  uf: string;
  icmsLocal: number;
  icmsOutroUf: number;
}

const ListarEstados = () => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // Função para buscar dados da API
  const buscarEstados = () => {
    fetch("http://localhost:8080/estados/listar")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((error) => console.error("Erro ao buscar estados:", error));
  };

  useEffect(() => {
    buscarEstados();
  }, []);

  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisa(e.target.value);
  };

  const estadosFiltrados = estados.filter((estado) =>
    estado.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const excluirEstado = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/estados/deletar/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        buscarEstados(); // Atualiza a lista após exclusão
      } else {
        console.error("Erro ao excluir estado:", response.status);
      }
    } catch (error) {
      console.error("Erro ao excluir estado:", error);
    }
  };

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
            <BreadcrumbLink href="/listarEstado" className="text-lg text-black">
              Lista de Estados
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">Lista de Estados</h1>
      <Separator className="w-full" />

      {/* Pesquisa */}
      <div className="mb-4 mt-4">
        <Input
          name="pesquisa"
          placeholder="Pesquisar Estados"
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
                <TableHead>UF</TableHead>
                <TableHead>ICMS Local (%)</TableHead>
                <TableHead>ICMS Outra UF (%)</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estadosFiltrados.map((estado) => (
                <TableRow key={estado.id} className="hover:bg-gray-200">
                  <TableCell>{estado.nome}</TableCell>
                  <TableCell>{estado.uf}</TableCell>
                  <TableCell>{estado.icmsLocal.toFixed(2)}</TableCell>
                  <TableCell>{estado.icmsOutroUf.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-300"
                      onClick={() => (window.location.href = `/cadastrarEstado?id=${estado.id}`)}
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
                            Deseja realmente excluir este estado?
                          </h2>
                          <p className="text-center text-sm mb-8">
                            Essa ação não poderá ser desfeita.
                          </p>
                          <div className="flex justify-center items-center w-full gap-6">
                            <Button className="bg-gray-300 hover:bg-gray-200">Cancelar</Button>
                            <Button
                              className="bg-red-500 hover:bg-red-300"
                              onClick={() => excluirEstado(estado.id)}
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

export default ListarEstados;
