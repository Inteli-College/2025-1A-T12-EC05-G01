import ApexChart from 'react-apexcharts';

function Chart() {

    const options = {
        chart: {
            type: 'line',
            zoom: {
                enable: false
            }
        },
        title: {
            text: 'Taxa de sucesso',
            align: 'left',
            style: {
                fontSize:  '24px',
                fontWeight:  'bold',
                color:  '#ffff'
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
                }
            }
        },
        yaxis: {
            labels:{
                style: {
                    colors: '#FFF',
                }
            }
        },

        colors: ['#FFF']
    }

    const series = [{
        name: "sucessos",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }]

    return(
        <ApexChart 
            options={options}
            series={series} 
        />
    )
}

export default Chart