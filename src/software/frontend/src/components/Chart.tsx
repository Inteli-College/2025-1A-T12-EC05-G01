import ApexChart from 'react-apexcharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function Chart() {
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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

    const series = [{
        name: "sucessos",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }]

    return(
        <ChartContainer>
            <ApexChart 
                options={options}
                series={series}
            />
        </ChartContainer>
    )
}

export default Chart;