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

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    setTimeout(() => {
      if (cleanUser === 'Cliente' && cleanPass === 'Admin123') {
        onLoginSuccess('token_pos_seguro_local_2026');
      } else {
        setError('Acceso denegado: Usuario o contraseña incorrectos.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">🔒 Acceso al Sistema POS</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Identifícate con tus credenciales autorizadas</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario de la Tienda</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: Cliente"
                className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña de Seguridad</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 dark:text-white transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Verificando seguridad...' : 'Ingresar al Sistema'}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-400">
            <p className="font-bold mb-1">🔑 Credenciales de Acceso Autorizadas:</p>
            <p><span className="font-semibold">Usuario:</span> Cliente <span className="text-[10px] text-gray-400">(Estricto)</span></p>
            <p className="mt-0.5"><span className="font-semibold">Contraseña:</span> Admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}