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

interface Frete {
  id: number;
  numeroConhecimento: string;
  quemPaga: string;
  peso: number;
  valor: number;
  dataFrete: string;
  origem: { nome: string };
  destino: { nome: string };
  remetente: { nome: string };
  destinatario: { nome: string };
}

const ListarFrete = () => {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // Busca lista de fretes
  useEffect(() => {
    fetch("http://localhost:8080/fretes/listar")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFretes(data);
        } else {
          console.error("Formato inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar fretes:", err));
  }, []);

  // Função para filtrar fretes pelo número de conhecimento
  const fretesFiltrados = fretes.filter((frete) =>
    frete.numeroConhecimento.toLowerCase().includes(pesquisa.toLowerCase())
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
            <BreadcrumbLink href="/listarFrete" className="text-lg text-black">
              Lista de Fretes
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">Lista de Fretes</h1>
      <Separator className="w-full" />

      {/* Pesquisa */}
      <div className="mb-4 mt-4">
        <Input
          name="numeroConhecimento"
          placeholder="Pesquisar pelo número do conhecimento"
          className="w-96"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número Conhecimento</TableHead>
                <TableHead>Quem Paga</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Remetente</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Frete</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Deletar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fretesFiltrados.map((frete) => (
                <TableRow key={frete.id} className="hover:bg-gray-200">
                  <TableCell>{frete.numeroConhecimento}</TableCell>
                  <TableCell>{frete.quemPaga}</TableCell>
                  <TableCell>{frete.origem.nome}</TableCell>
                  <TableCell>{frete.destino.nome}</TableCell>
                  <TableCell>{frete.remetente.nome}</TableCell>
                  <TableCell>{frete.destinatario.nome}</TableCell>
                  <TableCell>{frete.peso} kg</TableCell>
                  <TableCell>R$ {frete.valor.toFixed(2)}</TableCell>
                  <TableCell>{new Date(frete.dataFrete).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-300"
                      onClick={() =>
                        (window.location.href = `/cadastrarFretes?id=${frete.id}`)
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
                            Realmente deseja excluir este frete?
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
                                fetch(`http://localhost:8080/fretes/deletar/${frete.id}`, {
                                  method: "DELETE",
                                })
                                  .then((res) => {
                                    if (res.ok) {
                                      setFretes((prev) =>
                                        prev.filter((item) => item.id !== frete.id)
                                      );
                                      alert("Frete excluído com sucesso!")
                                    } else {
                                      alert("Frete está sendo utilizado!");
                                    }
                                  })
                                  .catch((err) =>
                                    alert("Erro na requisição:")
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

export default ListarFrete;
