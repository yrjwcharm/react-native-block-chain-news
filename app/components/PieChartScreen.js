import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    processColor,
} from 'react-native';
import {PieChart} from 'react-native-charts-wrapper';
class PieChartScreen extends React.Component {

    constructor() {
        super();

        this.state = {
            legend: {
                enabled: false,
                textSize: 15,
                form: 'CIRCLE',

                horizontalAlignment: "RIGHT",
                verticalAlignment: "CENTER",
                orientation: "VERTICAL",
                wordWrapEnabled: true
            },
            data: {
                dataSets: [{
                    values: [{value: 15, label: '系统拒绝'},
                        {value: 35, label: '人工拒绝'},
                        {value: 50, label: '审核通过'},],
                    label: '',
                    config: {
                        colors: [processColor('#f6bf54'), processColor('#ed7074'), processColor('#6196ff')],
                        valueTextSize: moderateScale(12),
                        valueTextColor: processColor('#666'),
                        // sliceSpace: 5,
                        // selectionShift: 13,
                        xValuePosition: "OUTSIDE_SLICE",
                        yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('#dcdcdc'),
                        valueLinePart1Length: 0.5
                    }
                }],
            },
            highlights: [{x:2}],
            description: {
                text: '',
                // textSize: 15,
                // textColor: processColor('darkgray'),

            }
        };
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({...this.state, selectedEntry: null})
        } else {
            this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
        }

        console.log(event.nativeEvent)
    }

    render() {
        return (
                    <PieChart
                        style={{height:verticalScale(140)}}
                        logEnabled={true}
                        chartBackgroundColor={processColor('#f5f5f5')}
                        chartDescription={this.state.description}
                        data={this.state.data}
                        legend={this.state.legend}
                        highlights={this.state.highlights}
                        entryLabelColor={processColor('#666')}
                        entryLabelTextSize={moderateScale(12)}
                        drawEntryLabels={true}

                        rotationEnabled={true}
                        rotationAngle={90}
                        usePercentValues={true}
                        styledCenterText={{text:'总审核320', color: processColor('#666'), size: moderateScale(12)}}
                        // centerTextRadiusPercent={100}
                        // holeRadius={40}
                        holeColor={processColor('#f5f5f5')}
                        transparentCircleRadius={360}
                        transparentCircleColor={processColor('#f5f5f5')}
                        // maxAngle={350}
                        onSelect={this.handleSelect.bind(this)}
                        onChange={(event) => console.log(event.nativeEvent)}
                    />
        );
    }
}
export default PieChartScreen;
