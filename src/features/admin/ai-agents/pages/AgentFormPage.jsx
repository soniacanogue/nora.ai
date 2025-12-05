// src/features/admin/ai-agents/AgentFormPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAgent, useCreateAgent, useUpdateAgent } from "../hooks/useAgents";
import { AgentForm } from "../components/AgentForm";

export function AgentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: agentData, isLoading: isLoadingAgent } = useAgent(id);
  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();

  const handleSubmit = (formData) => {
    // The JSON parsing is now handled by Zod's .transform() in the schema
    const payload = formData;

    if (isEditMode) {
      updateAgentMutation.mutate(
        { id, ...payload },
        {
          onSuccess: () => navigate("/admin/agents"),
        }
      );
    } else {
      createAgentMutation.mutate(payload, {
        onSuccess: () => navigate("/admin/agents"),
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/agents");
  };

  if (isEditMode && isLoadingAgent) {
    return <div>Cargando datos del agente...</div>; // TODO: Usar Skeleton
  }

  const isSubmitting =
    createAgentMutation.isLoading || updateAgentMutation.isLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dt-foreground mb-6">
        {isEditMode
          ? `Editando: ${agentData?.nombre}`
          : "Crear Nuevo Agente de IA"}
      </h1>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8 shadow-glow">
        <AgentForm
          initialData={isEditMode ? agentData : undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
