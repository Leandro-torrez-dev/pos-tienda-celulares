import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Forzamos limpieza de espacios y pasamos a minúsculas para evitar errores tipográficos
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Simulamos un retraso de red de medio segundo para que la animación de carga se vea profesional
    setTimeout(() => {
      if (cleanUser === 'cliente' && cleanPass === 'Admin123') {
        console.log("¡Acceso verificado! Generando token local seguro.");
        onLoginSuccess('token_pos_seguro_local_2026');
      } else {
        setError('Acceso denegado: Usuario o contraseña incorrectos.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">🔒 Acceso al Sistema POS</h2>
        <p className="mt-2 text-sm text-gray-600">Identifícate para gestionar la tienda y tus ventas</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Campo Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario de la Tienda</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: Cliente"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña de Seguridad</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Alerta de Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            {/* Botón de Ingreso */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Verificando seguridad...' : 'Ingresar al Sistema'}
              </button>
            </div>
          </form>

          {/* Tarjeta Informativa Impecable */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <p className="font-bold mb-1">🔑 Credenciales de Acceso Autorizadas:</p>
            <p><span className="font-semibold">Usuario:</span> Cliente</p>
            <p className="mt-0.5"><span className="font-semibold">Contraseña:</span> Admin123</p>
          </div>

        </div>
      </div>
    </div>
  );
}