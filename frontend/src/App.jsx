import { useMemo, useState } from 'react';

const initialProducts = [
  {
    id: 1,
    model: 'Tenis Running AirFlex',
    sku: 'RUN-001',
    lot: 'L2409',
    cost: 55,
    salePrice: 92,
    location: 'Almacén A1',
    stock: 18,
    receivedAt: '2024-09-02',
    eta: '2024-09-08',
  },
  {
    id: 2,
    model: 'Mochila Modular 30L',
    sku: 'BAG-014',
    lot: 'L2408',
    cost: 32,
    salePrice: 65,
    location: 'Almacén B3',
    stock: 34,
    receivedAt: '2024-08-28',
    eta: '2024-09-05',
  },
  {
    id: 3,
    model: 'Lentes de sol urban',
    sku: 'SUN-009',
    lot: 'L2407',
    cost: 18,
    salePrice: 39,
    location: 'Tienda piso 1',
    stock: 22,
    receivedAt: '2024-09-04',
    eta: '2024-09-10',
  },
];

const initialMovements = [
  {
    id: 1,
    type: 'entrada',
    sku: 'RUN-001',
    lot: 'L2409',
    quantity: 12,
    reason: 'Compra proveedor',
    date: '2024-09-02',
  },
  {
    id: 2,
    type: 'salida',
    sku: 'BAG-014',
    lot: 'L2408',
    quantity: 6,
    reason: 'Venta ecommerce',
    date: '2024-09-03',
  },
  {
    id: 3,
    type: 'ajuste',
    sku: 'SUN-009',
    lot: 'L2407',
    quantity: -2,
    reason: 'Rotura en almacén',
    date: '2024-09-04',
  },
];

const initialFinances = [
  { id: 1, date: '2024-09-02', concept: 'Venta online', type: 'venta', amount: 1450, shipping: 120, commission: 58, tax: 232 },
  { id: 2, date: '2024-09-02', concept: 'Pago envío paquetería', type: 'gasto', amount: -120, shipping: 120, commission: 0, tax: 0 },
  { id: 3, date: '2024-09-03', concept: 'Venta POS', type: 'venta', amount: 980, shipping: 0, commission: 35, tax: 157 },
  { id: 4, date: '2024-09-04', concept: 'Comisiones marketplace', type: 'gasto', amount: -95, shipping: 0, commission: 95, tax: 0 },
  { id: 5, date: '2024-09-04', concept: 'Diezmo', type: 'gasto', amount: -150, shipping: 0, commission: 0, tax: 0 },
];

const initialCashBalance = 18750;

const formatCurrency = (value) =>
  value.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  });

function SummaryCard({ label, value, badge, description }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/40">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold">{badge}</span>
        <span className="text-slate-400">{description}</span>
      </div>
    </div>
  );
}

