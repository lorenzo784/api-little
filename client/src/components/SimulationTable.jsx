import React, { useState } from 'react';
import { FiSearch, FiDownload, FiEye, FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SimulationTable = ({ simulations, onView, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filtered = simulations.filter((s) =>
    s.identificador_sim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300">
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiActivity className="text-primary" />
            Simulaciones
          </h2>
          <p className="text-sm opacity-70">Gestiona y analiza los resultados de tus modelos</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Buscar por identificador..."
            className="input input-bordered w-full pl-10 rounded-2xl focus:input-primary"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200/50">
            <tr>
              <th>ID</th>
              <th>Identificador</th>
              <th>Fecha</th>
              <th>Lambda (λ)</th>
              <th>Mu (μ)</th>
              <th>Ganancia</th>
              <th>Margen</th>
              <th>Casos</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sim) => (
              <tr key={sim.id} className="hover:bg-primary/5 transition-colors">
                <td className="font-mono text-xs opacity-60">{sim.id}</td>
                <td>
                  <span className="font-bold text-primary">{sim.identificador_sim}</span>
                </td>
                <td>{new Date(sim.fecha).toLocaleString()}</td>
                <td>{sim.lambd}</td>
                <td>{sim.mu}</td>
                <td className="font-bold text-success">
                  {sim.resultadosFinancieros?.[0] 
                    ? `$${sim.resultadosFinancieros[0].ganancia.toLocaleString()}`
                    : '-'}
                </td>
                <td>
                  {sim.resultadosFinancieros?.[0] 
                    ? <div className="badge badge-sm badge-outline">{(sim.resultadosFinancieros[0].margen * 100).toFixed(1)}%</div>
                    : '-'}
                </td>
                <td>
                  <div className="badge badge-ghost font-mono">
                    {sim.casosAleatorios?.length || 0}
                  </div>
                </td>
                <td className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(sim.id)}
                    className="btn btn-sm btn-ghost btn-circle text-info tooltip"
                    data-tip="Ver Detalles"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => onExport(sim.id, sim.identificador_sim)}
                    className="btn btn-sm btn-ghost btn-circle text-success tooltip"
                    data-tip="Exportar Excel"
                  >
                    <FiDownload size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-10 opacity-50">
                  No se encontraron simulaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filtered.length > 0 && (
        <div className="p-4 border-t border-base-300 flex justify-between items-center bg-base-200/20">
          <p className="text-sm opacity-60">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filtered.length)} de {filtered.length}
          </p>
          <div className="join">
            <button 
              className="join-item btn btn-sm" 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : ''}`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="join-item btn btn-sm" 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationTable;
