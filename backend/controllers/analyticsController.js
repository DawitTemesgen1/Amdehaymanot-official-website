const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const propertyId = '549318570';
const keyFilePath = path.join(__dirname, '../amdehaymanot-zimare-and-web-908825f44cf2.json');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: keyFilePath,
});

exports.getAnalyticsStats = async (req, res) => {
  try {
    const cacheKey = 'analytics_dashboard_stats';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData });
    }

    // 1. Real-time active users (last 30 mins)
    const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    });
    const realtimeUsers = realtimeResponse.rows.length > 0 ? parseInt(realtimeResponse.rows[0].metricValues[0].value, 10) : 0;

    // 2. Overall KPIs (Last 30 Days)
    const [kpiResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ],
    });
    const kpiRow = kpiResponse.rows.length > 0 ? kpiResponse.rows[0].metricValues : null;
    const activeUsers = kpiRow ? parseInt(kpiRow[0].value, 10) : 0;
    const newUsers = kpiRow ? parseInt(kpiRow[1].value, 10) : 0;
    const avgSessionDuration = kpiRow ? parseFloat(kpiRow[2].value).toFixed(1) : 0;
    const bounceRate = kpiRow ? (parseFloat(kpiRow[3].value) * 100).toFixed(1) : 0;

    // 3. App Downloads (Last 30 Days)
    const [downloadsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', stringFilter: { value: 'first_open' } }
      },
      metrics: [{ name: 'eventCount' }]
    });
    const downloadsCount = downloadsResponse.rows.length > 0 ? parseInt(downloadsResponse.rows[0].metricValues[0].value, 10) : 0;

    // 4. Time-Series (Last 30 Days) - Website Visitors
    const [timeseriesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }]
    });
    const timeseriesData = timeseriesResponse.rows.map(row => {
      const dateStr = row.dimensionValues[0].value;
      const formattedDate = `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
      return {
        date: formattedDate,
        visitors: parseInt(row.metricValues[0].value, 10)
      };
    });

    // 5. Device Categories (Last 30 Days)
    const [devicesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }]
    });
    const deviceData = devicesResponse.rows.map(row => ({
      name: row.dimensionValues[0].value,
      value: parseInt(row.metricValues[0].value, 10)
    }));

    const responseData = {
      realtimeUsers,
      activeUsers,
      newUsers,
      avgSessionDuration,
      bounceRate,
      downloadsCount,
      timeseriesData,
      deviceData
    };

    cache.set(cacheKey, responseData);
    res.json({ success: true, data: responseData });

  } catch (error) {
    console.error('Error fetching Analytics data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics data' });
  }
};
