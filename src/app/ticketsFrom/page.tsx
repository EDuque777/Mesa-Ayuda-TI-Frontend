export default function TicketFormPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Crear nuevo Ticket de soporte</h1>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de software</label>
              <input type="text" placeholder="Correo, CRM, SOPORTE, etc." className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Asunto</label>
              <input type="text" className="w-full border p-2 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dificultad percibida</label>
            <div className="flex gap-4">
              {['Baja', 'Media', 'Alta', 'Critica'].map((level) => (
                <button key={level} type="button" className="border px-6 py-2 rounded">
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción del problema</label>
            <textarea className="w-full border p-2 rounded h-32"></textarea>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded">Enviar ticket</button>
            <button type="button" className="border px-6 py-2 rounded">Cancelar</button>
          </div>
          {/* Nuevo apartado para archivos */}
          <div>
            <label className="block text-sm font-medium mb-1">Adjuntar Archivos / Captura de pantalla</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Explorar
                <input type="file" className="hidden" />
              </label>
              <span className="text-sm text-gray-500">Ningún archivo seleccionado</span>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}