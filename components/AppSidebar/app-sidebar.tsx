"use client"

import * as React from "react"
import {
  Building,
  Car,
  Command,
  Frame,
  Globe,
  Home,
  MessageCircle,
  Settings2,
  User,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/AppSidebar/nav-main"
import { NavUser } from "@/components/AppSidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Caiky",
    email: "caiky123@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Início",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Clientes",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Cadastrar Clientes",
          url: "/cadastrarCliente",
        },
        {
          title: "Listar Clientes",
          url: "/listarCliente",
        },
      ],
    },
    {
      title: "Cidade",
      url: "#",
      icon: Building,
      items: [
        {
          title: "Cadastrar Cidade",
          url: "/cadastrarCidade",
        },
        {
          title: "Listar Cidade",
          url: "/listarCidade",
        },
      ],
    },
    {
      title: "Estado",
      url: "#",
      icon: Globe,
      items: [
        {
          title: "Cadastrar Estado",
          url: "/cadastrarEstado",
        },
        {
          title: "Listar Estado",
          url: "/listarEstado",
        },
      ],
    },
    {
      title: "Funcionario",
      url: "#",
      icon: User,
      items: [
        {
          title: "Cadastrar Funcionario",
          url: "/cadastrarFuncionario",
        },
        {
          title: "Listar Funcionario",
          url: "/listarFuncionario",
        },
      ],
    },
    {
      title: "Fretes",
      url: "#",
      icon: Car,
      items: [
        {
          title: "Cadastrar Fretes",
          url: "/cadastrarFretes",
        },
        {
          title: "Listar Fretes",
          url: "/listarFrete",
        },
        {
          title: "Arrecadações",
          url: "/listaArrecadacaoFrete",
        },
        {
          title: "Medias",
          url: "/listarMediaFrete",
        },
        {
          title: "Fretes Cliente",
          url: "/listarPJFrete",
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <img src="/globe.svg" alt="Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Globe</span>
                  <span className="truncate text-xs">Cooperativa</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
