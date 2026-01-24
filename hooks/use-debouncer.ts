import { useState, useEffect } from 'react';

// Este hook recebe um valor e um delay, e retorna o valor apenas após o delay ter passado sem que o valor mude.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um timer que vai atualizar o valor "debounced" após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Se o valor mudar (o usuário digitar de novo), o timer anterior é limpo e um novo é criado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda o efeito de novo apenas se o valor ou o delay mudarem

  return debouncedValue;
}
