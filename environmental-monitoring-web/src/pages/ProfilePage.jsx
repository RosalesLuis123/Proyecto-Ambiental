export default function ProfilePage() {
  const user = {
    name: 'Juan Pérez',
    email: 'admin@example.com',
    role: 'Monitor Ambiental',
    location: 'La Paz, Bolivia',
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Perfil de Usuario</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold">Nombre</label>
            <p className="text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Rol</label>
            <p className="text-gray-900">{user.role}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Ubicación</label>
            <p className="text-gray-900">{user.location}</p>
          </div>
        </div>
      </div>
    </div>
  )
}