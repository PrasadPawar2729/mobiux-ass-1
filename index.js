const fs = require('fs');

function processSalesData(filename) {
 
    const rows = fs.readFileSync(filename, 'utf8').trim().split('\n');
    const salesData = rows.slice(1).map(row => row.split(','));


    let overallSales = 0;
    salesData.forEach(record => {
        overallSales += parseFloat(record[4]); 
    });
    console.log('Overall Sales: $' + overallSales.toFixed(2));

   
    const monthlyRevenue = {};
    salesData.forEach(record => {
        const month = record[0].split('-')[1]; 
        const totalPrice = parseFloat(record[4]);
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + totalPrice;
    });
    console.log('Monthly Revenue:', monthlyRevenue);

   
    const productStats = {};
    salesData.forEach(record => {
        const month = record[0].split('-')[1];
        const productID = record[1];
        const quantitySold = parseInt(record[3]);
        const revenueGenerated = parseFloat(record[4]);

        if (!productStats[month]) {
            productStats[month] = {};
        }
        if (!productStats[month][productID]) {
            productStats[month][productID] = { quantitySold: 0, revenueGenerated: 0 };
        }
        productStats[month][productID].quantitySold += quantitySold;
        productStats[month][productID].revenueGenerated += revenueGenerated;
    });

    Object.keys(productStats).forEach(month => {
        const items = Object.entries(productStats[month]);
        const mostSoldItem = items.sort((a, b) => b[1].quantitySold - a[1].quantitySold)[0];
        const highestEarningItem = items.sort((a, b) => b[1].revenueGenerated - a[1].revenueGenerated)[0];

        console.log(`Month: ${month}`);
        console.log('Most Sold Item:', mostSoldItem[0], (`${mostSoldItem[1].quantitySold} sold`));
        console.log('Top Earning Item:', highestEarningItem[0], (`$${highestEarningItem[1].revenueGenerated.toFixed(2)}`));
    });
}

processSalesData('Data.csv');
