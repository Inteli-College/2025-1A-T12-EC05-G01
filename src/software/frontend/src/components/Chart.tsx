import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function Chart() {
  const [successRates, setSuccessRates] = useState<number[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/prescricao_aceita/read-all")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.prescricoes)) {
          const meses = Array(12).fill(0).map((_, i) => ({ sucesso: 0, erro: 0 })); 

          data.prescricoes.forEach((p: any) => {
            const mes = new Date(p.data_validacao).getMonth(); 
            if (p.status_prescricao === "selada") {
              meses[mes].sucesso++;
            } else if (p.status_prescricao === "erro_separacao") {
              meses[mes].erro++;
            }
          });

          const taxasPorMes = meses.map(m =>
            m.sucesso + m.erro > 0 ? (m.sucesso / (m.sucesso + m.erro)) * 100 : 0
          );

          setSuccessRates(taxasPorMes);
        }
      })
      .catch(error => console.error("Erro ao buscar prescrições:", error));
  }, []);

  const options = {
    chart: {
      type: 'line',
      zoom: { 
        enable: false 
      },
      background: '#34495E',
      fontFamily: 'Montserrat, sans-serif',
    },
    title: {
      text: 'Taxa de sucesso',
      align: 'left',
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ffff',
        fontFamily: 'Montserrat, sans-serif'
      },
    },
    grid:{
      row: {
        colors: ['#34495E'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#FFF',
          fontFamily: 'Montserrat, sans-serif'
        }
      }
    },
    yaxis: {
      labels:{
        style: {
          colors: '#FFF',
          fontFamily: 'Montserrat, sans-serif'
        }
      }
    },
    colors: ['#2ECC71'],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    markers: {
      size: 5,
      colors: '#2ECC71',
      strokeColors: '#fff',
      strokeWidth: 2
    }
  }

  const series = [
    {
      name: 'Taxa de Sucesso (%)',
      data: successRates,
    },
  ];

  return (
    <ChartContainer>
      <ApexChart 
        options={options} 
        series={series} 
        type="line" height={350} />
    </ChartContainer>
  )
}

export default Chart;