export const createTransaction = async (transaction: any) => {
  const res = await fetch(`/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    // lee el cuerpo como texto (puede ser HTML o mensaje)
    const text = await res.text();
    // intenta parsear JSON si es posible
    let message = text;
    try {
      const obj = JSON.parse(text);
      message = obj.message || JSON.stringify(obj);
    } catch {
      // no era JSON: usaremos el texto tal cual
    }
    throw new Error(message || 'No se pudo crear la transacción');
  }

  // respuesta OK: parsea JSON
  return res.json();
};


export const fetchProducts = async () => {
  const res = await fetch(`/api/products`);
  if (!res.ok) throw new Error('No se pudo cargar la lista de productos');
  return res.json();
};


export const updateStock = async (productId: string, quantity: number) => {
  const res = await fetch(`/api/products/${productId}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const obj = JSON.parse(text);
      message = obj.message || JSON.stringify(obj);
    } catch {}
    throw new Error(message || 'No se pudo actualizar el stock');
  }

  return res.json();
};


