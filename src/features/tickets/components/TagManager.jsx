// src/features/tickets/components/TagManager.jsx
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTags } from "@/features/admin/tags/hooks";
import { useAddTicketTag, useRemoveTicketTag } from "../hooks/useTicketTags";
import Button from "@/shared/components/ui/Button";
import toast from "react-hot-toast";

/**
 * TagManager - Component for managing tags on a ticket
 * Displays AI-suggested tags + manually added tags
 * Allows adding/removing tags
 */
const TagManager = ({ ticketId, currentTags = [], suggestedTags = [] }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [selectedTagName, setSelectedTagName] = useState("");
  const [customTagName, setCustomTagName] = useState("");

  // Fetch all available tags from the system
  const { data: allTags = [], isLoading: isLoadingTags } = useTags();

  // Mutations for adding/removing tags
  const { mutate: addTag, isPending: isAddingPending } = useAddTicketTag();
  const { mutate: removeTag, isPending: isRemovingPending } = useRemoveTicketTag();

  // Normalize current tags to array of names
  const currentTagNames = useMemo(() => {
    return currentTags.map((tag) => (typeof tag === "string" ? tag : tag.nombre || tag.name));
  }, [currentTags]);

  // Filter available tags that are not already on the ticket
  const availableTags = useMemo(() => {
    return allTags.filter((tag) => !currentTagNames.includes(tag.nombre));
  }, [allTags, currentTagNames]);

  const handleAddTag = () => {
    const tagName = customTagName.trim() || selectedTagName;
    
    if (!tagName) {
      toast.error("Selecciona o escribe una etiqueta");
      return;
    }

    if (currentTagNames.includes(tagName)) {
      toast.error("Esta etiqueta ya está añadida");
      return;
    }

    addTag(
      { ticketId, tagName },
      {
        onSuccess: () => {
          setSelectedTagName("");
          setCustomTagName("");
          setIsAddingTag(false);
        },
      }
    );
  };

  const handleRemoveTag = (tagName) => {
    removeTag({ ticketId, tagName });
  };

  const isPending = isAddingPending || isRemovingPending;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-dt-subtle uppercase tracking-wider">
          Etiquetas
        </label>
        {!isAddingTag && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingTag(true)}
            disabled={isPending}
            className="h-6 px-2 text-[10px] border border-dt-accent/20 hover:bg-dt-accent/10"
          >
            + Añadir
          </Button>
        )}
      </div>

      {/* Display current tags */}
      <div className="flex flex-wrap gap-2">
        {currentTags.length === 0 && (
          <span className="text-xs text-dt-subtle italic">Sin etiquetas</span>
        )}
        {currentTags.map((tag) => {
          const tagName = typeof tag === "string" ? tag : tag.nombre || tag.name;
          const tagColor = tag.color || '#6b7280';
          const isSuggested = suggestedTags.includes(tagName);
          return (
            <div
              key={tagName}
              className="group flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-mono border text-white"
              style={{ backgroundColor: tagColor, borderColor: tagColor }}
            >
              <span>#{tagName}</span>
              {isSuggested && (
                <span className="text-[9px] opacity-60" title="Sugerida por IA">
                  ✨
                </span>
              )}
              <button
                onClick={() => handleRemoveTag(tagName)}
                disabled={isPending}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-gray-300 disabled:opacity-50"
                title="Eliminar etiqueta"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Add tag interface */}
      {isAddingTag && (
        <div className="space-y-2 p-3 bg-black/20 rounded-md border border-white/10">
          <div className="text-xs text-dt-subtle mb-2">
            Selecciona una etiqueta existente o crea una nueva:
          </div>
          
          {/* Select from existing tags */}
          {!isLoadingTags && availableTags.length > 0 && (
            <select
              value={selectedTagName}
              onChange={(e) => {
                setSelectedTagName(e.target.value);
                setCustomTagName(""); // Clear custom input if selecting from dropdown
              }}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-dt-foreground text-sm focus:outline-none focus:border-dt-accent"
              disabled={isPending || customTagName.length > 0}
            >
              <option value="">-- Seleccionar etiqueta existente --</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.nombre}>
                  {tag.nombre}
                </option>
              ))}
            </select>
          )}

          {/* Or create custom tag */}
          <div className="flex items-center gap-2 text-xs text-dt-subtle">
            <div className="flex-1 border-t border-white/10"></div>
            <span>o</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <input
            type="text"
            value={customTagName}
            onChange={(e) => {
              setCustomTagName(e.target.value);
              setSelectedTagName(""); // Clear select if typing custom
            }}
            placeholder="Escribe nueva etiqueta..."
            className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-dt-foreground text-sm focus:outline-none focus:border-dt-accent"
            disabled={isPending || selectedTagName.length > 0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsAddingTag(false);
                setSelectedTagName("");
                setCustomTagName("");
              }}
              disabled={isPending}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddTag}
              disabled={isPending || (!selectedTagName && !customTagName.trim())}
              className="text-xs"
            >
              {isPending ? "Añadiendo..." : "Añadir"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

TagManager.propTypes = {
  ticketId: PropTypes.string.isRequired,
  currentTags: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        nombre: PropTypes.string,
        name: PropTypes.string,
      }),
    ])
  ),
  suggestedTags: PropTypes.arrayOf(PropTypes.string),
};

export default TagManager;
