// src/pages/public/NewTicketPage.jsx
import React, { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NewTicketPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('--- NUEVO TICKET ENVIADO ---');
    console.log(formData);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <PublicLayout>
        <div className="bg-primary p-8 rounded-lg border border-secondary text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-4">¡Gracias!</h2>
          <p className="text-foreground">Hemos recibido tu consulta. Recibirás una confirmación por correo electrónico en breve.</p>
          <p className="text-subtle mt-2">Tu número de ticket de referencia es: TKT-005.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-primary p-8 rounded-lg border border-secondary">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">Contacta con Soporte</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input id="name" label="Nombre Completo" value={formData.name} onChange={handleChange} required />
            <Input id="email" label="Correo Electrónico" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <Input id="orderId" label="Número de Orden (Opcional)" value={formData.orderId} onChange={handleChange} />
          <Input id="subject" label="Asunto" value={formData.subject} onChange={handleChange} required />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-subtle mb-2">Mensaje</label>
            <textarea
              id="message"
              rows="5"
              className="w-full p-3 bg-background border border-secondary rounded-md text-foreground placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Consulta'}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default NewTicketPage;