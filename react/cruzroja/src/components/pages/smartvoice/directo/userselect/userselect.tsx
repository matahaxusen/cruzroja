import React from 'react';

interface UserSelectProps {
  users: Record<string, any>[];
  value: string;
  onSelect: (user: string) => void;
}

export const UserSelect: React.FC<UserSelectProps> = ({ users, value, onSelect }) => (
  <select className='form-select' value={value} onChange={(e) => onSelect(e.target.value)}>
    <option value="">Seleccionar...</option>
    {users.map((user) => (
      <option key={user.id} value={JSON.stringify(user)}>
        {user.nombre} {user.apellidos}
      </option>
    ))}
  </select>
);

export default UserSelect;