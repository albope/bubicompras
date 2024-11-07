import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState(user?.displayName || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error handling is now done in AuthContext
    }
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe incluir al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe incluir al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe incluir al menos un número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Debe incluir al menos un carácter especial (!@#$%^&*)');
    }
    return errors;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      passwordErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      await updatePassword(user, newPassword);
      toast.success('Contraseña actualizada correctamente');
      setShowChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Error al actualizar la contraseña. Por favor, inicia sesión nuevamente');
      await logout();
      navigate('/login');
    }
  };

  const handleUpdateUsername = async () => {
    if (!user) return;
    
    try {
      await updateProfile(user, {
        displayName: username.trim()
      });
      toast.success('Nombre de usuario actualizado correctamente');
      setIsEditingUsername(false);
    } catch (error) {
      toast.error('Error al actualizar el nombre de usuario');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuración</h1>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Configuración de la Cuenta</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Administra tus preferencias y configuración.</p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Nombre de usuario
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleUpdateUsername}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setUsername(user?.displayName || '');
                        setIsEditingUsername(false);
                      }}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{user?.displayName || 'No establecido'}</span>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      Editar
                    </button>
                  </>
                )}
              </dd>
            </div>

            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Correo Electrónico
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Contraseña
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                {showChangePassword ? (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  >
                    Cambiar Contraseña
                  </button>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;