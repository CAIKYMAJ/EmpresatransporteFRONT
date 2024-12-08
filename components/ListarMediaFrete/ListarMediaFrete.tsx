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
import { Button } from "../ui/button";

interface MediaFretes {
  estado: string;
  cidade: string;
  mediaOrigem: number;
  mediaDestino: number;
}

interface Estado {
  id: number;
  nome: string;
  uf: string;
}

const ListarMediaFrete = () => {
  const [mediasFretes, setMediasFretes] = useState<MediaFretes[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");

  // Busca a lista de estados
  useEffect(() => {
    fetch("http://localhost:8080/estados/listar")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar estados:", err));
  }, []);

  // Busca médias de frete da API
  const buscarMediasFretes = () => {
    if (!estadoSelecionado) {
      alert("Por favor, selecione um estado.");
      return;
    }

    fetch(`http://localhost:8080/fretes/media/estado/${estadoSelecionado}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMediasFretes(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar médias de frete:", err));
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
            <BreadcrumbLink
              href="/listarMediaFretes"
              className="text-lg text-black"
            >
              Lista de Médias de Fretes
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">
        Lista de Médias de Fretes
      </h1>
      <Separator className="w-full" />

      {/* Filtros */}
      <div className="flex gap-4 mb-4 mt-4">
        <select
          className="w-48 p-2 border rounded"
          value={estadoSelecionado}
          onChange={(e) => setEstadoSelecionado(e.target.value)}
        >
          <option value="">Selecione um estado</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nome} ({estado.uf})
            </option>
          ))}
        </select>
        <Button onClick={buscarMediasFretes} className="bg-blue-500">
          Buscar
        </Button>
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Média de Origem</TableHead>
                <TableHead>Média de Destino</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediasFretes.map((media, index) => (
                <TableRow key={index} className="hover:bg-gray-200">
                  <TableCell>{media.estado}</TableCell>
                  <TableCell>{media.cidade}</TableCell>
                  <TableCell>R$ {media.mediaOrigem.toFixed(2)}</TableCell>
                  <TableCell>R$ {media.mediaDestino.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {mediasFretes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ListarMediaFrete;
