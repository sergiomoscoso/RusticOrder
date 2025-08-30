// Simulación de base de datos con localStorage
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

// Registrar pedido
document.getElementById('pedidoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cliente = document.getElementById('cliente').value;
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    const nuevoPedido = {
        id: Date.now(),
        cliente,
        producto,
        cantidad,
        estado: 'En preparación',
        fecha: new Date().toLocaleString()
    };

    pedidos.push(nuevoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    alert('Pedido registrado con éxito');
    this.reset();
});

// Cargar pedidos en funcion2.html
function cargarPedidos() {
    const container = document.getElementById('pedidosList');
    if (!container) return;

    container.innerHTML = '<h2>Pedidos en Preparación</h2>';
    
    const pedidosPendientes = pedidos.filter(p => p.estado === 'En preparación');
    
    if (pedidosPendientes.length === 0) {
        container.innerHTML += '<p>No hay pedidos pendientes.</p>';
        return;
    }

    pedidosPendientes.forEach(pedido => {
        container.innerHTML += `
            <div class="pedido">
                <p><strong>ID:</strong> ${pedido.id}</p>
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Producto:</strong> ${pedido.producto} (x${pedido.cantidad})</p>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
                <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                <button onclick="actualizarEstado(${pedido.id}, 'Listo')">✅ Listo</button>
            </div>
        `;
    });
}

// Actualizar estado del pedido
function actualizarEstado(id, nuevoEstado) {
    const index = pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
        pedidos[index].estado = nuevoEstado;
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        cargarPedidos();
        alert(`Pedido ID ${id} actualizado a: ${nuevoEstado}`);
    }
}

// Cargar pedidos al abrir funcion2.html
if (document.getElementById('pedidosList')) {
    cargarPedidos();
}