// src/features/tickets/components/ConversationBubble.jsx
import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import { formatChannel } from "@/shared/utils/formatters";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  if (!bytes) return null;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = unitIndex === 0 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
};

const isImageAttachment = (file = {}) => {
  const mime = file.mimeType || "";
  const name = file.name || "";
  return /image\//i.test(mime) || /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(name);
};

const channelIcons = {
  correo: "mail",
  email: "mail",
  chat: "chat",
  widget: "chat",
  telefono: "call",
  phone: "call",
  api: "link",
  formulario_web: "language",
  web: "language",
};

const ConversationBubble = ({ message }) => {
  const {
    from,
    author,
    text,
    timestamp,
    attachments = [],
    channel,
    isInternalNote,
  } = message;
  const isCustomer = from === "customer";

  const bubbleAlignment = isCustomer ? "items-start" : "items-end";
  // Customer: Glassmorphism dark. Agent: Electric Violet Gradient.
  const bubbleColor = isCustomer
    ? "bg-white/5 border border-white/10 backdrop-blur-sm"
    : "bg-gradient-to-br from-dt-accent to-dt-accent-hover shadow-glow border border-transparent";

  const textColor = "text-dt-foreground";
  const hasAttachments = attachments.length > 0;
  const rawBody = typeof text === "string" ? text : "";
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(rawBody);
  const safeSource = containsHtml ? rawBody : rawBody.replace(/\n/g, "<br />");
  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(safeSource, { USE_PROFILES: { html: true } }),
    [safeSource],
  );
  const normalizedChannel = (channel || "web").toLowerCase();
  const channelLabel = formatChannel(normalizedChannel) || normalizedChannel;
  const channelIcon = channelIcons[normalizedChannel] || "alternate_email";
  const noteBadge = isInternalNote ? "Nota interna" : null;

  return (
    <div className={`flex flex-col mb-6 ${bubbleAlignment} group`}>
      <div
        className={`max-w-xl rounded-2xl p-5 ${bubbleColor} transition-transform duration-200 hover:scale-[1.01]`}
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-4 font-semibold text-dt-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-xs opacity-70">
              {channelIcon}
            </span>
            <span className="font-mono">{channelLabel}</span>
          </div>
          {noteBadge && (
            <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-mono tracking-normal">
              {noteBadge}
            </span>
          )}
        </div>
        <div
          className={`text-sm leading-relaxed ${textColor} space-y-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-dt-accent [&_strong]:text-white`}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        {hasAttachments && (
          <div className="mt-4 space-y-3">
            {attachments.map((file, index) => {
              const key = file.id || `${file.name || "attachment"}-${index}`;
              const downloadUrl = file.url || file.downloadUrl || null;
              const AttachmentWrapper = downloadUrl ? "a" : "div";
              const commonProps = downloadUrl
                ? {
                    href: downloadUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {};
              const previewIsImage = isImageAttachment(file) && downloadUrl;

              return (
                <AttachmentWrapper
                  key={key}
                  {...commonProps}
                  className={`block rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-white/30 hover:bg-black/10 ${downloadUrl ? "cursor-pointer" : "cursor-default"}`}
                >
                  {previewIsImage ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-dt-subtle font-mono">
                        <span className="uppercase">
                          {file.name || "Imagen adjunta"}
                        </span>
                        {formatFileSize(file.size) && (
                          <span>{formatFileSize(file.size)}</span>
                        )}
                      </div>
                      <div className="overflow-hidden rounded-lg border border-white/10">
                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                        <img
                          src={downloadUrl}
                          alt={file.name || "Attachment preview"}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 text-xs text-dt-foreground">
                      <div className="flex flex-col">
                        <span className="font-semibold tracking-wide">
                          {file.name || "Archivo adjunto"}
                        </span>
                        <span className="text-dt-subtle font-mono">
                          {file.mimeType || "Descarga"}
                        </span>
                      </div>
                      {formatFileSize(file.size) && (
                        <span className="text-dt-subtle font-mono">
                          {formatFileSize(file.size)}
                        </span>
                      )}
                    </div>
                  )}
                </AttachmentWrapper>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-2 px-2 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-wider text-dt-subtle">
          {author}
        </span>
        <span className="text-[10px] text-dt-subtle font-mono">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ConversationBubble;
