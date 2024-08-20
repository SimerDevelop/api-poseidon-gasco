import { Injectable } from '@nestjs/common';

@Injectable()
export class RoutEventStructure {

    events = [
        {
            "name": "Cargue sin producto",
            "description": "Este evento sucede cuando se detecta un reabastecimiento sin producto o de masa y volúmen 0",
            "suggestion": "",
            "criticality": 2,
            "code_event": 1
        },
        {
            "name": "Cambio de hora",
            "description": "Este evento sucede cuando algún usuario cambia la hora del equipo PDA",
            "suggestion": "",
            "criticality": 2,
            "code_event": 2
        },
        {
            "name": "Cambio de fecha",
            "description": "Este evento sucede cuando algún usuario  cambia la fecha del equipo PDA",
            "suggestion": "",
            "criticality": 2,
            "code_event": 3
        },
        {
            "name": "Generación de reporte de eventos",
            "description": "Este evento sucede cuando se imprime\nel reporte de eventos",
            "suggestion": "",
            "criticality": 0,
            "code_event": 5
        },
        {
            "name": "Generación de reporte de servicios",
            "description": "Este evento sucede cuando se imprime\nel reporte de servicios",
            "suggestion": "",
            "criticality": 0,
            "code_event": 6
        },
        {
            "name": "Voltaje bajo en la batería",
            "description": "Este evento sucede cuando la batería de respaldo baja más allá del voltaje permitido",
            "suggestion": "",
            "criticality": 1,
            "code_event": 7
        },
        {
            "name": "Falta papel en la impresora",
            "description": "Este evento sucede cuando la impresora no tiene papel",
            "suggestion": "",
            "criticality": 0,
            "code_event": 8
        },
        {
            "name": "Falta impresora",
            "description": "Este evento sucede cuando no se encuentra la impresora",
            "suggestion": "",
            "criticality": 1,
            "code_event": 9
        },
        {
            "name": "Inicio de ruta",
            "description": "Se inicia ruta",
            "suggestion": "",
            "criticality": 0,
            "code_event": 10
        },
        {
            "name": "Fin de ruta",
            "description": "Se finaliza ruta",
            "suggestion": "",
            "criticality": 0,
            "code_event": 11
        },
        {
            "name": "Cancelación de pedido",
            "description": "Este evento sucede cuando se cancela un pedido",
            "suggestion": "",
            "criticality": 1,
            "code_event": 12
        },
        {
            "name": "Batería baja 15%",
            "description": "Este evento sucede cuando la batería de la PDA esta por debajo del 15%",
            "suggestion": "",
            "criticality": 1,
            "code_event": 13
        },
        {
            "name": "Cable de energía desconectado",
            "description": "Este evento sucede cuando el cable de alimentación\nse ha desconectado",
            "suggestion": "",
            "criticality": 1,
            "code_event": 14
        },
        {
            "name": "Cable de energía conectado",
            "description": "Este evento sucede cuando se conecta el cable de\nalimentación",
            "suggestion": "",
            "criticality": 1,
            "code_event": 15
        },
        {
            "name": "Cierre de la aplicación",
            "description": "Este evento sucede cuando un usuario de tipo operario ha cerrado la aplicación",
            "suggestion": "",
            "criticality": 1,
            "code_event": 16
        },
        {
            "name": "Autotanque fuera de ruta",
            "description": "Este evento sucede cuando el operario sale de su ruta establecida",
            "suggestion": "",
            "criticality": 2,
            "code_event": 17
        },
        {
            "name": "Remisión existente",
            "description": "Este evento sucede cuando se intenta generar una remisión con un registro existente",
            "suggestion": "",
            "criticality": 1,
            "code_event": 18
        }
    ];
}

export const route_events = new RoutEventStructure().events;
