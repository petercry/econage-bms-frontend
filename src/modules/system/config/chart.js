import * as Chart from 'echarts/core';
import {TooltipComponent,LegendComponent,GridComponent} from 'echarts/components';

import {PieChart,BarChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
Chart.use(
    [TooltipComponent, LegendComponent, PieChart, CanvasRenderer,GridComponent,BarChart]
)


export default Chart;