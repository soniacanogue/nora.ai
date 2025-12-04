import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import FileUpload from "./FileUpload";

const DynamicFormModal = ({ isOpen, onClose, title, config }) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});

  // Initialize form data based on config.fields
  useEffect(() => {
    if (isOpen && config?.fields) {
      const initialData = {};
      Object.keys(config.fields).forEach((key) => {
        initialData[key] = config.fields[key].defaultValue || "";
      });
      setFormData(initialData);
      setFiles({});
    }
  }, [isOpen, config]);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    options={options || []}
                    placeholder={placeholder}
                    {...rest}
                  />
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
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    required={required}
                    {...rest}
                  />
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
              <Input
                key={key}
                id={key}
                type={type}
                label={label}
                placeholder={placeholder}
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required={required}
                {...rest}
              />
            );
          })}

        <div className="flex justify-end gap-4 mt-6">
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
    </Modal>
  );
};

export default DynamicFormModal;
