import React, { useState, useEffect, useMemo, useRef } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import FileUpload from "./FileUpload";

const DynamicFormModal = ({
  isOpen = true,
  onClose,
  title,
  description,
  config = {},
  defaultValues = {},
  errors = {},
  inline = false,
}) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const wasOpenRef = useRef(false);
  const fieldsSignature = useMemo(() => {
    if (!config?.fields) return "";
    return Object.entries(config.fields)
      .map(([key, field]) => {
        const fallback =
          field.defaultValue !== undefined ? field.defaultValue : "";
        return `${key}:${JSON.stringify(fallback)}`;
      })
      .join("|");
  }, [config]);
  const prevFieldsSignatureRef = useRef(fieldsSignature);
  const defaultsSignature = useMemo(() => {
    try {
      return JSON.stringify(defaultValues ?? {});
    } catch (err) {
      return "{}";
    }
  }, [defaultValues]);
  const prevDefaultsSignatureRef = useRef(defaultsSignature);

  // Initialize form data based on config.fields
  useEffect(() => {
    const hasFields = Boolean(config?.fields);
    const defaultsChanged =
      prevDefaultsSignatureRef.current !== defaultsSignature;
    const fieldsChanged = prevFieldsSignatureRef.current !== fieldsSignature;
    const justOpened = isOpen && !wasOpenRef.current;

    if (hasFields && isOpen && (justOpened || defaultsChanged || fieldsChanged)) {
      const initialData = {};
      Object.keys(config.fields).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
          initialData[key] = defaultValues[key];
        } else {
          const fallback = config.fields[key].defaultValue;
          initialData[key] = fallback !== undefined ? fallback : "";
        }
      });
      setFormData(initialData);
      setFiles({});
    }

    if (!isOpen && wasOpenRef.current) {
      setFormData({});
      setFiles({});
    }

    wasOpenRef.current = isOpen;
    prevDefaultsSignatureRef.current = defaultsSignature;
    if (hasFields) {
      prevFieldsSignatureRef.current = fieldsSignature;
    }
  }, [config, defaultsSignature, fieldsSignature, isOpen]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (key, selectedFiles) => {
    setFiles((prev) => ({
      ...prev,
      [key]: selectedFiles,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is a generic submit handler if a button has type="submit"
    // However, the buttons config might handle clicks individually.
    // If there is a submit button in config.buttons, its onClick should probably be called with formData.
  };

  if (!config) return null;

  const { fields, buttons } = config;

  const formContent = (
    <>
      {description && (
        <p className="text-sm text-dt-subtle mb-4 leading-relaxed">
          {description}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh]">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {fields &&
            Object.entries(fields).map(([key, fieldConfig]) => {
              const {
                type = "text",
                label,
                placeholder,
                required,
                options,
                ...rest
              } = fieldConfig;

              if (type === "select") {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-dt-subtle mb-2">
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <Select
                      value={formData[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      options={options || []}
                      placeholder={placeholder}
                      {...rest}
                    />
                    {errors[key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                    )}
                  </div>
                );
              }

              if (type === "textarea") {
                return (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-dt-subtle mb-2"
                    >
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      id={key}
                      rows={rest.rows || 4}
                      className="w-full p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-primary-light"
                      placeholder={placeholder}
                      value={formData[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      required={required}
                      {...rest}
                    />
                    {errors[key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                    )}
                  </div>
                );
              }

              if (type === "number") {
                return (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-dt-subtle mb-2"
                    >
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={key}
                      type="number"
                      className="w-full p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-primary-light"
                      placeholder={placeholder}
                      value={formData[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      required={required}
                      {...rest}
                    />
                    {errors[key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                    )}
                  </div>
                );
              }

              if (type === "date") {
                return (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-dt-subtle mb-2"
                    >
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={key}
                      type="date"
                      className="w-full p-3 bg-dt-background border border-secondary rounded-md text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-primary-light"
                      value={formData[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      required={required}
                      {...rest}
                    />
                    {errors[key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                    )}
                  </div>
                );
              }

              if (type === "file") {
                return (
                  <FileUpload
                    key={key}
                    label={label}
                    onFilesSelect={(selectedFiles) =>
                      handleFileChange(key, selectedFiles)
                    }
                    {...rest}
                  />
                );
              }

              return (
                <div key={key}>
                  <Input
                    id={key}
                    type={type}
                    label={label}
                    placeholder={placeholder}
                    value={formData[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    required={required}
                    {...rest}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                  )}
                </div>
              );
            })}
        </div>
        <div className="flex justify-end gap-4 border-t border-secondary pt-4 mt-4 bg-dt-primary/20 px-1 shrink-0">
          {buttons &&
            Object.entries(buttons).map(([key, btnConfig]) => {
              const {
                label,
                onClick,
                variant = "primary",
                type = "button",
                ...rest
              } = btnConfig;

              const handleClick = (e) => {
                if (onClick) {
                  // Pass formData and files to the click handler
                  onClick({ ...formData, ...files }, e);
                }
                if (type === "submit") {
                  // If it's a submit button, the form onSubmit might also trigger if not prevented.
                  // But usually we want to handle the logic in onClick for this dynamic form.
                }
              };

              return (
                <Button
                  key={key}
                  type={type}
                  variant={variant}
                  onClick={handleClick}
                  fullWidth={false}
                  {...rest}
                >
                  {label}
                </Button>
              );
            })}
        </div>
      </form>
    </>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {formContent}
    </Modal>
  );
};

export default DynamicFormModal;
