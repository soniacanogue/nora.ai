import React, { useState, useRef, useEffect, useMemo } from "react";
import Modal from "src/shared/components/ui/Modal";
import Button from "src/shared/components/ui/Button";
import { mockUsuarios } from "@/data/mockUsuarios";

const ReassignTicketModal = ({ isOpen, onClose, onConfirm, isReassigning }) => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const agents = useMemo(() => {
    // Filtrar por rol y eliminar duplicados por ID
    const uniqueAgents = [];
    const seenIds = new Set();

    mockUsuarios.forEach((user) => {
      if (user.rol === "AGENTE" && !seenIds.has(user.id)) {
        seenIds.add(user.id);
        uniqueAgents.push(user);
      }
    });

    return uniqueAgents;
  }, []);

  const filteredAgents = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) {
      return agents;
    }
    const lowercasedTerm = searchTerm.toLowerCase().trim();
    return agents.filter((agent) => {
      const nombre = (agent.nombre || "").toLowerCase();
      const correo = (agent.correo || "").toLowerCase();
      return nombre.includes(lowercasedTerm) || correo.includes(lowercasedTerm);
    });
  }, [searchTerm, agents]);

  const selectedAgentName = useMemo(() => {
    if (!selectedAgent) return "";
    const agent = agents.find((a) => a.id === selectedAgent);
    return agent?.nombre || "";
  }, [selectedAgent, agents]);

  // Cerrar dropdown cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setIsOpenDropdown(false);
      setSearchTerm("");
      setSelectedAgent("");
    }
  }, [isOpen]);

  // Manejar clicks fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenDropdown(false);
        // Restaurar el nombre del agente seleccionado en el input si hay uno
        if (selectedAgent) {
          setSearchTerm(selectedAgentName);
        } else {
          setSearchTerm("");
        }
      }
    };

    if (isOpenDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenDropdown, selectedAgent, selectedAgentName]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpenDropdown(true);
    // Si hay un agente seleccionado y el usuario empieza a escribir, limpiar la selección
    if (selectedAgent && value !== selectedAgentName) {
      setSelectedAgent("");
    }
  };

  const handleSelectAgent = (agentId) => {
    setSelectedAgent(agentId);
    const agent = agents.find((a) => a.id === agentId);
    setSearchTerm(agent ? agent.nombre : "");
    setIsOpenDropdown(false);
  };

  const handleInputFocus = () => {
    setIsOpenDropdown(true);
  };

  const handleConfirm = () => {
    if (selectedAgent) {
      onConfirm(selectedAgent);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reasignar Ticket">
      <div className="space-y-4">
        <p className="text-subtle">
          Selecciona un agente de la lista para asignarle este ticket.
        </p>

        <div className="relative" ref={dropdownRef}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Buscar agente por nombre o correo..."
            className="w-full p-3 bg-background border border-secondary rounded-md text-foreground placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={isReassigning}
          />
          {isOpenDropdown && (
            <>
              {filteredAgents.length > 0 ? (
                <div className="absolute z-10 w-full mt-1 bg-background border border-secondary rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => handleSelectAgent(agent.id)}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground transition-colors"
                    >
                      <div className="font-medium">
                        {agent.nombre || "Sin nombre"}
                      </div>
                      <div className="text-sm text-subtle">
                        {agent.correo || "Sin correo"}
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchTerm.trim() ? (
                <div className="absolute z-10 w-full mt-1 bg-background border border-secondary rounded-md shadow-lg">
                  <div className="px-4 py-2 text-subtle">
                    No se encontraron agentes
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            className="w-auto"
            onClick={onClose}
            disabled={isReassigning}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-auto"
            onClick={handleConfirm}
            disabled={!selectedAgent || isReassigning}
          >
            {isReassigning ? "Reasignando..." : "Confirmar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReassignTicketModal;
