"use client"

import React from "react"
import { proyecto } from "../data/proyecto"
import ProjectList, { type Project } from "./ProjectList"

const WebProjectsList: React.FC = () => {
    const projects: Project[] = proyecto.map(item => ({
        id: item.nombre.toLowerCase().replace(/\s+/g, '-'),
        name: item.nombre,
        icon: item.icono,
        speed: item.velocidad,
        link: item.link
    }))

    return <ProjectList projects={projects} />
}

export default WebProjectsList


