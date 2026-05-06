import React, { useState } from 'react';
import { FiArrowLeft, FiUsers, FiShuffle, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TablePagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalItems === 0) return null;

  return (
    <div className="flex justify-between items-center mt-4 px-2">
      <p className="text-xs opacity-50">
        Total: {totalItems} registros
      </p>
      <div className="join">
        <button 
          className="join-item btn btn-xs" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </button>
        <button className="join-item btn btn-xs no-animation">
          Pág {currentPage} de {totalPages}
        </button>
        <button 
          className="join-item btn btn-xs" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

const SimulationDetail = ({ simulation, onBack }) => {
  const [clientsPage, setClientsPage] = useState(1);
  const [casesPage, setCasesPage] = useState(1);
  const clientsPerPage = 30;
  const casesPerPage = 30;

  if (!simulation) return null;

  // Pagination for Clients
  const clientsTotal = simulation.clientesDetalle?.length || 0;
  const clientsStart = (clientsPage - 1) * clientsPerPage;
  const currentClients = simulation.clientesDetalle?.slice(clientsStart, clientsStart + clientsPerPage) || [];

  // Pagination for Cases
  const casesTotal = simulation.casosAleatorios?.length || 0;
  const casesStart = (casesPage - 1) * casesPerPage;
  const currentCases = simulation.casosAleatorios?.slice(casesStart, casesStart + casesPerPage) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="btn btn-circle btn-ghost">
          <FiArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black">{simulation.identificador_sim}</h2>
          <p className="opacity-60">Detalles completos de la simulación</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stats shadow-lg bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title text-primary-content/70">Wq (Espera)</div>
            <div className="stat-value text-2xl">{simulation.wq.toFixed(4)}</div>
          </div>
        </div>
        <div className="stats shadow-lg bg-secondary text-secondary-content">
          <div className="stat">
            <div className="stat-title text-secondary-content/70">Lq (Cola)</div>
            <div className="stat-value text-2xl">{simulation.lq.toFixed(4)}</div>
          </div>
        </div>
        <div className="stats shadow-lg bg-accent text-accent-content">
          <div className="stat">
            <div className="stat-title text-accent-content/70">Utilización (ρ)</div>
            <div className="stat-value text-2xl">{(simulation.rho * 100).toFixed(1)}%</div>
          </div>
        </div>
        <div className="stats shadow-lg bg-neutral text-neutral-content">
          <div className="stat">
            <div className="stat-title text-neutral-content/70">Servidores (S)</div>
            <div className="stat-value text-2xl">{simulation.s}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Results */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2 mb-4">
              <FiDollarSign className="text-success" />
              Resultados Financieros
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Ingresos</th>
                    <th>Costos Var</th>
                    <th>Costos Fijos</th>
                    <th>Ganancia</th>
                    <th>Margen</th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.resultadosFinancieros?.map((res) => (
                    <tr key={res.id}>
                      <td className="text-success font-bold">${res.ingresos.toLocaleString()}</td>
                      <td className="text-error">${res.costosVar.toLocaleString()}</td>
                      <td className="text-error">${res.costosFijos.toLocaleString()}</td>
                      <td className="font-black text-lg">${res.ganancia.toLocaleString()}</td>
                      <td>
                        <div className="badge badge-outline">
                          {res.ingresos > 0 
                            ? `${(res.margen * 100).toFixed(1)}%` 
                            : '0.0%'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Random Cases with Pagination */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2 mb-4">
              <FiShuffle className="text-warning" />
              Casos Aleatorios
            </h3>
            <div className="overflow-x-auto max-h-96">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Index</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.map((caso) => (
                    <tr key={caso.id}>
                      <td className="capitalize">{caso.tipo.replace('_', ' ')}</td>
                      <td>{caso.idx}</td>
                      <td className="font-mono">{caso.valor.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination 
              totalItems={casesTotal} 
              itemsPerPage={casesPerPage} 
              currentPage={casesPage} 
              onPageChange={setCasesPage} 
            />
          </div>
        </div>
      </div>

      {/* Client Detail Table with Pagination */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h3 className="card-title flex items-center gap-2 mb-4">
            <FiUsers className="text-primary" />
            Detalle de Clientes
          </h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-compact w-full">
              <thead>
                  <tr>
                    <th>Cliente #</th>
                    <th>Productos</th>
                    <th>Llegada</th>
                    <th>Inicio Serv.</th>
                    <th>Fin Serv.</th>
                    <th>Espera</th>
                    <th>Servicio</th>
                  </tr>
              </thead>
              <tbody>
                {currentClients.map((cli) => (
                  <tr key={cli.id}>
                    <td className="font-bold">{cli.clienteNumero}</td>
                    <td className="italic opacity-70">{cli.productos || 'N/A'}</td>
                    <td>{cli.tiempoLlegada.toFixed(2)}</td>
                    <td>{cli.tiempoInicio.toFixed(2)}</td>
                    <td>{cli.tiempoFin.toFixed(2)}</td>
                    <td className={cli.tiempoEspera > 0 ? 'text-error font-bold' : ''}>
                      {cli.tiempoEspera.toFixed(2)}
                    </td>
                    <td>{cli.tiempoServicio.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination 
            totalItems={clientsTotal} 
            itemsPerPage={clientsPerPage} 
            currentPage={clientsPage} 
            onPageChange={setClientsPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationDetail;
