const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const propertyId = '549318570';
const keyFilePath = path.join(__dirname, '../amdehaymanot-zimare-and-web-908825f44cf2.json');

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: keyFilePath,
});

exports.getAnalyticsStats = async (req, res) => {
  try {
    // 1. Total Visitors (Active Users) over the last 30 days
    const [visitorsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });
    
    const visitorsCount = visitorsResponse.rows.length > 0 
      ? visitorsResponse.rows[0].metricValues[0].value 
      : '0';

    // 2. Total App Downloads (first_open event) over the last 30 days
    const [downloadsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'first_open'
          }
        }
      },
      metrics: [{ name: 'eventCount' }]
    });

    const downloadsCount = downloadsResponse.rows.length > 0 
      ? downloadsResponse.rows[0].metricValues[0].value 
      : '0';

    res.json({
      success: true,
      data: {
        visitorsAllTime: parseInt(visitorsCount, 10),
        downloadsAllTime: parseInt(downloadsCount, 10)
      }
    });

  } catch (error) {
    console.error('Error fetching Analytics data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics data' });
  }
};
