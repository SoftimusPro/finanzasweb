import { useMemo } from 'react';

const transactions = [
  { id: 1, date: '2024-09-01', description: 'Venta POS - Centro', category: 'Ventas', amount: 5200, type: 'ingreso', method: 'Tarjeta' },
  { id: 2, date: '2024-09-02', description: 'Pago nómina semanal', category: 'Gastos fijos', amount: -1800, type: 'gasto', method: 'Transferencia' },
  { id: 3, date: '2024-09-03', description: 'Compra inventario', category: 'Inventario', amount: -950, type: 'gasto', method: 'Crédito' },
  { id: 4, date: '2024-09-04', description: 'Servicio catering evento', category: 'Ventas', amount: 3100, type: 'ingreso', method: 'Transferencia' },
  { id: 5, date: '2024-09-04', description: 'Campaña Ads', category: 'Marketing', amount: -600, type: 'gasto', method: 'Tarjeta' },
  { id: 6, date: '2024-09-05', description: 'Venta online', category: 'Ventas', amount: 870, type: 'ingreso', method: 'Pago en línea' },
];

const budgets = [
  { name: 'Inventario', used: 3400, limit: 5000 },
  { name: 'Marketing', used: 1400, limit: 2500 },
  { name: 'Nómina', used: 4200, limit: 4500 },
  { name: 'Servicios', used: 720, limit: 1200 },
];

const goals = [
  { name: 'Fondo de emergencia', progress: 68, target: '$10,000' },
  { name: 'Apertura segundo local', progress: 42, target: '$25,000' },
  { name: 'Actualizar equipo', progress: 84, target: '$6,500' },
];

function SummaryCard({ label, value, trend }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/40">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {trend}
      </p>
    </div>
  );
}

function ProgressBar({ percentage }) {
  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

function App() {
  const { totalIncome, totalExpenses, netCashFlow, savingRate } = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
    const expense = Math.abs(transactions.filter((t) => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0));
    const net = income - expense;
    const rate = income === 0 ? 0 : Math.max(0, Math.round((net / income) * 100));

    return {
      totalIncome: income,
      totalExpenses: expense,
      netCashFlow: net,
      savingRate: rate,
    };
  }, []);

  const monthlyPerformance = [
    { label: 'Ago', income: 9800, expenses: 7200 },
    { label: 'Sep', income: 11200, expenses: 8100 },
    { label: 'Oct (proy.)', income: 12400, expenses: 8400 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-blue-500/10 border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Panel financiero</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-white">Salud de tu negocio</h1>
            <p className="mt-2 text-slate-300 max-w-2xl">
              Vigila flujo de efectivo, controla presupuestos y sigue metas de crecimiento con este panel listo para usar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.01] transition">
              Registrar ingreso
            </button>
            <button className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-100">
              Nuevo gasto
            </button>
            <button className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-100">
              Exportar reporte
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Ingresos del mes" value={`$ ${totalIncome.toLocaleString('es-MX')}`} trend="+12% vs. mes anterior" />
          <SummaryCard label="Gastos del mes" value={`$ ${totalExpenses.toLocaleString('es-MX')}`} trend="-4% vs. mes anterior" />
          <SummaryCard label="Flujo neto" value={`$ ${netCashFlow.toLocaleString('es-MX')}`} trend="Liquidez estable" />
          <SummaryCard label="Tasa de ahorro" value={`${savingRate}%`} trend="Objetivo: 25%" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Resumen semanal</h2>
                <p className="text-sm text-slate-400">Flujo de efectivo de los últimos movimientos registrados.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold">Actualizado</span>
            </div>

            <div className="mt-6 space-y-3">
              {monthlyPerformance.map((item) => {
                const net = item.income - item.expenses;
                const margin = Math.round((net / item.income) * 100);
                return (
                  <div key={item.label} className="p-4 border border-slate-800 rounded-xl bg-slate-900/70">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">{item.label}</div>
                      <div className="text-sm text-slate-400">Margen {margin}%</div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Ingresos</p>
                        <p className="text-white font-semibold">$ {item.income.toLocaleString('es-MX')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Gastos</p>
                        <p className="text-white font-semibold">$ {item.expenses.toLocaleString('es-MX')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Flujo neto</p>
                        <p className="text-white font-semibold">$ {net.toLocaleString('es-MX')}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Ingresos vs Gastos</span>
                        <span>{Math.round((item.expenses / item.income) * 100)}% consumido</span>
                      </div>
                      <ProgressBar percentage={(item.expenses / item.income) * 100} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Presupuestos</h2>
              <button className="text-sm text-emerald-300 hover:text-emerald-200">Ajustar</button>
            </div>
            <div className="space-y-4">
              {budgets.map((budget) => {
                const percentage = Math.round((budget.used / budget.limit) * 100);
                return (
                  <div key={budget.name} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{budget.name}</p>
                        <p className="text-slate-400 text-sm">$ {budget.used.toLocaleString('es-MX')} de $ {budget.limit.toLocaleString('es-MX')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${percentage > 90 ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/15 text-emerald-200'}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <ProgressBar percentage={percentage} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Transacciones recientes</h2>
                <p className="text-sm text-slate-400">Controla entradas y salidas por método de pago y categoría.</p>
              </div>
              <button className="text-sm text-emerald-300 hover:text-emerald-200">Ver todo</button>
            </div>
            <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 bg-slate-900 text-xs uppercase tracking-wide text-slate-400 px-4 py-3">
                <span>Fecha</span>
                <span>Descripción</span>
                <span>Categoría</span>
                <span>Método</span>
                <span className="text-right">Monto</span>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-900/50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-5 items-center px-4 py-3 text-sm">
                    <span className="text-slate-300">{tx.date}</span>
                    <span className="text-white font-medium">{tx.description}</span>
                    <span className="text-slate-400">{tx.category}</span>
                    <span className="text-slate-400">{tx.method}</span>
                    <span className={`text-right font-semibold ${tx.type === 'ingreso' ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {tx.type === 'ingreso' ? '+ ' : '- '} $ {Math.abs(tx.amount).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Metas</h2>
                <button className="text-sm text-emerald-300 hover:text-emerald-200">Editar</button>
              </div>
              <div className="mt-4 space-y-4">
                {goals.map((goal) => (
                  <div key={goal.name} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{goal.name}</p>
                        <p className="text-slate-400 text-sm">Meta: {goal.target}</p>
                      </div>
                      <span className="text-sm text-emerald-200 font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="mt-3">
                      <ProgressBar percentage={goal.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-lg shadow-emerald-900/40">
              <h2 className="text-xl font-semibold text-white">Siguientes pasos</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-100">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Automatiza conciliaciones con tu banco principal.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Define alertas cuando el gasto supere 85% del presupuesto.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Cierra el mes con un informe PDF para tus socios.
                </li>
              </ul>
              <button className="mt-5 w-full py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">
                Ver plan de acción
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
