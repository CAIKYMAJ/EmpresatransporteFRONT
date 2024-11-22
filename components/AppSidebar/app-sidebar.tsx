"use client"

import * as React from "react"
import {
  Car,
  Command,
  Frame,
  Home,
  MessageCircle,
  Settings2,
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
      icon: Users,
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
      icon: Users,
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
      icon: Users,
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
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Minha Conta",
          url: "#",
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
                  <img src="/logo.svg" alt="Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">WaiZap</span>
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
