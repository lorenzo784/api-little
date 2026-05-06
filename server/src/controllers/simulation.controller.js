import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';

const prisma = new PrismaClient();

export const getAllSimulations = async (req, res) => {
  try {
    const simulations = await prisma.simulacion.findMany({
      include: {
        resultadosFinancieros: true,
        casosAleatorios: true,
        clientesDetalle: false, // Opcional, lo dejamos fuera de la lista principal por rendimiento
      },
      orderBy: { fecha: 'desc' },
    });
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSimulationById = async (req, res) => {
  const { id } = req.params;
  try {
    const simulation = await prisma.simulacion.findUnique({
      where: { id: parseInt(id) },
      include: {
        resultadosFinancieros: true,
        clientesDetalle: true,
        casosAleatorios: true,
      },
    });
    if (!simulation) {
      return res.status(404).json({ error: 'Simulacion no encontrada' });
    }
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportToExcel = async (req, res) => {
  const { id } = req.params;
  try {
    const simulation = await prisma.simulacion.findUnique({
      where: { id: parseInt(id) },
      include: {
        casosAleatorios: true,
        clientesDetalle: true,
      },
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulacion no encontrada' });
    }

    // Sheet 1: General Data
    const summaryData = [
      {
        ID: simulation.id,
        Fecha: simulation.fecha,
        Identificador: simulation.identificador_sim,
        Lambda: simulation.lambd,
        Mu: simulation.mu,
        S: simulation.s,
        'Tiempo Sim': simulation.tiempo_sim,
        Wq: simulation.wq,
        W: simulation.w,
        Lq: simulation.lq,
        L: simulation.l,
        Rho: simulation.rho,
      },
    ];

    // Sheet 2: Pivoted Random Cases (Single row with type_idx columns)
    const pivotedRow = {};
    simulation.casosAleatorios.forEach((caso) => {
      pivotedRow[`${caso.tipo}_${caso.idx}`] = caso.valor;
    });

    const pivotedData = [pivotedRow];

    // Sheet 3: Client Details
    const clientDetailsData = (simulation.clientesDetalle || []).map((cli) => ({
      'Cliente #': cli.clienteNumero,
      'Tiempo Llegada': cli.tiempoLlegada,
      'Tiempo Inicio': cli.tiempoInicio,
      'Tiempo Fin': cli.tiempoFin,
      'Tiempo Espera': cli.tiempoEspera,
      'Tiempo Servicio': cli.tiempoServicio,
    }));

    // Create workbook
    const wb = xlsx.utils.book_new();
    const wsSummary = xlsx.utils.json_to_sheet(summaryData);
    const wsPivoted = xlsx.utils.json_to_sheet(pivotedData);
    const wsClients = xlsx.utils.json_to_sheet(clientDetailsData);

    xlsx.utils.book_append_sheet(wb, wsSummary, 'Resumen');
    xlsx.utils.book_append_sheet(wb, wsPivoted, 'Casos Aleatorios');
    xlsx.utils.book_append_sheet(wb, wsClients, 'Detalle Clientes');

    // Generate buffer
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=simulacion_${simulation.identificador_sim}.xlsx`
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
