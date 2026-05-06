import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SimulationTable from '../components/SimulationTable';
import SimulationDetail from '../components/SimulationDetail';
import { FiRefreshCw } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const SimulationPage = () => {
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/simulaciones`);
      setSimulations(response.data);
    } catch (error) {
      console.error('Error fetching simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const handleViewDetail = async (id) => {
    setDetailLoading(true);
    try {
      const response = await axios.get(`${API_URL}/simulaciones/${id}`);
      setSelectedSimulation(response.data);
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleExport = async (id, name) => {
    try {
      const response = await axios({
        url: `${API_URL}/simulaciones/export/${id}`,
        method: 'GET',
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `simulacion_${name}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting excel:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="font-bold opacity-50 animate-pulse">Cargando simulaciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {!selectedSimulation ? (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
              <p className="text-lg opacity-60">Monitoreo de resultados de simulación</p>
            </div>
            <button 
              onClick={fetchSimulations}
              className="btn btn-circle btn-ghost"
            >
              <FiRefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <SimulationTable 
            simulations={simulations} 
            onView={handleViewDetail}
            onExport={handleExport}
          />
        </div>
      ) : (
        <div className="relative">
          {detailLoading && (
            <div className="absolute inset-0 bg-base-100/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
          <SimulationDetail 
            simulation={selectedSimulation} 
            onBack={() => setSelectedSimulation(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default SimulationPage;