function DataRow({ cells }) {
  return (
    <div className="grid grid-cols-[1.5fr_repeat(5,_1fr)] items-center px-4 py-3 text-sm gap-3">
      {cells.map((cell, idx) => (
        <span key={idx} className="text-slate-200 truncate">
          {cell}
        </span>
      ))}
    </div>
  );
}

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [finances, setFinances] = useState(initialFinances);
  const [cashBalance, setCashBalance] = useState(initialCashBalance);

  const [productForm, setProductForm] = useState({
    model: '',
    sku: '',
    lot: '',
    cost: '',
    salePrice: '',
    location: '',
    receivedAt: '',
    eta: '',
    stock: '',
  });

  const [movementForm, setMovementForm] = useState({
    type: 'entrada',
    sku: '',
    lot: '',
    quantity: '',
    reason: '',
  });

  const [financeForm, setFinanceForm] = useState({
    concept: '',
    type: 'venta',
    amount: '',
    shipping: '',
    commission: '',
    tax: '',
    tithe: '',
  });

  const totals = useMemo(() => {
    const inventoryValue = products.reduce((sum, item) => sum + item.stock * item.cost, 0);
    const potentialRevenue = products.reduce((sum, item) => sum + item.stock * item.salePrice, 0);
    const totalSales = finances.filter((f) => f.type === 'venta').reduce((sum, f) => sum + f.amount, 0);
    const totalExpenses = Math.abs(finances.filter((f) => f.type === 'gasto').reduce((sum, f) => sum + f.amount, 0));
    const netCash = totalSales - totalExpenses;

    return { inventoryValue, potentialRevenue, totalSales, totalExpenses, netCash };
  }, [finances, products]);

  const handleCSVExport = (rows, filename) => {
    if (!rows?.length) return;

    const header = Object.keys(rows[0]).join(',');
    const body = rows.map((row) => Object.values(row).join(',')).join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBackup = () => {
    const payload = { products, movements, finances, cashBalance };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup-finanzas.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();

    const newProduct = {
      ...productForm,
      id: crypto.randomUUID(),
      cost: Number(productForm.cost || 0),
      salePrice: Number(productForm.salePrice || 0),
      stock: Number(productForm.stock || 0),
    };

    setProducts((prev) => [newProduct, ...prev]);
    setProductForm({
      model: '',
      sku: '',
      lot: '',
      cost: '',
      salePrice: '',
      location: '',
      receivedAt: '',
      eta: '',
      stock: '',
    });
  };

  const handleMovementSubmit = (event) => {
    event.preventDefault();

    if (!movementForm.sku || !movementForm.quantity) return;

    const quantity = Number(movementForm.quantity);
    const movementType = movementForm.type.toLowerCase();
    const signedQty = movementType === 'salida' ? -Math.abs(quantity) : movementType === 'entrada' ? Math.abs(quantity) : quantity;

    setProducts((prev) =>
      prev.map((product) =>
        product.sku === movementForm.sku
          ? { ...product, stock: Math.max(0, product.stock + signedQty) }
          : product
      )
    );

    const newMovement = {
      id: crypto.randomUUID(),
      ...movementForm,
      quantity: signedQty,
      date: new Date().toISOString().slice(0, 10),
    };

    setMovements((prev) => [newMovement, ...prev]);
    setMovementForm({ type: 'entrada', sku: '', lot: '', quantity: '', reason: '' });
  };

  const handleFinanceSubmit = (event) => {
    event.preventDefault();
    if (!financeForm.concept || !financeForm.amount) return;

    const amount = Number(financeForm.amount);
    const shipping = Number(financeForm.shipping || 0);
    const commission = Number(financeForm.commission || 0);
    const tax = Number(financeForm.tax || 0);
    const tithe = Number(financeForm.tithe || 0);

    const isSale = financeForm.type === 'venta';
    const signedAmount = isSale ? Math.abs(amount) : -Math.abs(amount);

    const newFinance = {
      id: crypto.randomUUID(),
      concept: financeForm.concept,
      type: financeForm.type,
      date: new Date().toISOString().slice(0, 10),
      amount: signedAmount,
      shipping,
      commission,
      tax,
      tithe,
    };

    setFinances((prev) => [newFinance, ...prev]);
    setCashBalance((prev) => prev + signedAmount - shipping - commission - tax - tithe);

    setFinanceForm({ concept: '', type: 'venta', amount: '', shipping: '', commission: '', tax: '', tithe: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-blue-500/10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">MVP control financiero + inventario</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-white">Panel operativo del negocio</h1>
            <p className="mt-2 text-slate-300 max-w-3xl">
              Registra productos con fecha de ingreso y entrega esperada, controla movimientos (compra, venta, ajustes),
              registra ventas y gastos clave y monitorea saldo, inventario valuado y flujo de caja desde un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.01] transition" href="#registrar-producto">
              Agregar producto
            </a>
            <a className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-100" href="#movimientos">
              Registrar movimiento
            </a>
            <button
              className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-100"
              onClick={() => handleCSVExport(products, 'inventario.csv')}
            >
              Exportar inventario CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Saldo disponible"
            value={formatCurrency(cashBalance)}
            badge="Caja + bancos"
            description="Incluye últimas ventas y retiros"
          />
          <SummaryCard
            label="Inventario valuado"
            value={formatCurrency(totals.inventoryValue)}
            badge="Costo acumulado"
            description="Sumatoria stock x costo"
          />
          <SummaryCard
            label="Flujo neto del mes"
            value={formatCurrency(totals.netCash)}
            badge="Ingresos - gastos"
            description="Ventas menos envíos, comisiones, impuestos y diezmo"
          />
          <SummaryCard
            label="Ventas potenciales"
            value={formatCurrency(totals.potentialRevenue)}
            badge="Precio de lista"
            description="Proyección si vendes todo el stock"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div id="registrar-producto" className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Registrar producto</h2>
                <p className="text-sm text-slate-400">Modelo, SKU, lote, costo, precio, ubicación y fechas clave.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold">Nuevo</span>
            </div>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleProductSubmit}>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Modelo / descripción</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Ej. Tenis AirFlex"
                  required
                  value={productForm.model}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, model: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">SKU</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="RUN-001"
                  required
                  value={productForm.sku}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, sku: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Lote</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="L2409"
                  value={productForm.lot}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, lot: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Costo unitario</label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="50"
                  value={productForm.cost}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, cost: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Precio de venta</label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="80"
                  value={productForm.salePrice}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, salePrice: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Ubicación</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Almacén A1"
                  value={productForm.location}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Fecha de ingreso</label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  value={productForm.receivedAt}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, receivedAt: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Fecha esperada de entrega</label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  value={productForm.eta}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, eta: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Stock inicial</label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="10"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.01] transition">
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Inventario</h2>
                <p className="text-sm text-slate-400">Stock, costo, precio, ubicación y fechas de ingreso/entrega.</p>
              </div>
              <button
                className="text-sm text-emerald-300 hover:text-emerald-200"
                onClick={() => handleCSVExport(products, 'inventario.csv')}
              >
                Exportar CSV
              </button>
            </div>
            <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1.5fr_repeat(5,_1fr)] bg-slate-900 text-xs uppercase tracking-wide text-slate-400 px-4 py-3 gap-3">
                <span>Producto</span>
                <span>SKU</span>
                <span>Lote</span>
                <span>Stock</span>
                <span>Ingreso</span>
                <span>Entrega</span>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-900/50">
                {products.map((item) => (
                  <DataRow
                    key={item.id}
                    cells={[
                      item.model,
                      item.sku,
                      item.lot,
                      `${item.stock} uds. — ${formatCurrency(item.cost)}`,
                      item.receivedAt,
                      item.eta,
                    ]}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div id="movimientos" className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Movimiento de inventario</h2>
                <button className="text-sm text-emerald-300 hover:text-emerald-200">Plantilla</button>
              </div>
              <form className="mt-4 space-y-3" onSubmit={handleMovementSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                    value={movementForm.type}
                    onChange={(e) => setMovementForm((prev) => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                    <option value="ajuste">Ajuste</option>
                  </select>
                  <input
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                    placeholder="SKU"
                    required
                    value={movementForm.sku}
                    onChange={(e) => setMovementForm((prev) => ({ ...prev, sku: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                    placeholder="Cantidad"
                    required
                    value={movementForm.quantity}
                    onChange={(e) => setMovementForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  />
                  <input
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                    placeholder="Lote"
                    value={movementForm.lot}
                    onChange={(e) => setMovementForm((prev) => ({ ...prev, lot: e.target.value }))}
                  />
                </div>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Motivo (compra, venta, ajuste)"
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, reason: e.target.value }))}
                />
                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">Guardar movimiento</button>
                </div>
              </form>
              <div className="mt-4 text-xs text-slate-400">Entradas, salidas y ajustes se reflejan en el valuado de inventario.</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-lg shadow-emerald-900/40">
              <h2 className="text-xl font-semibold text-white">Backup / Restore</h2>
              <p className="text-sm text-emerald-100 mt-1">Guarda un archivo local o sube desde Google Drive / iCloud.</p>
              <div className="mt-4 space-y-3">
                <button
                  className="w-full py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
                  onClick={handleBackup}
                >
                  Descargar backup
                </button>
                <label className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-emerald-200/60 text-emerald-50 cursor-pointer hover:bg-emerald-500/10">
                  <input type="file" className="hidden" />
                  Restaurar desde archivo
                </label>
                <button className="w-full py-2 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-50 hover:bg-slate-900">
                  Conectar Google Drive / iCloud
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Movimientos recientes</h2>
                <p className="text-sm text-slate-400">Entradas, salidas y ajustes por SKU y lote.</p>
              </div>
              <button
                className="text-sm text-emerald-300 hover:text-emerald-200"
                onClick={() => handleCSVExport(movements, 'movimientos.csv')}
              >
                Exportar CSV
              </button>
            </div>
            <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[repeat(5,_1fr)] bg-slate-900 text-xs uppercase tracking-wide text-slate-400 px-4 py-3 gap-3">
                <span>Tipo</span>
                <span>SKU</span>
                <span>Lote</span>
                <span>Cantidad</span>
                <span>Fecha</span>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-900/50">
                {movements.map((move) => (
                  <div key={move.id} className="grid grid-cols-[repeat(5,_1fr)] items-center px-4 py-3 text-sm gap-3">
                    <span className={`font-semibold ${move.type === 'entrada' ? 'text-emerald-300' : move.type === 'salida' ? 'text-rose-300' : 'text-amber-300'}`}>
                      {move.type}
                    </span>
                    <span className="text-slate-200">{move.sku}</span>
                    <span className="text-slate-200">{move.lot}</span>
                    <span className="text-slate-200">{move.quantity} uds</span>
                    <span className="text-slate-200">{move.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Ventas y gastos</h2>
              <button className="text-sm text-emerald-300 hover:text-emerald-200">Conciliar</button>
            </div>
            <form className="space-y-3" onSubmit={handleFinanceSubmit}>
              <input
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                placeholder="Concepto"
                required
                value={financeForm.concept}
                onChange={(e) => setFinanceForm((prev) => ({ ...prev, concept: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  value={financeForm.type}
                  onChange={(e) => setFinanceForm((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="venta">Venta</option>
                  <option value="gasto">Gasto</option>
                </select>
                <input
                  type="number"
                  className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Monto"
                  required
                  value={financeForm.amount}
                  onChange={(e) => setFinanceForm((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Envío"
                  value={financeForm.shipping}
                  onChange={(e) => setFinanceForm((prev) => ({ ...prev, shipping: e.target.value }))}
                />
                <input
                  type="number"
                  className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Comisión"
                  value={financeForm.commission}
                  onChange={(e) => setFinanceForm((prev) => ({ ...prev, commission: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Impuestos"
                  value={financeForm.tax}
                  onChange={(e) => setFinanceForm((prev) => ({ ...prev, tax: e.target.value }))}
                />
                <input
                  type="number"
                  className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Diezmo"
                  value={financeForm.tithe}
                  onChange={(e) => setFinanceForm((prev) => ({ ...prev, tithe: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">Registrar</button>
              </div>
            </form>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[repeat(5,_1fr)] bg-slate-900 text-xs uppercase tracking-wide text-slate-400 px-4 py-3 gap-3">
                <span>Fecha</span>
                <span>Concepto</span>
                <span>Tipo</span>
                <span>Monto</span>
                <span>Impuestos</span>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-900/50">
                {finances.map((item) => (
                  <div key={item.id} className="grid grid-cols-[repeat(5,_1fr)] items-center px-4 py-3 text-sm gap-3">
                    <span className="text-slate-300">{item.date}</span>
                    <span className="text-white font-medium">{item.concept}</span>
                    <span className={`font-semibold ${item.type === 'venta' ? 'text-emerald-300' : 'text-rose-300'}`}>{item.type}</span>
                    <span className={`${item.type === 'venta' ? 'text-emerald-300' : 'text-rose-300'} font-semibold`}>
                      {item.type === 'venta' ? '+ ' : '- '}
                      {formatCurrency(Math.abs(item.amount))}
                    </span>
                    <span className="text-slate-200">{formatCurrency(item.tax)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
